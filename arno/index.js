/**
 * @jsx React.DOM
 */
var React = require('react');
//var Title = require('react-document-title');

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

console.log('items: ', reactor.get('items')) // List []
console.log('taxPercent', reactor.get('taxPercent')) // 0

reactor.dispatch('addItem', { name: 'First hard coded Dispatch -> Soap', price: 5, quantity: 2 })
reactor.dispatch('addItem', { name: 'Another hard coded item dispatch -> Chocolate', price: 2.5, quantity: 4 })
reactor.dispatch('addItem', { name: 'Last hard coded item dispatch, soft dispatches via button wont add up below', price: 2.5, quantity: 4 })

console.log('Items after dispatch: ', reactor.get('items')) // List [ Map { name: 'Soap', price:5, quantity: 2 } ]

// computing text, totals etc

var Getter = require('nuclear-js').Getter

var getSubtotal = Getter('items', function(items)  {
  return items.reduce(function(total, item)  {
    return total + (item.get('price') * item.get('quantity'))
  }, 0)
})

var getTax = Getter(getSubtotal, 'taxPercent', function(subtotal, taxPercent)  {
  return subtotal * (taxPercent / 100)
})

var getTotal = Getter(getSubtotal, getTax, function(subtotal, tax)  {return subtotal + tax;})

console.log('getSubtotal: ', reactor.get(getSubtotal)) // 10
console.log('getTax: ', reactor.get(getTax)) // 0
console.log('getTotal: ', reactor.get(getTotal)) // 10

reactor.dispatch('setTaxPercent', 20) // TypeError: Object #<Reactor> has no method 'dispach' -> there was a missing t (dispach)

console.log('getSubtotal: ', reactor.get(getSubtotal)) // 11
console.log('getTax: ', reactor.get(getTax)) // 1
console.log('getTotal: ', reactor.get(getTotal)) // 11

// More interesting...

var over100 = Getter(getTotal, function(total)  {return total > 100;})

reactor.observe(getTotal, function(total)  {
  if (total > 100) {
    alert('Shopping cart over 100!')
  }
})

// More dynamic...

var budgetStore = Store({
  getInitialState: function() {
    return Infinity
  },
  initialize: function() {
    this.on('setBudget', function(currentBudget, newBudget)  {return newBudget;})
  }
})

reactor.attachStore('budget', budgetStore) // stores can be attached at any time

var isOverBudget = Getter(getTotal, 'budget', function(total, budget)  {
  return total > budget
})

reactor.observe(isOverBudget, function(isOver)  {
  // this will be automatically reevaluated only when the total or budget changes
  if (isOver) {
    var budget = reactor.get('budget')
    alert("Is over budget of " + budget)
  }
})

// Hooking up React

var Datatest = React.createClass({

  displayName: 'Datatest',

  mixins: [NuclearReactMixin(reactor)],

  // simply implement this function to keep a components state
  // in sync with a Nuclear Reactor
  getDataBindings:function() {
    debugger;
    return {
      // can reference a reactor KeyPath
      items: 'items',
      taxPercent: 'taxPercent',
      // or reference a Getter
      subtotal: getSubtotal,
      tax: getTax,
      total: getTotal,
    }
  },

  getInitialState: function() {
    return {name: '', price: '', quantity: 1, counter: 0};
  },

  handleSubmit:function(e) {
    e.preventDefault()
    //console.log('e: ', e);
    //console.log('name from handleSubmit: ', this.state.name, this.state.price, this.state.quantity);
    // alert('Data: ', this.state.name, this.state.price, this.state.quantity); // Keine Daten im Alert-Fenster :(
    var submitData = {
      name: this.state.name,
      price: Number(this.state.price),
      quantity: this.state.quantity
    };
    reactor.dispatch('addItem', submitData);
    // Dispatching a random taxPercent value -> gets not rerendered
    //reactor.dispatch('setTaxPercent', Math.floor((Math.random() * 15) + 1));
    //var newCounter = this.state.counter +1;
    //this.setState({counter: newCounter});
    //console.log('this.state.counter: ', this.state.counter); // gets executed so quickly, the console prints the old value still
  },

  //handleChange: function(event) { // Not necessary due to React.addons.LinkedStateMixin
    //this.setState({name: event.target.value.substr(0, 140)}); // = input 140 Zeichen max.
    //console.log('name: ', this.state.name);
  //},

  updatePrice(e) {
    this.setState({
      price: e.target.value
    })
  },

  updateName(e) {
    this.setState({
      name: e.target.value
    })
  },

  render() {
    var name = this.state.name;
    var itemRows = this.state.items.toList().toJS().map(function(item) {
      return (
        <tr>
          <td>{item.quantity}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
        </tr>
      )
    })

    return(
      <div>
        <table>
          <tr>
            <td>
              <form ref="form" onSubmit={this.handleSubmit} className="form-horizontal">
                <input type="text" onChange={this.updateName} value={this.state.name} />
                <input type="text" onChange={this.updatePrice} value={this.state.price} />
                <button type="submit">submit</button>
              </form>
            </td>
          </tr>
        </table>
        <table className="table">
          <tbody>
            <tr>
              <th>Quantity:</th>
              <th>Name:</th>
              <th>Price:</th>
            </tr>
            {itemRows}
          </tbody>
        </table>

        <table>
          <tr>
            <td colSpan='2'>subtotal:</td>
            <td>{this.state.subtotal}</td>
          </tr>
          <tr>
            <td colSpan='2'>handleSubmit sets this value randomly but it gets not rerendered: tax @ {this.state.taxPercent}%</td>
            <td>{this.state.tax}</td>
          </tr>
          <tr>
            <td colSpan='2'>total:</td>
            <td>{this.state.total}</td>
          </tr>
        </table>
      </div>
      )
  }
})

React.render(<Datatest />, document.getElementById('app'))
