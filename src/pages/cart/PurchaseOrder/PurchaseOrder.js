import React, { Component } from 'react'
import PropTypes from "prop-types"
import { actions } from 'react-redux-form'
import SummaryTable from "../components/SummaryTable/SummaryTable"
import Shipping from "./components/Shipping"
import ShippingEdit from "./components/ShippingEdit"
import ShippingQuote from "./components/ShippingQuote"
import Payment from "./components/Payment"
import CartItemSummary from './components/CartItemSummary'
import { Container, Menu, Header, Button, Icon } from "semantic-ui-react"
import Spinner from '../../../components/Spinner/Spinner'
import "./PurchaseOrder.scss"
import {FormattedMessage} from 'react-intl'
import {checkToken} from "../../../utils/auth"
import Router from 'next/router'

class PurchaseOrder extends Component {
  //TODO: maybe move internal state to redux? decide it later
  state = {
    selectedAddress: {},
    selectedPayment: {},
    isShippingEdit: false,
    isNewAddress: "isNew",
    shippingQuotes: []
  }

  constructor(props) {
    super(props);
    this.deleteCart = this.deleteCart.bind(this);
  }

  componentDidMount(){
    this.props.getCart()
    this.props.getDeliveryAddresses()
    this.props.getPayments()
  }

  handleIsEdit = (value) => {
    const {selectedAddress} = this.state;
    this.setState({isNewAddress: value});

    value === "isNew"
    ? this.props.dispatch(actions.reset('forms.shippingEdit'))
    : this.props.dispatch(actions.merge('forms.shippingEdit', {
      firstName: selectedAddress["first name"],
      lastName: selectedAddress["last name"],
      address: {
        streetAddress: selectedAddress.address.streetAddress,
        city: selectedAddress.address.city,
        province: selectedAddress.address.province.name
      },
      zipCode: selectedAddress.address.zip.zip,
      email: selectedAddress.email,
      phoneNumber: selectedAddress["phone number"]
  }));
  }

  getAddress = (selectedAddressId) => {
    const {deliveryAddresses} = this.props;
    const selectedAddress = deliveryAddresses.find(i => i.id === selectedAddressId);
    this.setState({selectedAddress});
    this.getShippingQuotes(selectedAddress);
  }

  getPayment = (selectedPaymentId) => {
    const {payments} = this.props;
    const selectedPayment = payments.find(i => i.id === selectedPaymentId);
    this.setState({selectedPayment});
  }

  getShippingQuotes = (selectedAddress) => {
    // TODO:: 'USA' to ID and variable
    this.props.getShippingQuotes(1, selectedAddress.address.zip.zip);
  }

  toggleShippingEdit = () => {
    this.setState(prevState => ({
      isShippingEdit: !prevState.isShippingEdit
    }));
  }

  //TODO:: same function in Shopping cart, define it just at one place
  renderSummary() {
    const {totalPrice} = this.props.cart;
    return (
      <table>
        <tbody>
          <tr>
              <td>
                  <FormattedMessage
                      id='cart.subtotal'
                      defaultMessage='Subtotal'
                  />
              </td>
              <td>$111</td>
          </tr>
          <tr>
              <td>
                  <FormattedMessage
                    id='cart.estimatedShipping'
                    defaultMessage='Estimated Shipping'
                  />
              </td>
              <td>$111</td>
          </tr>
          <tr>
              <td>
                  <FormattedMessage
                    id='cart.estimatedTax'
                    defaultMessage='Estimated Tax'
                  />
              </td>
              <td>$111</td>
          </tr>
          <tr>
              <td>
                  <FormattedMessage
                    id='cart.total'
                    defaultMessage='Total'
                  />
              </td>
              <td>${totalPrice}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  deleteCart() {
      if (checkToken(this.props)) return;
      this.props.deleteCart();
  }

  handlePurchase() {
    // TODO: do purchase
  }

  render() {
    const {cart, deliveryAddresses, payments, dispatch, deleteCart, cartIsFetching, postNewDeliveryAddress, putDeliveryAddressEdit, shippingQuotes} = this.props;
    if (cartIsFetching) return <Spinner />
    let index = 0;
    const itemContent = cart.cartItems.map(cartItem => {
      return (
      <CartItemSummary
        deleteCart={deleteCart}
        cartItem={cartItem}
        key={cartItem.productOffer.id}
        itemIndex={++index}
      />)
    });
    return (
      <div className="app-inner-main">
        <div className="header-top">
          <Container fluid>
            <Menu secondary>
              <Menu.Item header>
                <Header as='h1' size='medium'>
                  <FormattedMessage id='cart.purchaseOrder'
                                    defaultMessage='PURCHASE ORDER' />
                </Header>
              </Menu.Item>

              <Menu.Menu position='right'>
                <Menu.Item>
                  <Button icon basic labelPosition='left' onClick={() => { Router.push('/marketplace/all') }}>
                    <Icon name='chevron left' />
                    <FormattedMessage id='cart.backToProductOfferings'
                                      defaultMessage='Back to Product Offerings' />
                  </Button>
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Container>
        </div>
        <div className="shopping-cart checkout">
          <div className="shopping-cart-body">

          <div>
            {this.state.isShippingEdit ? <ShippingEdit
                toggleShippingEdit={this.toggleShippingEdit}
                selectedAddress={this.state.selectedAddress}
                isNewAddress={this.state.isNewAddress}
                handleIsEdit={this.handleIsEdit}
                postNewDeliveryAddress={postNewDeliveryAddress}
                putDeliveryAddressEdit={putDeliveryAddressEdit}
              />
              : <Shipping
              deliveryAddresses={deliveryAddresses}
              dispatch={dispatch}
              toggleShippingEdit={this.toggleShippingEdit}
              getAddress={this.getAddress}
              selectedAddress={this.state.selectedAddress}
              />}
            <ShippingQuote
              selectedAddress={this.state.selectedAddress}
              shippingQuotes={shippingQuotes}
              shippingQuotesAreFetching={this.props.shippingQuotesAreFetching}
              />
            <Payment
              dispatch={dispatch}
              selectedAddress={this.state.selectedAddress}
              selectedPayment={this.state.selectedPayment}
              payments={payments}
              getPayment={this.getPayment}
              />

          </div>
          <div className="summary-tables">
            <SummaryTable title="Your Order">
              {itemContent}
            </SummaryTable>
            <SummaryTable title="Summary" hasButton={<FormattedMessage id='cart.placeOrder' defaultMessage='Place Order' />} handleContinue={this.handlePurchase}>
              {this.renderSummary()}
            </SummaryTable>
          </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PurchaseOrder;

PurchaseOrder.propTypes = {
  cartItem: PropTypes.object,
  deliveryAddresses: PropTypes.array,
  dispatch: PropTypes.func,
  getCart: PropTypes.func,
  getDeliveryAddresses: PropTypes.func,
  deleteCart: PropTypes.func,
  selectedAddressId: PropTypes.number,
  shippingQuotes: PropTypes.array
}
