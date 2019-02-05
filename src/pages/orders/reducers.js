import * as AT from './action-types'

const initialState = {
    data: [],
    detail: [],
    isFetching: false,
    isDetailFetching: false,
    isConfirmFetching: false,
    isRejectFetching: false,
    reloadPage: false,
    selectedIndex: -1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case AT.ORDERS_FETCH_REQUESTED:
            return {
                ...state,
                isFetching: true,
                reloadPage: false
            }
        case AT.ORDERS_FETCH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.payload.data,
                reloadPage: false
            }
        case AT.ORDERS_FETCH_FAILURE:
            return {
                ...state,
                isFetching: false,
                reloadPage: false
            }
        case AT.ORDERS_DETAIL_FETCH_REQUESTED:
            return {
                ...state,
                isDetailFetching: true,
                reloadPage: false
            }
        case AT.ORDERS_DETAIL_FETCH_SUCCESS:
            return {
                ...state,
                isDetailFetching: false,
                detail: action.payload.data,
                reloadPage: false
            }
        case AT.ORDERS_DETAIL_FETCH_FAILURE:
            return {
                ...state,
                isDetailFetching: false,
                reloadPage: false
            }
        case AT.ORDER_CONFIRM_FETCH_REQUESTED:
            return {
                ...state,
                isConfirmFetching: true,
                reloadPage: false
            }
        case AT.ORDER_CONFIRM_FETCH_SUCCESS:
            return {
                ...state,
                isConfirmFetching: false,
                reloadPage: true
            }
        case AT.ORDER_CONFIRM_FETCH_FAILURE:
            return {
                ...state,
                isConfirmFetching: false,
                reloadPage: false
            }
        case AT.ORDER_REJECT_FETCH_REQUESTED:
            return {
                ...state,
                isRejectFetching: true,
                reloadPage: false
            }
        case AT.ORDER_REJECT_FETCH_SUCCESS:
            return {
                ...state,
                isRejectFetching: false,
                reloadPage: true
            }
        case AT.ORDER_REJECT_FETCH_FAILURE:
            return {
                ...state,
                isRejectFetching: false,
                reloadPage: false
            }
        default:
            return state
    }
}