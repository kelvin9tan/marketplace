import {
    OFFER_FETCH_SUCCEEDED, OFFER_FETCH_REQUESTED,
    CARTITEMS_FETCH_SUCCEEDED, CARTITEMS_FETCH_REQUESTED,
    PAYMENTS_FETCH_REQUESTED, PAYMENTS_FETCH_SUCCEEDED,
    DELIVERYADDRESSES_FETCH_SUCCEEDED,
    DELIVERYADDRESSES_FETCH_REQUESTED,
    PRODUCTFROMCART_REMOVE_REQUESTED,
    CARTITEM_CREATE_REQUESTED
} from "../constants/cart";

export const initialState = {
    offers: {},
    cartItems: [],
    deliveryAddresses: [],
    payments: [],
    isFetching: true,
    offersAreFetching: true,
    selectedAddressId: null,
    selectedCardId: null,
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case DELIVERYADDRESSES_FETCH_REQUESTED: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case DELIVERYADDRESSES_FETCH_SUCCEEDED: {
            return {
                ...state,
                deliveryAddresses: action.payload,
                isFetching: false
            }
        }
        case PAYMENTS_FETCH_REQUESTED: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case PAYMENTS_FETCH_SUCCEEDED: {
            return {
                ...state,
                payments: action.payload,
                isFetching: false
            }
        }
        case OFFER_FETCH_REQUESTED: {
            return {
                ...state,
                offersAreFetching: true,
            }
        }
        case OFFER_FETCH_SUCCEEDED: {
            return {
                ...state,
                offers: action.payload,
                offersAreFetching: false
            }
        }
        case CARTITEMS_FETCH_REQUESTED: {
            return {
                ...state,
                isFetching: true,
            }
        }
        case CARTITEMS_FETCH_SUCCEEDED: {
            return {
                ...state,
                cartItems: action.payload,
                isFetching: false
            }
        }

        default: {
            return state
        }
    }
}

export function getProductOffer(id) {
    return {
        type: OFFER_FETCH_REQUESTED, payload: {id}
    }
}

export function fetchCartItems(){
    return {type: CARTITEMS_FETCH_REQUESTED}
}

export function fetchDeliveryAddresses(){
    return {type: DELIVERYADDRESSES_FETCH_REQUESTED}
}

export function fetchPayments(){
    return {type: PAYMENTS_FETCH_REQUESTED}
}

export function removeProductFromCart(id) {
    return {type: PRODUCTFROMCART_REMOVE_REQUESTED, payload: {id}}
}

export function createCartItem(product) {
    return {type: CARTITEM_CREATE_REQUESTED, payload: {product}}
}
