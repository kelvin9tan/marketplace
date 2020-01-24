import React, { Component } from 'react'
import { Container, Menu, Header, Button, Popup, List, Icon } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'
import styled from 'styled-components'

import { ShippingQuotes } from '~/modules/shipping'
import SubMenu from '~/src/components/SubMenu'
import { Filter } from '~/modules/filter'
import ProdexGrid from '~/components/table'
import AddCart from '~/src/pages/cart/components/AddCart'
import FilterTags from '~/modules/filter/components/FitlerTags'
import { filterTypes } from '~/modules/filter/constants/filter'
import { groupActionsMarketplace } from '~/modules/company-product-info/constants'

const CapitalizedText = styled.span`
  text-transform: capitalize;
`

const DivButtonWithToolTip = styled.div`
  z-index: 501;
`

class Marketplace extends Component {
  state = {
    columns: [
      { name: 'productName', disabled: true },
      { name: 'productNumber', disabled: true },
      // { name: 'merchant', title: <FormattedMessage id='marketplace.merchant' defaultMessage='Merchant'>{(text) => text}</FormattedMessage>, width: 250 },
      {
        name: '',
        title: '',
        width: 20
      },
      {
        name: 'available',
        title: (
          <FormattedMessage id='marketplace.available' defaultMessage='Available PKGs'>
            {text => text}
          </FormattedMessage>
        ),
        width: 140,
        align: 'right',
        sortPath: 'ProductOffer.pkgAvailable'
      },
      {
        name: 'packaging',
        title: (
          <FormattedMessage id='marketplace.packaging' defaultMessage='Packaging'>
            {text => text}
          </FormattedMessage>
        ),
        width: 140
      },
      {
        name: 'quantity',
        title: (
          <FormattedMessage id='marketplace.quantity' defaultMessage='Quantity'>
            {text => text}
          </FormattedMessage>
        ),
        width: 140,
        align: 'right',
        sortPath: 'ProductOffer.quantity'
      },
      {
        name: 'fobPrice',
        title: (
          <FormattedMessage id='marketplace.fobPrice' defaultMessage='FOB Price'>
            {text => text}
          </FormattedMessage>
        ),
        width: 160,
        align: 'right',
        sortPath: 'ProductOffer.cfPricePerUOM'
      },
      {
        name: 'manufacturer',
        title: (
          <FormattedMessage id='marketplace.manufacturer' defaultMessage='Manufacturer'>
            {text => text}
          </FormattedMessage>
        ),
        width: 220,
        sortPath: 'ProductOffer.companyProduct.echoProduct.manufacturer.name'
      },
      {
        name: 'origin',
        title: (
          <FormattedMessage id='marketplace.origin' defaultMessage='Origin'>
            {text => text}
          </FormattedMessage>
        ),
        width: 120,
        sortPath: 'ProductOffer.origin.name'
      },
      {
        name: 'expiration',
        title: (
          <FormattedMessage id='marketplace.expirationDate' defaultMessage='Expiration Date'>
            {text => text}
          </FormattedMessage>
        ),
        width: 120,
        sortPath: 'ProductOffer.lotExpirationDate'
      },
      {
        name: 'condition',
        title: (
          <FormattedMessage id='marketplace.condition' defaultMessage='Condition'>
            {text => text}
          </FormattedMessage>
        ),
        width: 100,
        sortPath: 'ProductOffer.condition.name'
      },
      {
        name: 'form',
        title: (
          <FormattedMessage id='marketplace.form' defaultMessage='Form'>
            {text => text}
          </FormattedMessage>
        ),
        width: 100,
        sortPath: 'ProductOffer.productForm.name'
      },
      {
        name: 'location',
        title: (
          <FormattedMessage id='marketplace.location' defaultMessage='Location'>
            {text => text}
          </FormattedMessage>
        ),
        width: 160
      },
      {
        name: 'nacdMember',
        title: (
          <FormattedMessage id='marketplace.nacdMember' defaultMessage='NACD Member'>
            {text => text}
          </FormattedMessage>
        ),
        width: 160
      }
    ],
    selectedRows: [],
    pageNumber: 0,
    open: false
  }

