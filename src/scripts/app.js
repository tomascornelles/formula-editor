(function app() {

  const state = {
    products: []
  }
  const _setState = (prop, value) => {
    state[prop] = value
    window.localStorage.setItem('state', JSON.stringify(state))
  }
  const _getState = prop => state[prop]

  const _getProducts = () => {

    const json = (window.localStorage.getItem('state'))
      ? JSON.parse(window.localStorage.getItem('state'))
      : require('./products.json');
    _setState('products', json.products)
    _render()
  }

  const _render = () => {
    const p = (_getState('page')) ? _getState('page') : 1
    console.log(p)
    let list = document.querySelector('.list')
    list.innerHTML = ''
    let min = 1 + (50 * (p - 1))
    let max = 50 + (50 * (p - 1))
    let i = 1
    state.products.forEach(product => {
      if (i >= min && i <= max) {
        let row = document.createElement('article')
        row.classList.add('row')
        row.id = product.id
        row.innerHTML = `
          <div class="pre">
            <img src="${product.image}" alt="${product.title}" class="image">
            <div class="box">
              <p class="title">${product.title}<strong class="price">${product.price}€</strong></p>
            </div>
          </div>
          <div class="formula">
            <div class="display-mode js-display-mode">
              <button class="edit-formula js-edit-formula" data-id="${product.id}">${product.formula}</button>
            </div>
            <div class="edit-mode js-edit-mode">
              <input type="text" value="${product.formula}" class="js-formula">
              <p class="error">Invalid formula</p>
              <button class="js-cancel-formula grey" data-id="${product.id}">CANCEL</button>
              <button class="js-save-formula" data-id="${product.id}">SAVE</button>
            </div>
          </div>
          <div class="post">
            <img src="${product.image}" alt="${product.title}" class="image">
            <div class="box">
              <p class="title">${product.title}<strong class="price js-priceFormula">${_priceFormula(product.id)}€</strong></p>
            </div>
          </div>
        `
        list.append(row)
      }
      i++
    });

    const pagination = () => {
      const prev = `<button class="js-page" data-pag="${p - 1}">❮ prev</button>`
      const next = `<button class="js-page" data-pag="${p + 1}">next ❯</button>`
      let buttons = ''
      if (p !== 1) buttons += prev
      if (p < (state.products.length / 50)) buttons += next
      const pagBar = document.createElement('div')
      pagBar.classList.add('pagination')
      pagBar.innerHTML = `Showing from ${1 + 50 * (p - 1)} to ${(50 * p > state.products.length) ? state.products.length : 50 * p} of ${state.products.length} <dib class="buttons"> ${buttons}</div>`
      return pagBar
    }
    list.prepend(pagination())
    const pagButtons = document.querySelectorAll('.js-page')
    pagButtons.forEach(button => {
      button.addEventListener('click', function () { _goToPage(this.dataset.pag) })
    });

    const editButtons = document.querySelectorAll('.js-edit-formula')
    editButtons.forEach(button => {
      button.addEventListener('click', function () { _editFormula(this.dataset.id) })
    });
    const saveButtons = document.querySelectorAll('.js-save-formula')
    saveButtons.forEach(button => {
      button.addEventListener('click', function () { _saveFormula(this.dataset.id) })
    });
    const cancelButtons = document.querySelectorAll('.js-cancel-formula')
    cancelButtons.forEach(button => {
      button.addEventListener('click', function () { _cancelFormula(this.dataset.id) })
    });
  }

  const _update = id => {
    document.querySelector(`#${id} .js-priceFormula`).innerHTML = `${_priceFormula(id)}€`
  }

  const _goToPage = p => {
    _setState('page', 1 * p)
    _render()
  }

  const _editFormula = id => {
    document.querySelector(`#${id} .js-display-mode`).style.display = 'none'
    document.querySelector(`#${id} .js-edit-mode`).style.display = 'block'
    document.querySelector(`#${id} .js-formula`).focus()
  }
  const _saveFormula = id => {
    if (_validateFormula(id)) {
      document.querySelector(`#${id} .js-display-mode`).style.display = 'block'
      document.querySelector(`#${id} .js-edit-mode`).style.display = 'none'
      _update(id)
    } else {
      document.querySelector(`#${id} .js-edit-mode .error`).style.display = 'block'
    }
  }
  const _cancelFormula = id => {
    const product = state.products.filter(product => product.id === id)
    document.querySelector(`#${id} .js-display-mode`).style.display = 'block'
    document.querySelector(`#${id} .js-edit-mode`).style.display = 'none'
    document.querySelector(`#${id} .js-formula`).value = product[0].formula
  }

  const _validateFormula = id => {
    const product = state.products.filter(product => product.id === id)
    const value = document.querySelector(`#${id} .js-formula`).value.toLowerCase()
    const formula = value.split('p').join(product[0].price)
    try {
      eval(formula)
      state.products.map(product => { if (product.id === id) product.formula = value })
      _setState('products', state.products)
      return true
    } catch (error) {
      return false
    }
  }

  const _priceFormula = id => {
    const product = state.products.filter(product => product.id === id)
    const formula = product[0].formula.split('p').join(product[0].price)
    return eval(formula)
  }

  const _init = () => {
    _getProducts()
  }

  _init()
})()