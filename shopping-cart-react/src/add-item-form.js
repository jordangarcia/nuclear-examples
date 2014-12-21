/**
 * @jsx React.DOM
 */
var React = require('react');
var observableMixin = require('./observable-mixin')
var shoppingCart = require('../../shopping-cart')

module.exports = React.createClass({
  mixins: [observableMixin],

  getInitialState() {
    return {
      name: '',
      price: 0,
    }
  },

  _submitForm(e) {
    e.preventDefault()

    shoppingCart.addItem(
      this.state.name,
      this.state.price
    )
    this.setState({
      name: '',
      price: 0,
    })
  },

  _setName(e) {
    this.setState({
      name: e.target.value
    })
  },

  _setPrice(e) {
    this.setState({
      price: Number(e.target.value)
    })
  },

  render() {
    return <form onSubmit={this._submitForm}>
      <input type="text" value={this.state.name} onChange={this._setName} placeholder="Item Name" />
      <input type="number" value={this.state.price} onChange={this._setPrice} />
      <button type="submit">Add Item</button>
    </form>
  }
})
