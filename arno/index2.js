/**
 * @jsx React.DOM
 */
var React = require('react');

// Require Nuclear
var Map = require('immutable').Map;
var Reactor = require('nuclear-js').Reactor;
var Store = require('nuclear-js').Store;
var NuclearReactMixin = require('nuclear-react-mixin');

// Stores

var itemStore = Store({
  // the parameter is optional, if not supplied will default to `{}`
  // stores can be any data structure including primitives
  getInitialState: function() {
    // any non-primitive value will be coerced into its immutable counterpart
    // so `{}` becomes Immutable.Map({}) and `[]` becomes Immutable.List([])
    return []
  },

  initialize: function() {
    // register a handler for `reactor.dispatch('addItem', payload)`
    this.on('addItem', function(state, payload) {
      // a handler is passed the current state and the action payload
      // it performs an immutable transformation of the store's underlying state
      // in response to the action and returns the new state
      console.log('Current state:', state);
      return state.push(Map({
        name: payload.name,
        price: payload.price,
        quantity: payload.quantity || 1,
      }))
    })
  }
})

var taxPercentStore = Store({
  getInitialState: function() {
    return 0
  },

  initialize: function() {
    // this will get called via `reactor.dispatch('setTaxPercent', 10)`
    // where the payload is a primitive value (number)
    this.on('setTaxPercent', function(percent, value) {
      return value
    })
  }
})

var reactor = Reactor({
  stores: {
    items: itemStore,
    taxPercent: taxPercentStore
  }
})

var Datatest = React.createClass({

  displayName: 'Datatest',

  mixins: [NuclearReactMixin(reactor)],

  // simply implement this function to keep a components state
  // in sync with a Nuclear Reactor
  getDataBindings:function() {
    return {
      // can reference a reactor KeyPath
      items: 'items',
      taxPercent: 'taxPercent',
    }
  },

  getInitialState: function() {
    return {name: '', price: '', quantity: '', counter: 0};
  },

  handleSubmit:function(e) {
    e.preventDefault()
    var newCounter = this.state.counter +1;
    this.setState({counter: newCounter});
    console.log('this.state.counter: ', this.state.counter); // gets executed so quickly, the console prints the old value still
  },

  //handleChange: function(event) { // Not necessary due to React.addons.LinkedStateMixin
    //this.setState({name: event.target.value.substr(0, 140)}); // = input 140 Zeichen max.
    //console.log('name: ', this.state.name);
  //},

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <button type="submit">submit</button>
        </form>
        <div>Counter, times of handleSubmit executions: {this.state.counter}</div>
      </div>
    )
  }
})

React.render(<Datatest />, document.getElementById('app'))
