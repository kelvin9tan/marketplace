import { select } from "redux-saga/effects" // ! !
import * as AT from "./action-types"
import api from "./api"

export function openPopup(rows = null) {
  return {
    type: AT.OPEN_POPUP,
    payload: rows
  }
}
export function closePopup(rows = null) {
  return {
    type: AT.CLOSE_POPUP,
    payload: rows
  }
}

export function openImportPopup() {
  return {
    type: AT.OPEN_IMPORT_POPUP
    //payload: rows
  }
}
export function closeImportPopup(reloadFilter) {// ! !
  return async dispatch => {
    dispatch({
      type: AT.SETTINGS_CLOSE_IMPORT_POPUP,
    })
    dispatch({
      type: AT.SETTINGS_CLOSE_IMPORT_POPUP_FULFILLED,
    })
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Products list using string filters or page display
  }
}

export function closeImportPopupCancel() {//! !
  return {
    type: AT.SETTINGS_CLOSE_IMPORT_POPUP_FULFILLED
  }
}

export function openEditPopup(rows) {
  return {
    type: AT.OPEN_EDIT_POPUP,
    payload: rows
  }
}
export function handlerSubmitUserEditPopup(payload, id) {
  return async dispatch => {
    const updateUser = {
      firstname: payload.firstName,
      lastname: payload.lastName,
      middlename: payload.middleName,
      email: payload.email,
      homeBranchId: payload.homeBranchId,
      preferredCurrency: payload.preferredCurrency
    }
    await dispatch({
      type: AT.HANDLE_SUBMIT_USER_EDIT_POPUP,
      payload: api.patchUser(id, updateUser)
    })
    dispatch(getUsersDataRequest())
    dispatch(closePopup())
  }
}
export function handleEditPopup(rows) {
  return {
    type: AT.OPEN_EDIT_POPUP,
    payload: rows
  }
}
export function closeEditPopup() {
  return {
    type: AT.CLOSE_EDIT_POPUP
  }
}
export function openAddPopup(rows) {
  return {
    type: AT.OPEN_ADD_POPUP,
    payload: rows
  }
}
export function closeAddPopup() {
  return {
    type: AT.CLOSE_ADD_POPUP,
    payload: null
  }
}
export function changeHeadersCSV(payload) {
  return {
    type: AT.CHANGE_HEADERS_CSV,
    payload
  }
}

export function dataHeaderCSV(payload) {
  return {
    type: AT.DATA_HEADER_CSV,
    payload
  }
}

export function handleOpenConfirmPopup(payload) {
  return {
    type: AT.OPEN_CONFIRM_POPUP,
    payload
  }
}
export function deleteConfirmation() {
  const {
    settings: { deleteRowByid, currentTab }
  } = select()
  let toast = {}
  return async dispatch => {
    switch (currentTab) {
      case "Users":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteUser(deleteRowByid)})
        toast = { message: "User delete success", isSuccess: true }
        dispatch(getUsersDataRequest())
        break
      case "Branches":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteWarehouse(deleteRowByid)})
        toast = { message: "Branch delete success", isSuccess: true }
        dispatch(getBranchesDataRequest())
        break
      case "Warehouses":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteWarehouse(deleteRowByid)})
        toast = { message: "Warehouse delete success", isSuccess: true }
        dispatch(getWarehousesDataRequest())
        break
      case "Product catalog":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteProduct(deleteRowByid)})
        toast = { message: "Product delete success", isSuccess: true }
        //! ! TODO - filter - dispatch(getProductsCatalogRequest())
        break
      case "Credit cards":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteCreditCard(deleteRowByid)})
        toast = { message: "Credit cards delete success", isSuccess: true }
        dispatch(getCreditCardsDataRequest())
        break
      case "Bank accounts":
        await dispatch({ type: AT.DELETE_CONFIRM_POPUP, payload: api.deleteBankAccount(deleteRowByid)})
        toast = { message: "Bank account delete success", isSuccess: true }
        dispatch(getBankAccountsDataRequest())
        break
      default:
        break
    }
    dispatch(confirmationSuccess())
    dispatch({
      type: AT.OPEN_TOAST,
      payload: toast
    })
  }
}
export function confirmationSuccess() {
  return {
    type: AT.CONFIRM_FULFILLED
  }
}
export function closeConfirmPopup() {
  return {
    type: AT.CLOSE_CONFIRM_POPUP
  }
}
export function closeToast() {
  return {
    type: AT.CLOSE_TOAST
  }
}

