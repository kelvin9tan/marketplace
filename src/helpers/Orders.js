export function getOrderStatus(orderStatus) {
    switch (orderStatus) {
        case 1:
            return 'Pending';
        case 2:
            return 'Confirmed';
        case 3:
            return 'Rejected';
        default:
            return 'N/A';
    }
}

export function getShippingStatus(shippingStatus) {
    switch (shippingStatus) {
        case 1:
            return 'Not Shipped';
        case 2:
            return 'In Transit';
        case 3:
            return 'Delivered';
        case 4:
            return 'Returned';
        default:
            return 'N/A';
    }
}

export function getReviewStatus(reviewStatus) {
    switch (reviewStatus) {
        case 1:
            return 'Pending';
        case 2:
            return 'Accepted';
        case 3:
            return 'Rejected';
        default:
            return 'N/A';
    }
}

export function getPaymentStatus(paymentStatus) {
    switch (paymentStatus) {
        case 1:
            return 'Escrow';
        case 2:
            return 'Paid';
        case 3:
            return 'Refunded';
        default:
            return 'N/A';
    }
}

export function getCreditStatus(creditStatus) {
    switch (creditStatus) {
        case 1:
            return 'Pending';
        case 2:
            return 'Counter Offer Pending';
        case 3:
            return 'Accepted';
        case 4:
            return 'Rejected';
        default:
            return 'N/A';
    }
}