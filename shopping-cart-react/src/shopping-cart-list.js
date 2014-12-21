/**
 * @jsx React.DOM
 */
var React = require('react');
var observableMixin = require('./observable-mixin')
var shoppingCart = require('../../shopping-cart')

module.exports = React.createClass({
  mixins: [observableMixin],

  getDataBindings() {
    return {
      items: shoppingCart.observables.items,
      taxPercent: shoppingCart.observables.taxPercent,
      tax: shoppingCart.observables.tax,
      subtotal: shoppingCart.observables.subtotal,
      total: shoppingCart.observables.total,
    }
  },

  render() {
    var rows = this.state.items.map(function(item)  {
      return (
        <tr>
          <td>{item.name}</td>
          <td>{item.price}</td>
        </tr>
      )
    })

    return (
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            <td>Subtotal:</td>
            <td>{this.state.subtotal}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td>{this.state.tax}</td>
          </tr>
          <tr>
            <td>Total:</td>
            <td>{this.state.total}</td>
          </tr>
        </tbody>
      </table>
    )
  },
})