export function handleActiveTab(tab) {
  return {
    type: AT.HANDLE_ACTIVE_TAB,
    payload: { tab }
  }
}

export function handleFiltersValue(props, value) {
  return async dispatch => {
    dispatch({
      type: AT.HANDLE_FILTERS_VALUE,
      payload: value
    })
    switch (props.currentTab) {
      case "Delivery addresses":
        if (value.trim().length) await dispatch(getDeliveryAddressesByStringRequest(value))
        else await dispatch(getDeliveryAddressesByFilterRequest(props.deliveryAddressesFilter))
        break
    case "Product catalog":
      if (value.trim().length > 2) await dispatch(getProductsCatalogRequest({body: value, unmapped: props.productCatalogUnmappedValue}))
      else await dispatch(getProductsCatalogRequest({body: props.productsFilter, unmapped: props.productCatalogUnmappedValue}))
      break
    }
  }
}

export function handleProductCatalogUnmappedValue(checked, props) {
  return async dispatch => {
    dispatch({
      type: AT.HANDLE_PRODUCT_CATALOG_UNMAPPED_VALUE,
      payload: checked
    })
    dispatch(handleFiltersValue({...props, productCatalogUnmappedValue: checked}, props.filterValue))
  }
}

export function handleSubmitEditPopup(payload, id) { // ! ! to be deleted?
  return async dispatch => {
    const dataBody = {
      accessorials: [0],
      address: {
        city: payload.address,
        streetAddress: payload.city,
        province: 44,
        zip: payload.zip
      },
      company: 3,
      contact: {
        email: payload.email,
        name: payload.contactName,
        phone: payload.phone
      },
      warehouse: true,
      name: payload.name
    }
    await dispatch({
      type: AT.SUBMIT_EDIT_POPUP_HANDLER,
      payload: api.putWarehouse(id, dataBody)
    })
    //! ! reload warehouses list

    dispatch(closePopup())
  }
}

export function handlerSubmitWarehouseEditPopup(payload, id) {
  return async dispatch => {
    const dataBody = {
      address: {
        city: payload.city,
        country: payload.country,
        streetAddress: payload.address,
        zip: payload.zip
      },
      company: 3,
      contactEmail: payload.email,
      contactName: payload.contactName,
      contactPhone: payload.phone,
      warehouse: payload.tab ? false : true,
      name: payload.name
    }
    await dispatch({
      type: AT.PUT_WAREHOUSE_EDIT_POPUP,
      payload: api.putWarehouse(id, dataBody)
    })
    if (payload.tab) { // ! ! ???
      dispatch(getBranchesDataRequest())
    } else {
      dispatch(getWarehousesDataRequest())
    }
    dispatch(closePopup())
  }
}

export function handleSubmitProductEditPopup(productData, id, reloadFilter) {//! !
  return async dispatch => {
    await dispatch({
      type: AT.SETTINGS_UPDATE_PRODUCT_CATALOG,
      payload: api.updateProduct(id,{
        casProduct: productData.casProduct.id,
        description: productData.description,
        freightClass: productData.freightClass ? productData.freightClass : null,
        hazardClasses: productData.hazardClass ? [productData.hazardClass] : null,
        hazardous: productData.hazardous,
        nmfcNumber: parseInt(productData.nmfcNumber),
        packagingSize: productData.packagingSize,
        packagingType: productData.packageID,
        packagingGroup: productData.packagingGroup ? productData.packagingGroup : null,
        productCode: productData.productNumber,
        productName: productData.productName,
        packagingUnit: productData.unitID,
        stackable: productData.stackable,
        unNumber: productData.unNumber ? productData.unNumber : null
      })
    })
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Products list using string filters or page display
    dispatch(closePopup())
  }
}

