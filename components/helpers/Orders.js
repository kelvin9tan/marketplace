import { DivCircle } from './styles'

export function getOrderStatus(orderStatus) {
  switch (orderStatus) {
    case 1:
      return 'Pending'
    case 2:
      return 'Confirmed'
    case 3:
      return 'Rejected'
    case 4:
      return 'Draft'
    case 5:
      return 'Cancelled'
    case 6:
      return 'Discarded'
    default:
      return 'N/A'
  }
}

export function getOrderStatusWithIconCircle(orderStatus) {
  switch (orderStatus) {
    case 1:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#ffc65d' />
          Pending
        </div>
      )
    case 2:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#84c225' />
          Confirmed
        </div>
      )
    case 3:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#f16844' />
          Rejected
        </div>
      )
    case 4:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#2599d5' />
          Draft
        </div>
      )
    case 5:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#f16844' />
          Cancelled
        </div>
      )
    case 6:
      return (
        <div style={{ display: 'flex' }}>
          <DivCircle backgroundColor='#f16844' />
          Discarded
        </div>
      )
    default:
      return 'N/A'
  }
}

export function getShippingStatus(shippingStatus) {
  switch (shippingStatus) {
    case 1:
      return 'Not Shipped'
    case 2:
      return 'In Transit'
    case 3:
      return 'Delivered'
    case 4:
      return 'Returned'
    default:
      return 'N/A'
  }
}

export function getReviewStatus(reviewStatus) {
  switch (reviewStatus) {
    case 1:
      return 'Pending'
    case 2:
      return 'Accepted'
    case 3:
      return 'Rejected'
    default:
      return 'N/A'
  }
}

export function getPaymentStatus(paymentStatus) {
  switch (paymentStatus) {
    case 1:
      return 'Pending'
    case 2:
      return 'Paid'
    case 3:
      return 'Refunded'
    case 4:
      return 'Canceled'
    case 5:
      return 'Failed'
    case 6:
      return 'Initiated'
    default:
      return 'N/A'
  }
}

export function getCreditStatus(creditStatus) {
  switch (creditStatus) {
    case 1:
      return 'Pending'
    case 2:
      return 'Counter Offer Pending'
    case 3:
      return 'Accepted'
    case 4:
      return 'Rejected'
    default:
      return 'N/A'
  }
}

export function getReturnStatus(returnStatus) {
  switch (returnStatus) {
    case 1:
      return 'Not Shipped'
    case 2:
      return 'In Transit'
    case 3:
      return 'Delivered'
    default:
      return 'N/A'
  }
}