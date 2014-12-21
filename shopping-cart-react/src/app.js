/**
 * @jsx React.DOM
 */
var React = require('react');
var AddItemForm = require('./add-item-form')
var ShoppingCartList = require('./shopping-cart-list')
var shoppingCart = require('../../shopping-cart')

var App = React.createClass({
  render() {
    return (
      <div>
        <AddItemForm />
        <ShoppingCartList />
      </div>
    )
  }
})

shoppingCart.addItem('food 1', 1)
shoppingCart.addItem('food 2', 2)

React.render(<App />, document.getElementById('app'))

shoppingCart.addItem('food 3', 3)