export function handleAddNewWarehousePopup() {
  return {
    type: AT.POST_NEW_WAREHOUSE_POPUP
  }
}

export function getUsersDataRequest() {
  return (dispatch) => {
    dispatch({
      type: AT.GET_USERS_DATA,
      async payload() {
        const [users, branches, roles] = await Promise.all([
          api.getUsers(),
          api.getBranches(),
          api.getRoles(),
        ])
        dispatch({
          type: AT.GET_ALL_BRANCHES_DATA,
          payload: branches
        })
        dispatch({
          type: AT.GET_ROLES_DATA,
          payload: roles
        })
        return users
      }
    })
  }
}

export function openRolesPopup(row) {
  return {
    type: AT.OPEN_ROLES_POPUP,
    payload: row
  }
}

export function closeRolesPopup() {
  return {
    type: AT.CLOSE_ROLES_POPUP
  }
}

export function getWarehousesDataRequest() {
  return (dispatch) => {
    dispatch({
      type: AT.GET_WAREHOUSES_DATA,
      async payload() {
        const [warehouses, country] = await Promise.all([
          api.getWarehouses(),
          api.getCountry(),
        ])
        const newCountryFormat = country.map(country => {
          return {
            text: country.name,
            value: country.id
          }
        })
        return { warehouses, newCountryFormat }
      }
    })
  }
}

export function getBranchesDataRequest() {
  return (dispatch) => {
    dispatch({
      type: AT.GET_BRANCHES_DATA,
      async payload() {
        const [branches, country] = await Promise.all([
          api.getBranches(),
          api.getCountry(),
        ])
        const newCountryFormat = country.map(country => {
          return {
            text: country.name,
            value: country.id
          }
        })
        return { branches, newCountryFormat }
      }
    })
  }
}

export function getCreditCardsDataRequest() {
  const creditCardsData = [ // TODO - temporary fake function
    {
      id: "3",
      cardNumber: "15",
      last4: "7891",
      expMonth: 8,
      expYear: 21,
      cvcCheck: "123"
    },
    {
      id: "2",
      cardNumber: "75",
      last4: "4569",
      expMonth: 5,
      expYear: 19,
      cvcCheck: "951"
    },
    {
      id: "8",
      cardNumber: "9849",
      last4: "123",
      expMonth: 5,
      expYear: 21,
      cvcCheck: "753"
    }
  ]
  return {
    type: AT.GET_CREDIT_CARDS_DATA_FULFILLED,
    payload: creditCardsData
  }
}

export function getProductsCatalogRequest(data) {//! !
  return (dispatch) => {
    dispatch({
      type: AT.SETTINGS_GET_PRODUCTS_CATALOG_DATA,
      async payload() {
        const [productCatalog, productPacTypes, units, hazardClasses, packagingGroups] = await Promise.all([
          typeof data.body === 'object' ? api.getProductsCatalogByFilter(data) :  api.getProductsCatalogByString(data),
          api.getProductTypes(),
          api.getUnitsType(),
          api.getHazardClasses(),
          api.getPackagingGroups()
        ])
        return {
          products: productCatalog,
          productsTypes: productPacTypes,
          units: units.data,
          hazardClasses: hazardClasses.data,
          packagingGroups: packagingGroups.data
        }
      }
    })
  }
}

export function getBankAccountsDataRequest() {
  return (dispatch) => {
    dispatch({
      type: AT.GET_BANK_ACCOUNTS_DATA,
      async payload() {
        const [bankAccountsData, country, currency] = await Promise.all([
          api.getBankAccountsData(),
          api.getCountry(),
          api.getCurrencies(),
        ])
        const newCountryFormat = country.map(country => {
          return {
            text: country.name,
            value: country.id
          }
        })
        const newCurrencyFormat = currency.map(currency => {
          return {
            text: currency.code,
            value: currency.id
          }
        })
        return { bankAccountsData, newCountryFormat, newCurrencyFormat }
      }
    })
  }
}

