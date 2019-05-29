import React, { Component } from "react"
import { Container, Menu, Header, Checkbox } from "semantic-ui-react"
import {FormattedMessage} from 'react-intl'
import SubMenu from '~/src/components/SubMenu'
import Filter from '~/src/components/Filter'
import ProdexGrid from '~/components/table'
import AddCart from '~/src/pages/cart/components/AddCart'

const PAGE_SIZE = 50

export default class Marketplace extends Component {
  state = {
    columns: [
      { name: 'productName', disabled: true},
      { name: 'productNumber', disabled: true},
      { name: 'merchant', title: 'Merchant', width: 250 },
      { name: 'available', title: 'Available', width: 80 },
      { name: 'packaging', title: 'Packaging', width: 140 },
      { name: 'quantity', title: 'Quantity', width: 140 },
      { name: 'fobPrice', title: 'FOB Price', width: 160 },
      { name: 'tradeName', title: 'Trade Name', width: 140 },
      { name: 'manufacturer', title: 'MFR.', width: 120 },
      { name: 'origin', title: 'Origin', width: 120 },
      { name: 'expiration', title: 'Expiration', width: 120 },
      { name: 'assay', title: 'Assay', width: 80 },
      { name: 'condition', title: 'Condition', width: 100 },
      { name: 'form', title: 'Form', width: 100 },
      { name: 'location', title: 'Location', width: 160 }
    ],
    selectedRows: [],
    pageNumber: 0,
  }

  componentDidMount() {
    this.getNextPage()
  }

  filterInventory = async (filter) => {
    let productIds = []
    if (filter.search) {
      let foundProducts = await this.props.findProducts(filter.search)
      foundProducts.value.data.reduce((filteredProducts, product) => {
        if (product.casProduct.chemicalName === filter.search || product.casProduct.casNumber === filter.search)
          productIds.push(product.id)
      }, [])

      if (productIds.length) {
        filter = {...filter, product: productIds}
      }
    }
    this.props.getBroadcastedProductOffers(filter, PAGE_SIZE)
  }

  getNextPage = (pageNumber) => {
    this.props.getBroadcastedProductOffers({}, PAGE_SIZE, pageNumber)
  }

  getRows = () => {
    const {rows} = this.props

    return rows.map(r => ({
      ...r
    }))
  }

  tableRowClicked = (clickedId) => {
    const { getProductOffer, sidebarChanged } = this.props
    let { isOpen, id } = this.props.sidebar
    getProductOffer(clickedId)

    if (id !== clickedId && id) sidebarChanged({ isOpen: true, id: clickedId, quantity: 1 })
    else sidebarChanged({ isOpen: !isOpen, id: clickedId, quantity: 1 })

  }

  render() {
    const {
      loading
    } = this.props
    const {columns, selectedRows} = this.state
    const rows = this.getRows()

    return (
      <>
        <Container fluid>
          <Menu secondary>
            <Menu.Item header>
              <Header as='h1' size='medium'>
                <FormattedMessage id='allInventory.marketplace'
                                  defaultMessage='MARKETPLACE' />
              </Header>
            </Menu.Item>

            <Menu.Menu position='right'>
              <Menu.Item>
                <SubMenu/>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
        <ProdexGrid
          tableName="marketplace_grid"
          loading={loading}
          columns={columns}
          rows={rows}
          rowSelection
          getNextPage={this.getNextPage}
          pageSize={PAGE_SIZE}
          groupBy={['productNumber']}
          getChildGroups={rows =>
            _(rows)
              .groupBy('productName')
              .map(v => ({
                key: `${v[0].productName}_${v[0].productNumber}_${v.length}`,
                childRows: v
              }))
              .value()
          }
          renderGroupLabel={({row: {value}}) => {
            const [name, number, count] = value.split('_')
            return (
              <span>
                <span style={{color: '#2599d5'}}>{number}</span>&nbsp;&nbsp; {name} <span className="right">Product offerings: {count}</span>
              </span>
            )
          }}
          onSelectionChange={selectedRows => this.setState({selectedRows})}
          rowActions={[
            { text: 'Buy Product Offer', callback: (row) => this.tableRowClicked(row.id) }
          ]}
        />
        <Filter
          chemicalName
          productAgeFilter
          date
          assay
          quantity
          price
          package
          condition
          productGrade
          form
          filterFunc={(filter) => { this.filterInventory({...filter}) }}
          savingFilters={true}
          {...this.props}
        />
        <AddCart />
      </>
    )
  }
}
