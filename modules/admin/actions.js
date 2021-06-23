import { createAction, createAsyncAction } from 'redux-promise-middleware-actions'
import Router from 'next/router'
import * as AT from './action-types'
import * as api from './api'
import { updateIdentity } from '../auth/actions'
import { Datagrid } from '../datagrid'


export const openEditPopup = createAction('ADMIN_OPEN_EDIT_POPUP', editedData => editedData)
export const closeEditPopup = createAction('ADMIN_CLOSE_EDIT_POPUP')
export const openAddPopup = createAction('ADMIN_OPEN_ADD_POPUP', currentTab => currentTab)
export const closeAddPopup = createAction('ADMIN_CLOSE_ADD_POPUP')
export const confirmationSuccess = createAction('ADMIN_CONFIRM_SUCCESS')
export const closeConfirmPopup = createAction('ADMIN_CLOSE_CONFIRM_POPUP')
export const postDwollaAccount = createAsyncAction('ADMIN_CREATE_DWOLLA_ACCOUNT', (values, companyId) => api.postNewDwollaAccount(values, companyId))
export const getHazardClassesDataRequest = createAsyncAction('ADMIN_GET_HAZARD_CLASSES', () => api.getHazardClasses())
export const getPackagingGroupsDataRequest = createAsyncAction('ADMIN_GET_PACKAGING_GROUPS', () => api.getPackagingGroups())
export const getMeasureTypesDataRequest = createAsyncAction('ADMIN_GET_MEASURE_TYPES', () => api.getMeasureTypes())
export const getAllUnitsOfMeasuresDataRequest = createAsyncAction('ADMIN_GET_ALL_UNITS_OF_MEASURES', () => api.getAllUnitsOfMeasures())
export const getAllUnNumbersDataRequest = createAsyncAction('ADMIN_GET_UN_NUMBERS', () => api.getAllUnNumbers())
export const getUnNumbersByString = createAsyncAction('ADMIN_GET_UN_NUMBERS_BY_STRING', (value) => api.getUnNumbersByString(value))
export const getPrimaryBranchProvinces = createAsyncAction('ADMIN_GET_PRIMARY_BRANCH_PROVINCES', (id) => api.getProvinces(id))
export const getMailingBranchProvinces = createAsyncAction('ADMIN_GET_MAILING_BRANCH_PROVINCES', (id) => api.getProvinces(id))
export const getCompany = createAsyncAction('ADMIN_GET_FULL_COMPANY', (params) => api.getCompany(params))
export const udpateEnabled = createAsyncAction('ADMIN_ENABLED_COMPANY', (id, enabled) => api.udpateEnabled(id, enabled))
export const searchUnNumber = createAsyncAction('ADMIN_SEARCH_UN_NUMBER', (pattern) => api.searchUnNumber(pattern))
export const searchManufacturers = createAsyncAction('ADMIN_SEARCH_MANUFACTURERS', (text, limit = false) => api.searchManufacturers(text, limit))
export const prepareSearchedCasProducts = createAction('ADMIN_PREPARE_CAS_PRODUCTS', elements => ({elements}))
export const getProductsCatalogRequest = createAsyncAction('ADMIN_GET_PRODUCTS_CATALOG_DATA', async () => {
  const [hazardClasses, packagingGroups] = await Promise.all([api.getHazardClasses(), api.getPackagingGroups()])
  return {
    hazardClasses: hazardClasses,
    packagingGroups: packagingGroups
  }
})
export const editEchoProductChangeTab = createAction('ADMIN_EDIT_COMPANY_GENERIC_PRODUCT_CHANGE_TAB', (editTab, force = false, data = null) => ({ editTab, force, data }))
export const openEditEchoProduct = createAction('ADMIN_EDIT_COMPANY_GENERIC_PRODUCT_CHANGE_TAB', (id, editTab, force = false) => ({ editTab, force, data: { id } }))
export const registerDwollaAccount = createAction('ADMIN_OPEN_REGISTER_DWOLLA_ACCOUNT_POPUP', data => data)
export const closeRegisterDwollaAccount = createAction('ADMIN_CLOSE_REGISTER_DWOLLA_ACCOUNT_POPUP')
export const openPopup = createAction('ADMIN_OPEN_POPUP', data => ({ data }))
export const closePopup = createAction('ADMIN_CLOSE_POPUP')
export const deleteUnit = createAsyncAction('ADMIN_DELETE_UNIT', async (id) => {
  const result = await api.deleteUnit(id)
  Datagrid.removeRow(id)
  return result
})
export const deleteUnitOfPackaging = createAsyncAction('ADMIN_DELETE_UNIT_OF_PACKAGING', async (id) => {
  const result = await api.deleteUnitOfPackaging(id)
  Datagrid.removeRow(id)
  return result
})
export const getAddressSearchPrimaryBranch = createAsyncAction('ADMIN_GET_ADDRESSES_SEARCH_PRIMARY_BRANCH', (body) => api.getAddressSearch(body))
export const getAddressSearchMailingBranch = createAsyncAction('ADMIN_GET_ADDRESSES_SEARCH_MAILING_BRANCH', (body) => api.getAddressSearch(body))
export const reviewRequest = createAsyncAction('ADMIN_REVIEW_REQUESTED', async (row, datagrid) => {
  const result = await api.reviewRequest(row.id)
  datagrid.updateRow(row.id, () => ({
    ...row,
    reviewRequested: !row.reviewRequested
  }))
  return result
})
export const loadFile = createAsyncAction('ADMIN_LOAD_FILE', (attachment) => api.loadFile(attachment))
export const addAttachment = createAsyncAction('ADMIN_ADD_ATTACHMENT', async (attachment, type, additionalParams = {}) => {
  const data = await api.addAttachment(attachment, type, additionalParams)
  return data
})
export const linkAttachment = createAsyncAction('ADMIN_LINK_ATTACHMENT', async (isLot, echoId, attachmentIds) => {
  if (Array.isArray(attachmentIds)) {
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    await asyncForEach(attachmentIds, async (attachment, index) => {
      await api.linkAttachment(echoId, attachment.id)
    })
  } else {
    await api.linkAttachment(echoId, attachmentIds)
  }

  return true
})
export const removeAttachment = createAsyncAction('ADMIN_REMOVE_ATTACHMENT', aId => api.removeAttachment(aId))
export const removeAttachmentLink = createAsyncAction('ADMIN_REMOVE_ATTACHMENT_LINK', (isLot, echoId, aId) => api.removeAttachmentLink(echoId, aId))
export const addUnNumber = createAction('ADMIN_ADD_UN_NUMBER', payload => payload)
export const getCompanyDetails = createAsyncAction('ADMIN_GET_COMPANY_DETAILS', id => api.getCompanyDetails(id))
export const addNmfcNumber = createAsyncAction('ADD_NMFC_NUMBER', async (nmfc) => {
  const data = await api.addNmfcNumber(nmfc)
  Datagrid.loadData()
  return data
})
export const editNmfcNumber = createAsyncAction('EDIT_NMFC_NUMBER', async (nmfc) => {
  const data = await api.editNmfcNumber(nmfc)
  Datagrid.updateRow(nmfc.id, () => nmfc)
  return data
})
export const deleteNmfcNumber = createAsyncAction('EDIT_NMFC_NUMBER', async (id) => {
  const data = await api.deleteNmfcNumber(id)
  Datagrid.removeRow(id)
  return data
})
export const getUsersMe = createAsyncAction('ADMIN_GET_USERS_ME', () => api.getUsersMe())
export const getUser = createAsyncAction('ADMIN_GET_USER', id => api.getUser(id))
export const userSwitchEnableDisable = createAsyncAction('ADMIN_USER_SWITCH_ENABLE_DISABLE', async (id, row) => {
  const data = await api.userSwitchEnableDisable(id)
  Datagrid.updateRow(id, () => ({ ...row, enabled: !row.enabled }))
  return data
})
export const postNewUserRequest = createAsyncAction('ADMIN_POST_NEW_USER', data => api.postNewUserRequest(data))
export const submitUserEdit = createAsyncAction('ADMIN_EDIT_USER', (id, data) => api.submitUserEdit(id, data))
export const deleteUser = createAsyncAction('ADMIN_DELETE_USER', id => api.deleteUser(id))
export const getUserRoles = createAsyncAction('ADMIN_GET_ROLES', () => api.getUserRoles())
export const getAdminRoles = createAsyncAction('ADMIN_GET_ADMIN_ROLES', () => api.getAdminRoles())
export const searchCompany = createAsyncAction('ADMIN_SEARCH_COMPANY', (companyText, limit) => api.searchCompany(companyText, limit))
export const initSearchCompany = createAsyncAction('ADMIN_INIT_SEARCH_COMPANY', id => api.getCompanyInfo(id))
export const searchTags = createAsyncAction('ADMIN_SEARCH_TAGS', tag => api.searchTags({
  orFilters: [
    {
      operator: 'LIKE',
      path: 'Tag.name',
      values: [tag.toString()]
    }
  ],
  pageNumber: 0,
  pageSize: 50
}))
export const searchMarketSegments = createAsyncAction('ADMIN_SEARCH_MARKET_SEGMENTS', segment => api.searchMarketSegments({
  orFilters: [
    {
      operator: 'LIKE',
      path: 'MarketSegment.name',
      values: [segment.toString()]
    }
  ],
  pageNumber: 0,
  pageSize: 50
}))
export const searchSellMarketSegments = createAsyncAction('ADMIN_SEARCH_SELL_MARKET_SEGMENTS', segment => api.searchMarketSegments({
  orFilters: [
    {
      operator: 'LIKE',
      path: 'MarketSegment.name',
      values: [segment.toString()]
    }
  ],
  pageNumber: 0,
  pageSize: 50
}))
export const searchBuyMarketSegments = createAsyncAction('ADMIN_SEARCH_BUY_MARKET_SEGMENTS', segment => api.searchMarketSegments({
  orFilters: [
    {
      operator: 'LIKE',
      path: 'MarketSegment.name',
      values: [segment.toString()]
    }
  ],
  pageNumber: 0,
  pageSize: 50
}))
export const handleVariableSave = createAction('ADMIN_HANDLE_VARIABLE_CHANGE', (variable, value) => ({ variable, value }))
export const getLogisticsProviders = createAsyncAction('ADMIN_GET_LOGISTICS_PROVIDERS', () => api.getLogisticsProviders())
export const postNewLogisticsProvider = createAsyncAction('ADMIN_POST_NEW_LOGISTICS_PROVIDER', data => api.postNewLogisticsProvider(data))
export const updateLogisticsProvider = createAsyncAction('ADMIN_EDIT_LOGISTICS_PROVIDER', (id, data) => api.updateLogisticsProvider(id, data))
export const deleteLogisticsProvider = createAsyncAction('ADMIN_DELETE_LOGISTICS_PROVIDER', id => api.deleteLogisticsProvider(id))
export const postNewCarrier = createAsyncAction('ADMIN_POST_NEW_CARRIER', data => api.postNewCarrier(data))
export const updateCarrier = createAsyncAction('ADMIN_EDIT_CARRIER', (id, data) => api.updateCarrier(id, data))
export const deleteCarrier = createAsyncAction('ADMIN_DELETE_CARRIER', id => api.deleteCarrier(id))

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export function deleteConfirmation(id, config = null) {
  if (config != null) {
    if (typeof config.api.delete !== 'undefined') {
      return async dispatch => {
        await dispatch({
          type: config.api.delete.typeRequest,
          payload: api.deleteItem(config, id)
        })
        Datagrid.removeRow(id)
      }
    }
  } else {
    return {
      type: AT.ADMIN_DELETE_CONFIRM_POPUP
    }
  }
}
export function getDataRequest(config, values = null) {
  return {
    type: config.api.get.typeRequest,
    payload: api.getDataRequest(config, values)
  }
}
export function postNewRequest(config, values) {
  return async dispatch => {
    await dispatch({
      type: config?.api?.post?.pendingRequest
    })
    await api
      .postNewRequest(config, values)
      .then(async response => {
        await dispatch({
          type: config?.api?.post?.fulfilledRequest,
          payload: response?.data
        })
        Datagrid.loadData()
        await dispatch(closePopup())
      })
      .catch(
        async err =>
          await dispatch({
            type: config?.api?.post?.rejectedRequest,
            error: err
          })
      )
  }
}
export function putEditedDataRequest(config, id, values) {
  return async dispatch => {
    const editedItem = await api.putEditedDataRequest(config, values, id)

    dispatch({
      type: config.api.update.typeRequest,
      payload: editedItem
    })
    Datagrid.updateRow(id, () => editedItem)
    dispatch(closePopup())
  }
}
export function handleFiltersValue(props, value) {
  return async dispatch => {
    // save filter value
    await dispatch({
      type: AT.ADMIN_HANDLE_FILTERS_VALUE,
      payload: value
    })

    switch (props.currentTab) {
      case 'CAS Products':
        {
          await dispatch({
            type: AT.ADMIN_GET_CAS_PRODUCT_BY_STRING,
            payload: api.getCasProductByString(value)
          })
        }
        break
      case 'manufacturers':
        {
          await dispatch({
            type: AT.ADMIN_GET_MANUFACTURERS_BY_STRING,
            payload: api.getManufacturersByString(value)
          })
        }
        break
    }
  }
}
export function openRegisterDwollaAccount(data) {
  return async dispatch => {
    dispatch(getCompany(data.id))
    dispatch(registerDwollaAccount(data))
  }
}
export const takeOverCompanyFinish = () => {
  return async dispatch => {
    let payload = await api.takeOverCompanyFinish()
    await dispatch(updateIdentity(payload))
    Router.push('/companies/companies')
  }
}


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
