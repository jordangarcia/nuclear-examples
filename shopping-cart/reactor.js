var Nuclear = require('nuclear-js')

module.exports = Nuclear.Reactor({
  stores: {
    items: require('./item-store'),
    taxPercent: require('./tax-percent-store'),
  }
})
