import axios from "axios";
import {
    REGIONS_FETCH_SUCCEEDED, REGIONS_FETCH_REQUESTED,
    STATES_FETCH_REQUESTED, STATES_FETCH_SUCCEEDED,
    STATEDETAIL_FETCH_REQUESTED, STATEDETAIL_FETCH_SUCCEEDED,
    REGIONDETAIL_FETCH_REQUESTED, REGIONDETAIL_FETCH_SUCCEEDED,
    PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED,
} from "../constants/locations";

const FETCH_WAREHOUSE = 'FETCH_WAREHOUSE';
const FETCH_WAREHOUSE_FULFILLED = 'FETCH_WAREHOUSE_FULFILLED';

const FETCH_LOCATIONS = 'FETCH_LOCATIONS';
const FETCH_LOCATIONS_PENDING = 'FETCH_LOCATIONS_PENDING';
const FETCH_LOCATIONS_FULFILLED = 'FETCH_LOCATIONS_FULFILLED';

const SAVE_WAREHOUSE = 'SAVE_WAREHOUSE';
const UPDATE_WAREHOUSE = 'UPDATE_WAREHOUSE';
const FETCH_WAREHOUSE_DISTANCES = 'FETCH_WAREHOUSE_DISTANCES';

export const initialState = {
    isPending: false,
    isValid: false,
    hasError: false,
    warehouse: [],
    locations: [],
    regions: [],
    states: [],
    provinces: [],
    stateDetail: {},
    regionDetail: {},
    stateDetailIsFetching: false,
    regionDetailIsFetching: false,
    statesAreFetching: false,
    regionsAreFetching: false,
    isFetching: false,
    warehouseDistances: [], //filter location
    locationFetching: false,
    data:{}
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LOCATIONS_PENDING: {
            return {
                ...state,
                locationFetching: true
            }
        }
        case FETCH_WAREHOUSE_FULFILLED: {
            return {
                ...state,
                warehouse: action.payload
            }
        }

        case FETCH_LOCATIONS_FULFILLED: {
            return {
                ...state,
                locationFetching: false,
                locations: action.payload
            }
        }

        case STATES_FETCH_REQUESTED: {
            return {
                ...state,
                statesAreFetching: true,
            }
        }

        case REGIONS_FETCH_REQUESTED: {
            return {
                ...state,
                regionsAreFetching: true,
            }
        }

        case STATEDETAIL_FETCH_REQUESTED: {
            return {
                ...state,
                stateDetailIsFetching: true,
            }
        }

        case REGIONDETAIL_FETCH_REQUESTED: {
            return {
                ...state,
                regionDetailIsFetching: true,
            }
        }

        case REGIONS_FETCH_SUCCEEDED: {
            return {
                ...state,
                regions: action.payload,
                regionsAreFetching: false
            }
        }
        case STATES_FETCH_SUCCEEDED: {
            return {
                ...state,
                states: action.payload,
                statesAreFetching: false
            }
        }

        case STATEDETAIL_FETCH_SUCCEEDED: {
            return {
                ...state,
                stateDetail: action.payload,
                stateDetailIsFetching: false
            }
        }

        case REGIONDETAIL_FETCH_SUCCEEDED: {
            return {
                ...state,
                regionDetail: action.payload,
                regionDetailIsFetching: false
            }
        }

        case FETCH_WAREHOUSE_DISTANCES: {
            return {
                ...state,
                warehouseDistances: action.payload
            }
        }

        case PROVINCES_FETCH_REQUESTED: {
            return {
                ...state,
                provincesAreFetching: true,
            }
        }
        case PROVINCES_FETCH_SUCCEEDED: {
            return {
                ...state,
                provinces: action.payload,
                provincesAreFetching: false
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
        payload: axios.get('/api/t7r1bn/locations/', {params: {...filter}}).then(result => {
            return result.data.data.baseLocation.map((loc)=> {
                return {
                    id: loc.id,
                    province: loc.province,
                    country: loc.country,
                }
            })
        })
    }
}

export function fetchWarehouses(){
    return {
        type: FETCH_WAREHOUSE,
        payload: axios.get('/api/smg5uw/warehouses/').then(result => {return result.data.data.warehouses})
    }
}

export function saveWarehouse(name, address, city, location, contactName, contactNumber, contactEmail, zip) {
    return {
        type: SAVE_WAREHOUSE,
        payload: axios.post('/api/mvz5k1/warehouses/', {name, address, city, location, contactName, contactNumber, contactEmail, zip})
    }
}

export function updateWarehouse(id, name, address, city, location, contactName, contactNumber, contactEmail, zip){
    return {
        type: UPDATE_WAREHOUSE,
        payload: axios.put(`/api/105e6h/warehouses/${id}/`, {name, address, city, location, contactName, contactNumber, contactEmail, zip})
    }
}

export function fetchRegions(search = null){
    return {type: REGIONS_FETCH_REQUESTED, payload:{search}}
}

export function fetchStates(search = null){
    return {type: STATES_FETCH_REQUESTED, payload:{search}}
}

export function fetchStateDetail(id) {
    return {type: STATEDETAIL_FETCH_REQUESTED, payload: {id}}
}

export function fetchWarehouseDistances(){
    return {
        type: FETCH_WAREHOUSE_DISTANCES,
        payload: [
            {id: 1, name:'10'},
            {id: 2, name:'100'},
            {id: 3, name:'1000'},
            {id: 4, name:'10000'},
        ]
    }
}

export function fetchRegionDetail(id) {
    return {type: REGIONDETAIL_FETCH_REQUESTED, payload: {id}}
}

export function fetchProvinces(search = null) {
    return {type: PROVINCES_FETCH_REQUESTED, payload: {search}}
}
