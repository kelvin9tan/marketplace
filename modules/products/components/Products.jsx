import { useEffect } from 'react'
import { connect } from 'react-redux'
import TablesHandlers from './TablesHandlers'
import { Container, Grid, GridColumn, Segment } from 'semantic-ui-react'
import { withAuth } from '../../../hocs'
import styled from 'styled-components'

import CasProductsTable from './CasProductsTable/CasProductsTable'
import ProductCatalogTable from './ProductCatalogTable/Table'
import EditAltNamesCasProductsPopup from './CasProductsTable/EditAltNamesCasProductsPopup'
import EditAltNamesEchoProductPopup from './ProductCatalogTable/EditAltNamesEchoProductPopup'
import ProductImportPopup from '../../inventory/my-products/components/ProductImportPopup'
import CasProductsSidebar from './CasProductsTable/CasProductsSidebar'
import AddEditEchoProduct from './ProductCatalogTable/AddEditEchoProductContainer'
import ProductGroupsTable from './ProductGroups/ProductGroupsTable'
import ProductGroupsPopup from './ProductGroups/ProductGroupsPopup'
import * as Actions from '../actions'

import { DatagridProvider, withDatagrid, Datagrid } from '../../datagrid'

const Products = props => {
  useEffect(() => {
    const { currentAddForm, currentEditForm, currentEdit2Form, closeAddPopup } = props
    if (currentAddForm || currentEditForm || currentEdit2Form) closeAddPopup()
  }, [])

  const handleFilterChange = () => {}

  const renderContent = () => {
    const { currentTab, currentEdit2Form, currentAddForm, currentEditForm, isOpenImportPopup } = props

    const tables = {
      'cas-products': <CasProductsTable />,
      'product-catalog': <ProductCatalogTable />,
      'product-groups': <ProductGroupsTable handleFilterChange={handleFilterChange} />
    }

    const addForms = {
      'cas-products': <CasProductsSidebar />,
      'product-groups': <ProductGroupsPopup />
    }

    const editForms = {
      'cas-products': <CasProductsSidebar />,
      'product-groups': <ProductGroupsPopup />
    }

    const edit2Forms = {
      'cas-products': <EditAltNamesCasProductsPopup />,
      'product-catalog': <EditAltNamesEchoProductPopup />
    }

    const importForm = {
      'product-catalog': <ProductImportPopup />
    }

    return (
      <>
        {currentAddForm && addForms[currentTab]}
        {currentEditForm && editForms[currentTab]}
        {isOpenImportPopup && importForm[currentTab]}
        {currentEdit2Form && edit2Forms[currentTab]}
        {tables[currentTab] || <p>This page is still under construction</p>}
      </>
    )
  }

  const getApiConfig = () => {
    const { currentTab, companyProductUnmappedOnly } = props
    const datagridApiMap = {
      'cas-products': {
        url: '/prodex/api/cas-products/datagrid',
        searchToFilter: v =>
          v && v.searchInput
            ? [
                { operator: 'LIKE', path: 'CasProduct.casIndexName', values: [`%${v.searchInput}%`] },
                { operator: 'LIKE', path: 'CasProduct.casNumber', values: [`%${v.searchInput}%`] }
              ]
            : []
      },
      'product-catalog': {
        url: '/prodex/api/company-generic-products/datagrid',
        searchToFilter: v =>
          v && v.searchInput
            ? [
                { operator: 'LIKE', path: 'CompanyGenericProduct.name', values: [`%${v.searchInput}%`] },
                { operator: 'LIKE', path: 'CompanyGenericProduct.code', values: [`%${v.searchInput}%`] },
                {
                  operator: 'LIKE',
                  path: 'CompanyGenericProduct.company.cfDisplayName',
                  values: [`%${v.searchInput}%`]
                },
                {
                  operator: 'LIKE',
                  path: 'CompanyGenericProduct.productGroup.name',
                  values: [`%${v.searchInput}%`]
                }
              ]
            : []
      },
      'product-groups': {
        url: '/prodex/api/product-groups/datagrid',
        searchToFilter: v =>
          v && v.searchInput
            ? [
                { operator: 'LIKE', path: 'ProductGroup.name', values: [`%${v.searchInput}%`] },
                { operator: 'LIKE', path: 'ProductGroup.tags.name', values: [`%${v.searchInput}%`] }
              ]
            : []
      }
    }

    return datagridApiMap[currentTab]
  }

  const { currentTab, currentAddForm, currentEditForm } = props

  const sidebars = {
    'product-catalog': <AddEditEchoProduct />
  }

  return (
    <DatagridProvider apiConfig={getApiConfig()} preserveFilters skipInitLoad>
      <Container fluid className='flex stretched'>
        <>
          <div style={{ padding: '20px 30px' }}>
            <TablesHandlers currentTab={currentTab} />
          </div>
          <div style={{ padding: '0 30px 20px 30px' }} className='flex stretched'>
            {renderContent()}
          </div>
        </>
      </Container>
      {(currentAddForm || currentEditForm) && sidebars[currentTab]}
    </DatagridProvider>
  )
}

const mapStateToProps = state => {
  return {
    ...state.productsAdmin,
    auth: state.auth,
    isOpenImportPopup: state.settings.isOpenImportPopup,
    currentEdit2Form: state.productsAdmin.currentEdit2Form,
    currentEditForm: state.productsAdmin.currentEditForm,
    currentAddForm: state.productsAdmin.currentAddForm
  }
}

export default withDatagrid(withAuth(connect(mapStateToProps, Actions)(Products)))
