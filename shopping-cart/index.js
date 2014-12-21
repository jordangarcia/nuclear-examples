var Nuclear = require('nuclear-js')
var Observable = require('nuclear-js').Observable
var itemStore = require('./item-store')
var taxPercentStore = require('./tax-percent-store')

var dispatcher = Nuclear.Dispatcher()
dispatcher.registerStores({
  items: itemStore,
  taxPercent: taxPercentStore,
})

var itemsObservable = itemStore.createObservable()

var subtotalObservable = itemStore.createObservable(items => {
  return items.reduce(function(total, item) {
    return total + item.get('price')
  }, 0)
})

var taxPercentObservable = taxPercentStore.createObservable()

var taxObservable = Observable.compose([
  subtotalObservable,
  taxPercentObservable,
  (subtotal, taxPercent) => {
    return (subtotal * (taxPercent / 100))
  }
])

var totalObservable = Observable.compose([
  subtotalObservable,
  taxObservable,
  (subtotal, tax) => subtotal + tax
])

module.exports = {
  observables: {
    items: itemsObservable,
    taxPercent: taxPercentObservable,
    subtotal: subtotalObservable,
    tax: taxObservable,
    total: totalObservable,
  },

  addItem(name, price, quantity) {
    dispatcher.dispatch('addItem', {
      name: name,
      price: price,
      quantity: quantity,
    })
  },

  setTaxPercent: function(reactor, taxPercent) {
    dispatcher.dispatch('setTaxPercent', taxPercent)
  },

  reset: dispatcher.reset.bind(dispatcher),
}
