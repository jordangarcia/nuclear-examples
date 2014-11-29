var Nuclear = require('nuclear-js')
var Map = require('immutable').Map

module.exports = Nuclear.Store({
  getInitialState: function() {
    return []
  },

  initialize: function() {
    this.on('addItem', function(items, payload) {
      var quantitiy = (payload.quantity !== undefined)
        ? payload.quantity
        : 1

      return items.push(Map({
        name: payload.name,
        price: payload.price,
        quantity: quantitiy,
      }))
    })
  }
})
