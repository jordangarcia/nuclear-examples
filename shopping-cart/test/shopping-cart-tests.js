var expect = require('chai').expect
var Immutable = require('immutable')
var Map = Immutable.Map
var List = Immutable.List
var shoppingCart = require('../')

var getItems = shoppingCart.getters.items
var getTaxPercent = shoppingCart.getters.taxPercent
var getSubtotal = shoppingCart.getters.subtotal
var getTax = shoppingCart.getters.tax
var getTotal = shoppingCart.getters.total

describe("shoppingCart", function() {
  afterEach(function() {
    shoppingCart.reset()
  })

  it('shouuld have the correct initial state', function() {
    var isEmptyList = Immutable.is(shoppingCart.get(getItems), Immutable.List())
    expect(isEmptyList).to.equal(true)
    expect(shoppingCart.get(getTaxPercent)).to.equal(0)
    expect(shoppingCart.get(getSubtotal)).to.equal(0)
    expect(shoppingCart.get(getTax)).to.equal(0)
    expect(shoppingCart.get(getTotal)).to.equal(0)
  })

  it('should properly add an item', function() {
    shoppingCart.actions.addItem('soap', 5, 2)

    var item = Map({
      name: 'soap',
      price: 5,
      quantity: 2,
    })

    var expectedItems = List([item])
    var actualItems = shoppingCart.get(getItems)

    expect(Immutable.is(actualItems, expectedItems)).to.equal(true)

    expect(shoppingCart.get(getTaxPercent)).to.equal(0)
    expect(shoppingCart.get(getSubtotal)).to.equal(10)
    expect(shoppingCart.get(getTax)).to.equal(0)
    expect(shoppingCart.get(getTotal)).to.equal(10)
  })

  it('should properly add multiple items and factor tax percent', function() {
    shoppingCart.actions.addItem('soap', 5, 2)
    shoppingCart.actions.addItem('dvd', 10, 1)
    shoppingCart.actions.setTaxPercent(10)

    var item1 = Map({
      name: 'soap',
      price: 5,
      quantity: 2,
    })

    var item2 = Map({
      name: 'dvd',
      price: 10,
      quantity: 1,
    })

    var expectedItems = List([item1, item2])
    var actualItems = shoppingCart.get(getItems)

    expect(Immutable.is(actualItems, expectedItems)).to.equal(true)

    expect(shoppingCart.get(getTaxPercent)).to.equal(10)
    expect(shoppingCart.get(getSubtotal)).to.equal(20)
    expect(shoppingCart.get(getTax)).to.equal(2)
    expect(shoppingCart.get(getTotal)).to.equal(22)
  })
})