export function getProductsWithRequiredParam(payload) {
  return {
    type: AT.GET_PRODUCTS_WITH_REQUIRED_PARAM,
    payload: api.getProductsWithRequiredParamPar(payload)
  }
}

export function getStoredCSV(data) {
  return {
    type: AT.SETTINGS_GET_STORED_CSV,
    payload: api.getStoredCSV(data)
  }
}

export function postNewUserRequest(payload) {
  return async dispatch => {
    const dataBody = {
      email: payload.email,
      name: payload.name,
      //firstname: payload.firstName,
      //lastname: payload.lastName,
      middlename: payload.middleName,
      homeBranch: payload.homeBranchId,
      password: "123"
    }
    console.log('!!!!!!!!!! new user x');
    await dispatch({
      type: AT.POST_NEW_USER_REQUEST,
      payload: api.postNewUser(dataBody)
    })
    dispatch(getUsersDataRequest())
    dispatch(closePopup())
  }
}

export function postNewWarehouseRequest(payload) {
  return async dispatch => {
    const currentUser = await api.getCurrentUser()
    const dataBody = {
      address: {
        city: payload.city,
        country: payload.country,
        streetAddress: payload.address,
        zip: payload.zip
      },
      company: currentUser.company.id,
      contactEmail: payload.email,
      contactName: payload.contactName,
      contactPhone: payload.phone,
      warehouse: payload.tab ? false : true,
      name: payload.name
    }
    await dispatch({
      type: AT.POST_NEW_WAREHOUSE_REQUEST,
      payload: api.postNewWarehouse(dataBody)
    })
    if (payload.tab) { // ! ! ???
      dispatch(getBranchesDataRequest())
    } else {
      dispatch(getWarehousesDataRequest())
    }
    dispatch(closePopup())
  }
}

export function postNewCreditCardRequest(payload) {
  const dataBody = {
    cardNumber: payload.cardNumber,
    cvc: Number(payload.cvc),
    expirationMonth: Number(payload.expirationMonth),
    expirationYear: Number(payload.expirationYear)
  }
  return {
    type: AT.POST_NEW_CREDIT_CARD_REQUEST,
    payload: api.postNewCreditCard(dataBody)
  }
}

export function putNewUserRoleRequest(payload, id) {
  return async dispatch => {
    await dispatch({
      type: AT.PUT_NEW_USER_ROLES_REQUEST,
      payload: api.patchUserRole(id, payload)
    })
    dispatch(getUsersDataRequest())
    dispatch(closePopup())
  }
}

export function handleSubmitProductAddPopup(inputsValue, reloadFilter) {//! !
  return async dispatch => {
    await dispatch({
      type: AT.SETTINGS_POST_NEW_PRODUCT_REQUEST,
      payload: api.postNewProduct({
        casProduct: inputsValue.casProduct ? inputsValue.casProduct.id : null,
        description: inputsValue.description,
        freightClass: inputsValue.freightClass ? inputsValue.freightClass : null,
        hazardClasses: inputsValue.hazardClass ? [inputsValue.hazardClass] : null,
        hazardous: inputsValue.hazardous,
        nmfcNumber: parseInt(inputsValue.nmfcNumber),
        packagingSize: inputsValue.packagingSize,
        packagingType: inputsValue.packageID,
        packagingUnit: inputsValue.unitID,
        packagingGroup: inputsValue.packagingGroup ? inputsValue.packagingGroup : null,
        productCode: inputsValue.productNumber,
        productName: inputsValue.productName,
        stackable: inputsValue.stackable,
        unNumber: inputsValue.unNumber ? inputsValue.unNumber : null
      })
    })
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Products list using string filters or page display
    dispatch(closePopup())
  }
}

