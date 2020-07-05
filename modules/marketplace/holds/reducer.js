import * as AT from './action-types'

export const initialState = {
  loading: false,
  holds: [],
  datagridFilter: { filters: [] },
  datagridFilterUpdate: false,
  typeHolds: 'my',
  countHolds: '',
  tableHandlersFilters: null
}

export default function reducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case AT.CREATED_HOLD_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.CREATED_HOLD_FULFILLED: {
      return {
        ...state,
        loading: false,
        holds: payload
      }
    }

    case AT.CREATED_HOLD_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.GET_COUNT_HOLDS_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.GET_COUNT_HOLDS_FULFILLED: {
      return {
        ...state,
        loading: false,
        countHolds: payload.data
      }
    }

    case AT.GET_COUNT_HOLDS_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.REJECT_HOLD_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.REJECT_HOLD_FULFILLED: {
      return {
        ...state,
        loading: false,
        holds: payload.data
      }
    }

    case AT.REJECT_HOLD_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.CANCEL_HOLD_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.CANCEL_HOLD_FULFILLED: {
      return {
        ...state,
        loading: false,
        holds: payload.data
      }
    }

    case AT.CANCEL_HOLD_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.APPROVE_HOLD_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.APPROVE_HOLD_FULFILLED: {
      return {
        ...state,
        loading: false,
        holds: payload.data
      }
    }

    case AT.APPROVE_HOLD_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.TO_CART_HOLD_PENDING: {
      return {
        ...state,
        loading: true
      }
    }

    case AT.TO_CART_HOLD_FULFILLED: {
      return {
        ...state,
        loading: false,
        holds: payload.data
      }
    }

    case AT.TO_CART_HOLD_REJECTED: {
      return {
        ...state,
        loading: false
      }
    }

    case AT.HOLD_APPLY_FILTER: {
      return {
        ...state,
        datagridFilter: payload,
        datagridFilterUpdate: !state.datagridFilterUpdate
      }
    }

    case AT.TOGGLE_HOLDS: {
      return {
        ...state,
        typeHolds: payload
      }
    }

    case AT.HOLD_HANDLE_VARIABLE_CHANGE: {
      return {
        ...state,
        [payload.variable]: payload.value
      }
    }

    default: {
      return state
    }
  }
}
