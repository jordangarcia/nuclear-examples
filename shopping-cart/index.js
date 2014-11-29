var Getter = require('nuclear-js').Getter
var reactor = require('./reactor')

/**
 * Expose a public interface for other modules to
 * use the shopping cart
 */
var getSubtotal = Getter('items', function(items) {
  return items.reduce(function(total, item) {
    return total + (item.get('quantity') * item.get('price'))
  }, 0)
})

var getTax = Getter(
  getSubtotal,
  'taxPercent',
  function(subtotal, taxPercent) {
    return (subtotal * (taxPercent / 100))
  })

var getTotal = Getter(
  getSubtotal,
  getTax,
  function(subtotal, tax) {
    return subtotal + tax
  })

// expose getters on reactor
reactor.getters = {
  items: Getter('items'),
  taxPercent: Getter('taxPercent'),
  subtotal: getSubtotal,
  tax: getTax,
  total: getTotal,
}

// expose actions on reactor
reactor.actions = reactor.bindActions({
  addItem: function(reactor, name, price, quantity) {
    reactor.dispatch('addItem', {
      name: name,
      price: price,
      quantity: quantity,
    })
  },

  setTaxPercent: function(reactor, taxPercent) {
    reactor.dispatch('setTaxPercent', taxPercent)
  },
})

module.exports = reactor
