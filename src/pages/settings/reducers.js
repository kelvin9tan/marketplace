import * as AT from './action-types'
import get from 'lodash/get'

export const initialState = {
  editPopupBoolean: false,
  addNewWarehousePopup: false,
  popupValues: [],
  usersRows: [],
  userEditRoles: false,
  roles: [],
  warehousesRows: [],
  branchesRows: [],
  branchesAll: [],
  creditCardsRows: [],
  bankAccountsRows: [],
  productsCatalogRows: [],
  productsPackagingType: null,
  productsUnitsType: [],
  country: [],
  tabsNames: [
    { name: 'Users', id: 1 },
    { name: 'Branches', id: 2 },
    { name: 'Warehouses', id: 3 },
    { name: 'Product catalog', id: 4 },
    { name: 'Global Broadcast', id: 5 },
    //{ name: "Client list", id: 6 }, // removed #29771
    { name: 'Credit cards', id: 7 },
    { name: 'Bank accounts', id: 8 }
    //{ name: "Tax manager", id: 9 }, // removed #29771
    //{ name: "Terms", id: 10 }, // removed #29771
    //{ name: "Website Controls", id: 11 } // removed #29771
  ],
  // currentTab: "Product catalog",
  currentTab: 'Users',
  isOpenPopup: false,
  currentEditForm: null,
  currentAddForm: null,
  confirmMessage: null,
  toast: { message: null, isSuccess: null },
  deleteUserById: null,
  deleteRowByid: null,
  filterValue: '',
  editPopupSearchProducts: [],
  loading: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case AT.OPEN_POPUP: {
      return {
        ...state,
        isOpenPopup: true,
        popupValues: action.payload
      }
    }
    case AT.CLOSE_POPUP: {
      return {
        ...state,
        isOpenPopup: false,
        popupValues: null
      }
    }
    case AT.OPEN_ROLES_POPUP: {
      return {
        ...state,
        userEditRoles: true
      }
    }
    case AT.CLOSE_ROLES_POPUP: {
      return {
        ...state,
        userEditRoles: false
      }
    }
    case AT.OPEN_EDIT_POPUP: {
      return {
        ...state,
        currentForm: state.currentTab,
        editPopupBoolean: state.editPopupBoolean === false ? true : false,
        popupValues: action.payload
      }
    }
    case AT.CLOSE_EDIT_POPUP: {
      return {
        ...state,
        currentForm: null,
        editPopupBoolean: state.editPopupBoolean === false ? true : false,
        popupValues: null
      }
    }
    case AT.OPEN_CONFIRM_POPUP: {
      return {
        ...state,
        confirmMessage: true,
        deleteRowByid: action.payload
      }
    }
    case AT.OPEN_TOAST: {
      return {
        ...state,
        toast: action.payload
      }
    }
    case AT.CLOSE_TOAST: {
      return {
        ...state,
        toast: { message: null, isSuccess: null }
      }
    }
    case AT.CLOSE_CONFIRM_POPUP: {
      return {
        ...state,
        deleteRowByid: null,
        confirmMessage: null
      }
    }
    case AT.CONFIRM_SUCCESS: {
      return {
        ...state,
        deleteRowByid: null,
        confirmMessage: null
      }
    }

    case AT.OPEN_ADD_POPUP: {
      return {
        ...state,
        currentForm: state.currentTab,
        popupValues: action.payload
      }
    }
    case AT.CLOSE_ADD_POPUP: {
      return {
        ...state,
        currentForm: null,
        currentEditForm: null
      }
    }

    case AT.HANDLE_ACTIVE_TAB: {
      return {
        ...state,
        currentTab: action.payload.tab,
        currentAddForm: null,
        currentEditForm: null
      }
    }

    case AT.HANDLE_FILTERS_VALUE: {
      return {
        ...state,
        filterValue: action.payload
      }
    }

    case AT.GET_USERS_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_USERS_DATA_SUCCESS: {
      const usersRows = action.payload.map(user => {
        const firstTwoRoles = user.roles.slice(0, 2)

        let rolesStr = ''
        switch (user.roles.length) {
          case 0:
            rolesStr = ''
            break
          case 1:
            rolesStr = firstTwoRoles[0].name
            break
          case 2:
            rolesStr = firstTwoRoles[0].name + ', ' + firstTwoRoles[1].name
          default:
            rolesStr =
              firstTwoRoles[0].name + ', ' + firstTwoRoles[1].name + ' + X more'
        }

        return {
          checkbox: ' ',
          userName: user.firstname + ' ' + user.lastname,
          title: 'title',
          email: user.email,
          phone: user.homeBranch.contactPhone,
          homeBranchId: user.homeBranch.id,
          preferredCurrency: user.preferredCurrency
            ? user.preferredCurrency.code
              ? user.preferredCurrency.code
              : null
            : null,
          homeBranch: user.homeBranch.name,
          permissions: user.roles ? user.roles.name : '',
          middleName: user.middlename,
          id: user.id,
          firstTwoRoles: rolesStr,
          allRoles: user.roles
        }
      })
      return {
        ...state,
        loading: false,
        usersRows: usersRows
      }
    }

    case AT.GET_ROLES_DATA: {
      return {
        ...state,
        roles: action.payload
      }
    }

    case AT.GET_WAREHOUSES_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_WAREHOUSES_DATA_SUCCESS: {
      const warehousesRows = action.payload.warehouses.map(warehouse => ({
        name: warehouse.name,
        address:
          warehouse.address.streetAddress + ', ' + warehouse.address.city,
        countryId: warehouse.address.country.id,
        zip: warehouse.address.zip.zip,
        zipID: warehouse.address.zip.id,
        contactName: warehouse.contactName,
        phone: warehouse.contactPhone,
        email: warehouse.contactEmail,
        branchId: warehouse.id,
        id: warehouse.id,
        warehouse: warehouse.warehouse
      }))

      warehousesRows.forEach(element => {
        for (let key in element) {
          if (element[key] === 'unknown') {
            element[key] = ''
          }
        }
      })

      return {
        ...state,
        loading: false,
        warehousesRows: warehousesRows,
        country: action.payload.newCountryFormat
      }
    }

    case AT.GET_BRANCHES_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_BRANCHES_DATA_SUCCESS: {
      const rows = action.payload.map(branch => {
        return {
          warehouseName: branch.name,
          address: branch.address.streetAddress + ', ' + branch.address.city,
          contactName: branch.contact.name,
          phone: branch.contact.phone,
          email: branch.contact.email,
          branchId: branch.id
        }
      })

      return {
        ...state,
        loading: false,
        branchesRows: rows
      }
    }

    case AT.GET_ALL_BRANCHES_DATA: {
      const branches = action.payload.map(branch => {
        return {
          value: branch.id,
          text: branch.name
        }
      })
      return {
        ...state,
        branchesAll: branches
      }
    }

    case AT.GET_CREDIT_CARDS_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_CREDIT_CARDS_DATA_SUCCESS: {
      const rows = action.payload.map(card => {
        return {
          id: card.id,
          cardNumber: `**** **** **** ${card.last4}`,
          cvc: card.cvcCheck,
          expirationMonth: card.expMonth,
          expirationYear: card.expYear,
          last4: `**** **** **** ${card.last4}`
          // cardNumber what does it mean
        }
      })

      return {
        ...state,
        loading: false,
        creditCardsRows: rows
      }
    }

    case AT.GET_BANK_ACCOUNTS_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_BANK_ACCOUNTS_DATA_SUCCESS: {
      const rows = action.payload.map(account => {
        return {
          id: account.id,
          accountHolderName: account.accountHolderName,
          accountHolderType: account.accountHolderType,
          accountNumber: `**** **** **** ${account.last4}`,
          country: account.country,
          currency: account.currency,
          routingNumber: account.routingNumber
          // accountNumber - what does it mean
        }
      })

      return {
        ...state,
        loading: false,
        bankAccountsRows: rows
      }
    }

    case AT.GET_PRODUCTS_CATALOG_DATA: {
      return { ...state, loading: true }
    }

    case AT.GET_PRODUCTS_CATALOG_DATA_SUCCESS: {
      const rows = action.payload.products.map(product => {
        return {
          id: product.id,
          productName: product.productName,
          productNumber: product.productCode,
          casName: product.casProduct
            ? product.casProduct.casIndexName
              ? product.casProduct.casIndexName
              : null
            : null,
          casProduct: product.casProduct
            ? product.casProduct.casNumber
              ? product.casProduct.casNumber
              : null
            : null,
          packagingType: product.packagingType
            ? product.packagingType.name
            : null,
          packageID: product.packagingType ? product.packagingType.id : null,
          packagingSize: product.packagingSize,
          unit: product.packagingUnit
            ? product.packagingUnit.nameAbbreviation
            : null,
          unitID: product.packagingUnit ? product.packagingUnit.id : null,
          unNumber: product.unNumber
            ? product.unNumber.id
              ? product.unNumber.id
              : 0
            : 0
        }
      })
      const packagingType = action.payload.productsTypes.map((type, id) => {
        return {
          key: id,
          text: type.name,
          value: type.id
        }
      })
      const packagingUnitsType = action.payload.units.map((type, id) => {
        return {
          key: id,
          text: type.name,
          value: type.id
        }
      })
      return {
        ...state,
        loading: false,
        productsCatalogRows: rows,
        productsPackagingType: packagingType,
        productsUnitsType: packagingUnitsType
      }
    }

    case AT.GET_PRODUCTS_WITH_REQUIRED_PARAM_SUCCESS: {
      const editPopupSearchProducts = action.payload.map(item => {
        return {
          id: item.id,
          productName: item.productName,
          productNumber: item.product.unNumber,
          productId: item.product.id,
          packagingType:
            item.packaging.packagingType === undefined
              ? ''
              : item.packaging.packagingType.name,
          packagingSize: item.packaging.size
        }
      })
      return {
        ...state,
        editPopupSearchProducts
      }
    }

    case AT.POST_NEW_WAREHOUSE_POPUP: {
      return {
        ...state,
        currentAddForm: state.currentTab
      }
    }

    default: {
      return state
    }
  }
}
