var _ = require('lodash')
var toJS = require('nuclear-js').toJS
module.exports = {
  componentWillMount() {
    console.log('componentWillMount')
    this.__unobserveFns = []
    // store the observables that are locally created when passing an array
    // as a value in getDataBindings()
    this.__createdObservables = []

    if (!this.getDataBindings) {
      return
    }

    var initialState = {}

    _.each(this.getDataBindings(), (observable, key) => {
      if (_.isArray(observable)) {
        var observable = Observable.compose(observable)
        this.__createdObservables.push(observable)
      }
      initialState[key] = toJS(observable.getValue())
      var unobserve = observable.observe(val => {
        var newState = {}
        newState[key] = toJS(val)
        this.setState(newState)
      })
      this.__unobserveFns.push(unobserve)
    })
    this.setState(initialState)
  },

  componentWillUnmount: function() {
    while (this.__unobserveFns.length) {
      this.__unobserveFns.shift()()
    }

    while (this.__createdObservables.length) {
      this.__unobserveFns.shift().destroy()
    }
  }
}
