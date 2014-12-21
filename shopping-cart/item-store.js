var Nuclear = require('nuclear-js')
var toImmutable = require('nuclear-js').toImmutable

module.exports = Nuclear.Store({
  getInitialState: function() {
    return []
  },

  initialize: function() {
    this.on('addItem', function(items, payload) {
      var item = toImmutable({
        name: payload.name,
        price: payload.price,
      })
      return items.push(item)
    })
  }
})
