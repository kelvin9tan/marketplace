import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Menu, Button, Checkbox, Input, Dropdown } from 'semantic-ui-react'

import { openPopup, handleFiltersValue, openImportPopup, handleProductCatalogUnmappedValue } from '../actions'
import unitedStates from '../../../components/unitedStates'

const textsTable = {
  Users: {
    BtnAddText: 'User',
    SearchText: 'Search user by name, title or branch ...'
  },
  Branches: {
    BtnAddText: 'Branch',
    SearchText: 'Search branch by name, address or contact ...'
  },
  Warehouses: {
    BtnAddText: 'Warehouse',
    SearchText: 'Search warehouse by name, address or contact ...'
  },
  'Product catalog': {
    BtnAddText: 'Product',
    SearchText: 'Search product catalog by name, number ...'
  },
  'Global Broadcast': {
    BtnAddText: 'Global broadcast',
    SearchText: 'Search global broadcast by name ...'
  },
  'Credit cards': {
    BtnAddText: 'Credit card',
    SearchText: 'Search credit card ...'
  },
  'Bank accounts': {
    BtnAddText: 'Bank account',
    SearchText: 'Search bank account ...'
  },
  'Delivery addresses': {
    BtnAddText: 'Delivery address',
    SearchText: 'Search delivery address ...'
  }
}

class TablesHandlers extends Component {
  state = {
    filterFieldCurrentValue: 'None'
  }

  handleChangeSelectField = (event, value) => {
    this.setState({
      filterFieldCurrentValue: value
    })
  }

  handleChangeFieldsCurrentValue = fieldStateName => event => {
    this.setState({
      [fieldStateName]: event.target.value
    })
  }

  render() {
    const {
      handleFiltersValue,
      currentTab,
      openPopup,
      openImportPopup,
      handleProductCatalogUnmappedValue
    } = this.props

    const { filterFieldCurrentValue } = this.state

    return (
      <Menu secondary>
        <Menu.Item header>
          <Header as="h1" size="medium">
            {currentTab}
          </Header>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              style={{ width: 340 }}
              size="large"
              icon="search"
              placeholder={textsTable[currentTab].SearchText}
              onChange={e => handleFiltersValue(this.props, e.target.value)}
            />
          </Menu.Item>
          <Menu.Item>
            {currentTab === 'Product catalog' && (
              <Checkbox
                label='Unmapped only'
                onChange={(e, { checked }) => handleProductCatalogUnmappedValue(checked)}
              />
            )}
            <Button
              size="large"
              style={{ marginLeft: 10 }}
              primary
              onClick={() => openPopup()}
            >
              Add {textsTable[currentTab].BtnAddText}
            </Button>
            {currentTab === 'Product catalog' && (
              <Button
                size="large"
                style={{ marginLeft: 10 }}
                primary
                onClick={() => openImportPopup()}
              >
                Import {textsTable[currentTab].BtnAddText}
              </Button>
            )}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentTab: state.settings.currentTab,
    deliveryAddressesFilter: state.settings.deliveryAddressesFilter
  }
}

const mapDispatchToProps = {
  openPopup,
  handleFiltersValue,
  openImportPopup,
  handleProductCatalogUnmappedValue
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesHandlers)