  initData = () => {
    const { datagrid } = this.props
    datagrid.loadData()
  }

  componentDidMount() {
    //this.initData()
  }

  getRows = () => {
    const {
      rows,
      intl: { formatMessage }
    } = this.props

    return rows.map(r => ({
      ...r,
      '': r.condition && (
        <Popup
          content={
            <FormattedMessage id='global.nonConforming.tooltip' defaultMessage='This is a non-conforming product.' />
          }
          trigger={<Icon name='exclamation triangle' color='red' />}
        />
      ),
      condition: r.condition ? (
        <FormattedMessage id='global.conforming' defaultMessage='Conforming' />
      ) : (
        <FormattedMessage id='global.nonConforming' defaultMessage='Non Conforming' />
      ),
      packaging: (
        <>
          {`${r.packagingSize} ${r.packagingUnit} `}
          <CapitalizedText>{r.packagingType}</CapitalizedText>{' '}
        </>
      )
    }))
  }

  tableRowClicked = clickedId => {
    const { getProductOffer, sidebarChanged, isProductInfoOpen, closePopup } = this.props
    let { isOpen, id } = this.props.sidebar
    getProductOffer(clickedId)

    if (isProductInfoOpen) closePopup()
    if (id !== clickedId && id) sidebarChanged({ isOpen: true, id: clickedId, quantity: 1 })
    else sidebarChanged({ isOpen: !isOpen, id: clickedId, quantity: 1 })
  }

  handleFilterApply = filter => {
    this.props.datagrid.setFilter(filter)
  }

  handleFilterClear = () => {
    this.props.applyFilter({ filters: [] })
    this.props.datagrid.setFilter({ filters: [] })
  }

  handleClearAutocompleteData = () => {
    this.props.clearAutocompleteData()
  }

  isSelectedMultipleEcho = (rows, selectedRows) => {
    if (!rows || !selectedRows) return
    const filteredRows = rows.reduce((filtered, row, rowIndex) => {
      if (selectedRows.includes(rowIndex)) {
        filtered.push(row.companyProduct.echoProduct.id)
      }
      return [...new Set(filtered)]
    }, [])
    if (filteredRows.length <= 1) {
      return false
    } else {
      return true
    }
  }

  getEchoProducts = (rows, selectedRows) => {
    if (!rows || !selectedRows) return
    return rows.reduce((filtered, row, rowIndex) => {
      if (selectedRows.includes(rowIndex)) {
        filtered.push(row.companyProduct.echoProduct)
      }
      return filtered
    }, [])
  }