export function postNewBankAccountRequest(payload) {
  return async dispatch => {
    const dataBody = {
      accountHolderName: payload.accountHolderName,
      accountHolderType: payload.accountHolderType,
      accountNumber: payload.account,
      country: payload.country,
      currency: payload.currency,
      routingNumber: payload.routingNumber
    }
    await dispatch({
      type: AT.POST_NEW_BANK_ACCOUNT_REQUEST,
      payload: api.postNewBankAccount(dataBody)
    })
    dispatch(closePopup())
    // TODO: Add Bank Accounts reload
  }
}

export function putBankAccountRequest(account, id) {
  return {  // ! ! missing in saga
    type: AT.PUT_BANK_ACCOUNT_EDIT_POPUP,
    payload: account,
    id
  }
}

export function deleteCreditCard(cardId) {
  return {  // ! ! saga calls api.deleteWarehouse ???
    type: AT.DELETE_CREDIT_CARD,
    payload: cardId
  }
}

export function deleteBankAccount(accountId) {
  return {  // ! ! saga calls api.deleteWarehouse ???
    type: AT.DELETE_BANK_ACCOUNT,
    payload: accountId
  }
}

export function uploadCSVFile(payload) {
  return {
    type: AT.POST_UPLOAD_CSV_FILE,
    payload: api.uploadCSVFile(payload)
  }
}

export function postImportProductCSV(payload, id) {
    return {
      type: AT.SETTINGS_POST_CSV_IMPORT_PRODUCTS,
      payload: api.postImportProductCSV(payload, id)
    }
}

export function clearDataOfCSV() {
  return {
    type: AT.SETTINGS_CLEAR_DATA_OF_CSV
  }
}

export function searchCasProduct(pattern) {
  return {
    type: AT.SEARCH_CAS_PRODUCT,
    payload: api.searchCasProduct(pattern)
  }
}

export function searchUnNumber(pattern) {
  return {
    type: AT.SEARCH_UN_NUMBER,
    payload: api.searchUnNumber(pattern)
  }
}

export function getDeliveryAddressesByStringRequest(value) {
  return {
    type: AT.SETTINGS_GET_DELIVERY_ADDRESSES_BY_STRING,
    payload: api.getDeliveryAddressesByStringRequest(value)
  }
}

export function getDeliveryAddressesByFilterRequest(value) {
  return {
    type: AT.SETTINGS_GET_DELIVERY_ADDRESSES_BY_FILTER,
    payload: api.getDeliveryAddressesByFilterRequest(value)
  }
}

export function updateDeliveryAddresses(id, value, reloadFilter) {
  return async dispatch => {
    await dispatch({
      type: AT.SETTINGS_UPDATE_DELIVERY_ADDRESSES,
      payload: api.updateDeliveryAddresses(id, value)
    })
    dispatch(closePopup())
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Delivery Addresses list using string filters or page display
  }
}

export function createDeliveryAddress(value, reloadFilter) {
  return async dispatch => {
    await dispatch({
      type: AT.SETTINGS_CREATE_NEW_DELIVERY_ADDRESS,
      payload: api.createDeliveryAddress(value)
    })
    dispatch(closePopup())
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Delivery Addresses list using string filters or page display
  }
}

export function deleteDeliveryAddressesItem(value, reloadFilter) {
  return async dispatch => {
    await dispatch({
      type: AT.SETTINGS_DELETE_DELIVERY_ADDRESSES,
      payload: api.deleteDeliveryAddresses(value)
    })
    dispatch(handleFiltersValue(reloadFilter.props, reloadFilter.value))  // Reload Delivery Addresses list using string filters or page display
  }
}

export function getCountries() {
  return {
    type: AT.SETTINGS_GET_COUNTRIES,
    payload: api.getCountries()
  }
}

export function getProvinces(id) {
  return {
    type: AT.SETTINGS_GET_PROVINCES,
    payload: api.getProvinces(id)
  }
}





