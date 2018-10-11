import axios from "axios";

const FETCH_WAREHOUSE = 'FETCH_WAREHOUSE';
const FETCH_WAREHOUSE_FULFILLED = 'FETCH_WAREHOUSE_FULFILLED';

const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
const FETCH_LOCATIONS_PENDING = 'FETCH_LOCATIONS_PENDING';
const FETCH_LOCATIONS_FULFILLED = 'FETCH_LOCATIONS_FULFILLED';

const SAVE_WAREHOUSE = 'SAVE_WAREHOUSE';
const UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE';

export const initialState = {
    isPending: false,
    isValid: false,
    hasError: false,
    warehouse: [],
    locations: [],
    locationFetching: false,
    data:{}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_WAREHOUSE_FULFILLED: {
            return {
                ...state,
                warehouse: action.payload
            }
        }
        case FETCH_LOCATIONS_PENDING: {
            return {
                ...state,
                locationFetching: true
            }
        }
        case FETCH_LOCATIONS_FULFILLED: {
            return {
                ...state,
                locationFetching: false,
                locations: action.payload
            }
        }
        default: {
            return state
        }
    }
}

export function fetchLocations(filter = {}){
    return {
        type: FETCH_LOCATIONS,
        payload: axios.get('/api/v1/locations/', {params: {...filter}}).then(result => {
            return result.data.data.locations.map((loc)=> {
                return {
                    id: loc.id,
                    name: loc.state
                }
            })
        })
    }
}

export function fetchWarehouses(){
    return {
        type: FETCH_WAREHOUSE,
        payload: axios.get('/api/v1/warehouses/').then(result => {return result.data.data.warehouses})
    }
}

export function saveWarehouse(name, address, city, location, contactName, contactNumber, contactEmail, zip) {
    return {
        type: SAVE_WAREHOUSE,
        payload: axios.post('/api/v1/warehouses/', {name, address, city, location, contactName, contactNumber, contactEmail, zip})
    }
}

export function updateWarehouse(id, name, address, city, location, contactName, contactNumber, contactEmail, zip){
    return {
        type: UPDATE_WAREHOUSE,
        payload: axios.put(`/api/v1/warehouses/${id}/`, {name, address, city, location, contactName, contactNumber, contactEmail, zip})
    }
}



