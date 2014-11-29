var Nuclear = require('nuclear-js')

module.exports = Nuclear.Store({
  getInitialState: function() {
    return 0
  },

  initialize: function() {
    this.on('setTaxPercent', function(current, newPercent) {
      return newPercent
    })
  }
})
