import {connect} from 'react-redux'
import React from "react";
import {bindActionCreators} from 'redux'
import Detail from './Detail'
import * as Actions from '../actions'
import * as OrdersHelper from "~/src/helpers/Orders"
import moment from "moment/moment"
import { getSafe } from "~/utils/functions"
import { FormattedNumber } from "react-intl";
import { ArrayToMultiple } from '~/components/formatted-messages'
import { currency } from '~/constants/index'

function actionRequired(data) {
  // return statuses code
  return getSafe(() => data.orderStatus.toString(), 0) + getSafe(() => data.shippingStatus.toString(), 0)
}

function prepareDetail(data, type) {
  if (typeof data.id === 'undefined')
    return {}

  const subtotal = getSafe(() => data.cfPriceSubtotal, 0)
  const totalPriceWithShipping = getSafe(() => data.cfPriceTotal, getSafe(() => data.cfPriceSubtotal, 0))
  const orderItems = getSafe(() => data.orderItems, [])


  return {
    acceptanceDate: (typeof data.acceptanceDate !== 'undefined' ? moment(data.acceptanceDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    amount: <FormattedNumber style='currency' currency={currency} value={subtotal} />,
    buyerRejectionDate: (typeof data.buyerRejectionDate !== 'undefined' ? moment(data.buyerRejectionDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    carrier: data.shippingMethod ? data.shippingMethod : 'N/A',
    chemicalName: <ArrayToMultiple values={orderItems.map(d => (d.echoProductName ? d.echoProductName : 'N/A'))} />,
    confirmationDate: (typeof data.confirmationDate !== 'undefined' ? moment(data.confirmationDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    contactEmail: data.sellerCompanyContactEmail ? data.sellerCompanyContactEmail : 'N/A',
    contactNumber: data.sellerCompanyContactPhone ? data.sellerCompanyContactPhone : 'N/A',
    createdBy: data.buyerName ? data.buyerName : 'N/A',
    creditStatus: OrdersHelper.getCreditStatus(data.creditStatus),
    deliveryDate: (typeof data.deliveryDate !== 'undefined' ? moment(data.deliveryDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    feesAmount: <FormattedNumber style='currency' currency={currency} value={subtotal * (0 / 100)} />,  // ! ! TBD
    feesPercent: 0, // ! ! TBD
    freight: <FormattedNumber style='currency' currency={currency} value={data.shippingPrice ? data.shippingPrice : 0} />,
    grossProfit: <FormattedNumber style='currency' currency={currency} value={data.totalPriceWithShipping ? data.totalPriceWithShipping : 0} />, // ! ! TBD
    id: data.id,
    incoterms: 'N/A', // ! ! TBD
    orderDate: moment(data.orderDate).format('MMM Do, YYYY h:mm:ss A'),
    orderStatus: OrdersHelper.getOrderStatus(data.orderStatus),
    orderType: type === 'sales' ? 'Sales' : 'Purchase',
    packaging: <ArrayToMultiple values={orderItems.map(d => ((d.packagingSize && d.packagingType && d.packagingUnit) ? d.packagingSize + ' ' + d.packagingUnit.name.toLowerCase() + ' ' + d.packagingType.name : 'N/A'))} />,
    paymentInitiationDate: (typeof data.paymentInitiationDate !== 'undefined' ? moment(data.paymentInitiationDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    paymentReceivedDate: (typeof data.paymentReceivedDate !== 'undefined' ? moment(data.paymentReceivedDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    paymentSendDate: (typeof data.paymentSendDate !== 'undefined' ? moment(data.paymentSendDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    paymentStatus: OrdersHelper.getPaymentStatus(data.paymentStatus),
    pickUpAddress: data.sellerCompanyAddressStreet + ', ' + data.sellerCompanyAddressCity + ', ' + data.sellerCompanyAddressZip + ', ' + data.sellerCompanyAddressCountry,
    productCode: <ArrayToMultiple values={orderItems.map(d => (d.intProductCode ? d.intProductCode : 'N/A'))} />,
    productName: <ArrayToMultiple values={orderItems.map(d => (d.intProductName ? d.intProductName : 'N/A'))} />,
    productOfferIds: data.orderItems.map(orderItem => orderItem.productOffer),
    proNumber: 'N/A',// ! ! TBD
    quantityOrdered: <ArrayToMultiple values={orderItems.map(d => ((d.pkgAmount && d.packagingSize) ? d.pkgAmount * d.packagingSize : 'N/A'))} />,
    refundDate: (typeof data.refundDate !== 'undefined' ? moment(data.refundDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    returnDeliveryDate: (typeof data.returnDeliveryDate !== 'undefined' ? moment(data.returnDeliveryDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    returnShipDate: (typeof data.returnShipDate !== 'undefined' ? moment(data.returnShipDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    returnStatus: OrdersHelper.getReturnStatus(data.returnStatus),
    reviewStatus: OrdersHelper.getReviewStatus(data.reviewStatus),
    sellerRejectionDate: (typeof data.sellerRejectionDate !== 'undefined' ? moment(data.sellerRejectionDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    service: 'N/A', // ! ! TBD
    shipDate: (typeof data.shipDate !== 'undefined' ? moment(data.shipDate).format('MMM Do, YYYY h:mm:ss A') : 'N/A'),
    shippingContact: data.sellerCompanyContactName ? data.sellerCompanyContactName : 'N/A',
    shippingStatus: OrdersHelper.getShippingStatus(data.shippingStatus),
    shipTo: data.buyerCompanyName,
    shipToAddress: data.buyerCompanyAddressStreet + ', ' + data.buyerCompanyAddressCity + ', ' + data.buyerCompanyAddressZip + ', ' + data.buyerCompanyAddressCountry,
    subtotal: <FormattedNumber style='currency' currency={currency} value={subtotal} />, //"$" + totalPrice.formatMoney(2),
    terms: 'N/A',// ! ! TBD
    total: <FormattedNumber style='currency' currency={currency} value={totalPriceWithShipping} />, //"$" + totalPriceWithShipping.formatMoney(2),
    totalPkg: <ArrayToMultiple values={orderItems.map(d => (d.pkgAmount ? d.pkgAmount : 'N/A'))} />,
    unit: <ArrayToMultiple values={orderItems.map(d => (d.packagingUnit ? d.packagingUnit.nameAbbreviation : 'N/A'))} />,
    unitCost: <ArrayToMultiple values={orderItems.map(d => (d.pricePerUOM ? <FormattedNumber style='currency' currency={currency} value={d.pricePerUOM} /> : 'N/A'))} />,
    unitPrice: <ArrayToMultiple values={orderItems.map(d => (
      <div><FormattedNumber style='currency' currency={currency} value={d.pricePerUOM} /></div>
    ))} />,
      //<FormattedNumber style='currency' currency={currency} value={0} />, //"$" + getSafe(() => data.orderItems[0].price, 0).formatMoney(2),
    // Vendor or Customer
    paymentType: type === 'sales' ? 'Customer' : 'Vendor',
    paymentAddress: type === 'sales' ? data.buyerCompanyAddressStreet + ', ' + data.buyerCompanyAddressCity + ', ' + data.buyerCompanyAddressZip + ' ' + data.buyerCompanyAddressCountry : data.sellerCompanyAddressStreet + ', ' + data.sellerCompanyAddressCity + ', ' + data.sellerCompanyAddressZip + ' ' + data.sellerCompanyAddressCountry,
    paymentEmail: type === 'sales' ? data.buyerCompanyContactEmail : data.sellerCompanyContactEmail,
    paymentName: type === 'sales' ? data.buyerCompanyName : data.sellerCompanyName,
    paymentPhone: type === 'sales' ? data.buyerCompanyContactPhone : data.sellerCompanyContactPhone,
    paymentContact: type === 'sales' ? data.buyerCompanyContactName : data.sellerCompanyContactName
  }
}

function mapStateToProps(state, ownProps) {
  const {orders} = state

  if (ownProps.router.query.type !== orders.detailType) {
    orders.detail = {}
  }

  return {
    order: prepareDetail(orders.detail, ownProps.router.query.type),
    isPaymentCancellable: getSafe(() => orders.detail.isPaymentCancellable, false),
    openedAssignLots: orders.openedAssignLots,
    openedReinitiateTransfer: orders.openedReinitiateTransfer,
    action: actionRequired(orders.detail),
    reloadPage: orders.reloadPage
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
