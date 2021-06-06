import { createSelector } from 'reselect'
import moment from 'moment'
import { getSafe } from '../../../utils/functions'
import { ArrayToFirstItem, FormattedPhone } from '../../../components/formatted-messages/'
import { currency } from '../../../constants/index'

const getDatagridRows = props => props?.datagrid?.rows

export const makeGetUsersDatagridRows = () => {
  return createSelector([getDatagridRows], rows => {
    return rows.map(user => {
      return {
        id: user.id,
        name: user.name,
        companyName: getSafe(() => user.company.name, ''),
        company: user.company,
        jobTitle: user.jobTitle || '',
        email: user.email,
        phone: user.phone || '',
        phoneFormatted: <FormattedPhone value={user.phone || ''}/>,
        homeBranch: user.homeBranch ? user.homeBranch.id : '',
        additionalBranches: (user.additionalBranches ? user.additionalBranches : []).map(d => d.id),
        enabled: user.enabled,
        preferredCurrency: currency,
        //homeBranchName: getSafe(() => user.homeBranch.deliveryAddress.cfName, ''),
        roles: user.roles || [],
        userRoles: <ArrayToFirstItem
          values={user && user.roles && user.roles.length && user.roles.map(r => r.name)}/>,
        lastLoginAt: user.lastLoginAt ? moment(user.lastLoginAt).toDate().toLocaleString() : ''
      }
    })
  })
}

export const makeGetCompaniesDatagridRows = () => {
  return createSelector([getDatagridRows], rows => {
    return rows.map(c => {
      return {
        rawData: c,
        ...c,
        companyName: getSafe(() => c.name, ''),
        dba: getSafe(() => c.dba, ''),
        associations: getSafe(() => c.associations, ''),
        hasLogisticsAccounts: getSafe(() => c.logisticsAccount, false) ? 'Yes' : 'No',
        hasDwollaAccount: getSafe(() => c.dwollaAccountStatus, false) === 'verified',
        hasVellociAccount: getSafe(() => c.vellociAccountStatus, false) === 'active',
        primaryBranchAddress: getSafe(() => c.primaryBranch.deliveryAddress.address, false)
          ? c.primaryBranch.deliveryAddress.address.streetAddress +
          ', ' +
          c.primaryBranch.deliveryAddress.address.city +
          ', ' +
          (c.primaryBranch.deliveryAddress.address.province
            ? c.primaryBranch.deliveryAddress.address.province.name + ', '
            : '') +
          (c.primaryBranch.deliveryAddress.address.country ? c.primaryBranch.deliveryAddress.address.country.name : '')
          : '',
        primaryContact: getSafe(() => c.primaryUser.name, ''),
        contactEmail: getSafe(() => c.primaryUser.email, ''),
        reviewRequested: getSafe(() => c.reviewRequested, ''),
        hasLogo: getSafe(() => c.hasLogo, ''),
        enabled: getSafe(() => c.enabled, false),
        p44CompanyId: getSafe(() => c.project44Id, '')
      }
    })
  })
}

const getEditId = state => state.companiesAdmin.popupValues && state.companiesAdmin.popupValues.id
const getLoading = state => state.companiesAdmin.loading
const getEditedId = state => state.companiesAdmin.editedId
const getUserRoles = state => state.companiesAdmin.userRoles
const getAdminRoles = state => state.companiesAdmin.adminRoles.map(d => d.id)
const getIsOpenSidebar = state => state.companiesAdmin.isOpenSidebar
const getCompanyListDataRequest = state => state.companiesAdmin.companyListDataRequest
const getReRegisterP44Pending = state => state.companiesAdmin.reRegisterP44Pending

export const makeGetEditId = () => createSelector([getEditId], editId => editId)
export const makeGetLoading = () => createSelector([getLoading], loading => loading)
export const makeGetEditedId = () => createSelector([getEditedId], editedId => editedId)
export const makeGetUserRoles = () => createSelector([getUserRoles], userRoles => userRoles)
export const makeGetAdminRoles = () => createSelector([getAdminRoles], adminRoles => adminRoles)
export const makeIsOpenSidebar = () => createSelector([getIsOpenSidebar], adminRoles => adminRoles)
export const makeCompanyListDataRequest = () => createSelector([getCompanyListDataRequest], adminRoles => adminRoles)
export const makeReRegisterP44Pending = () => createSelector([getReRegisterP44Pending], adminRoles => adminRoles)