  render() {
    const { datagrid, intl, getAutocompleteData, autocompleteData, autocompleteDataLoading, openPopup } = this.props
    const { columns, selectedRows } = this.state
    let { formatMessage } = intl
    const rows = this.getRows()
    return (
      <>
        <Container fluid style={{ padding: '0 32px' }}>
          <ShippingQuotes
            modalProps={{
              open: this.state.open,
              closeModal: () => this.setState({ open: false })
            }}
            productOfferIds={rows.reduce(function(filtered, row, rowIndex) {
              if (selectedRows.includes(rowIndex)) {
                filtered.push(row.id)
              }
              return filtered
            }, [])}
            productOffersSelected={rows.reduce(function(filtered, row, rowIndex) {
              if (selectedRows.includes(rowIndex)) {
                filtered.push({
                  id: row.id,
                  min: row.minPkg,
                  split: row.splitPkg
                })
              }
              return filtered
            }, [])}
            removePopup={this.props.removePopup}
            echoProducts={this.getEchoProducts(rows, selectedRows)}
            {...this.props}
          />

          <Menu secondary className='page-part'>
            <Menu.Menu position='right'>
              <Menu.Item>
                <FilterTags datagrid={datagrid} data-test='marketplace_remove_filter' />
              </Menu.Item>
              <Popup
                wide='very'
                data-test='array_to_multiple_list'
                content={
                  <FormattedMessage
                    id='marketplace.shippingQuoteTooltip'
                    defaultMessage='Select one or more Product Offers to calculate a Shipping Quote.'
                  />
                }
                disabled={selectedRows.length !== 0}
                position='bottom right'
                trigger={
                  <DivButtonWithToolTip
                    data-tooltip={
                      this.isSelectedMultipleEcho(rows, selectedRows)
                        ? formatMessage({
                            id: 'marketplace.multipleEchoProduct',
                            defaultMessage: 'Multiple ProductOffers can not be calculate.'
                          })
                        : null
                    }
                    data-position='bottom right'>
                    <Button
                      disabled={selectedRows.length === 0 || this.isSelectedMultipleEcho(rows, selectedRows)}
                      primary
                      onClick={() => this.setState({ open: true })}
                      data-test='marketplace_shipping_quote_btn'>
                      <FormattedMessage id='allInventory.shippingQuote' defaultMessage='Shipping Quote'>
                        {text => text}
                      </FormattedMessage>
                    </Button>
                  </DivButtonWithToolTip>
                }
              />
              <Menu.Item>
                <SubMenu clearAutocompleteData={this.handleClearAutocompleteData} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
        <div class='flex stretched' style={{ padding: '10px 32px' }}>
          <ProdexGrid
            groupActions={row => {
              let values = row.key.split('_')
              return groupActionsMarketplace(rows, values[values.length - 1], openPopup).map(a => ({
                ...a,
                text: <FormattedMessage {...a.text}>{text => text}</FormattedMessage>
              }))
            }}
            tableName='marketplace_grid'
            {...datagrid.tableProps}
            rows={rows}
            columns={columns}
            rowSelection
            groupBy={['productNumber']}
            // sameGroupSelectionOnly
            getChildGroups={rows =>
              _(rows)
                .groupBy('productName')
                .map(v => ({
                  key: `${v[0].productName}_${v[0].productNumber}_${v.length}_${v[0].companyProduct.id}`,
                  childRows: v
                }))
                .value()
            }
            renderGroupLabel={({ row: { value }, children = null }) => {
              const [name, number, count] = value.split('_')
              // const numberArray = number.split(' & ')
              return (
                <span>
                  {children}
                  <span style={{ color: '#2599d5' }}>{name ? name : 'Unmapped'}</span>
                  <span className='right'>Product offerings: {count}</span>
                </span>
              )
            }}
            onSelectionChange={selectedRows => this.setState({ selectedRows })}
            /* COMMENTED #30916
            onRowClick={(e, row) => {
              const targetTag = e.target.tagName.toLowerCase()
              if (targetTag !== 'input' && targetTag !== 'label') {
                this.tableRowClicked(row.id)
              }
            }}*/
            data-test='marketplace_row_action'
            rowActions={[
              {
                text: formatMessage({
                  id: 'marketplace.buy',
                  defaultMessage: 'Buy Product Offer'
                }),
                callback: row => this.tableRowClicked(row.id)
              }
            ]}
          />
        </div>
        <Filter
          filterType={filterTypes.MARKETPLACE}
          getAutocompleteData={getAutocompleteData}
          autocompleteData={autocompleteData}
          autocompleteDataLoading={autocompleteDataLoading}
          onApply={this.handleFilterApply}
          onClear={this.handleFilterClear}
          savedUrl='/prodex/api/product-offers/broadcasted/datagrid/saved-filters'
          searchUrl={text => `/prodex/api/company-products/broadcasted/search?pattern=${text}&onlyMapped=true`}
          apiUrl={datagrid.apiUrl}
          filters={datagrid.filters}
        />
        <AddCart />
      </>
    )
  }
}

export default injectIntl(Marketplace)
