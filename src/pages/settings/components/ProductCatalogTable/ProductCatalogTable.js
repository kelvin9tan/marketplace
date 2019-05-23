import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProdexTable from '~/components/table'
import { Confirm } from 'semantic-ui-react'
import {
  openPopup,
  getProductsCatalogRequest,
  handleOpenConfirmPopup,
  closePopup,
  deleteConfirmation
} from '../../actions'

class ProductCatalogTable extends Component {
  state = {
    columns: [
      { name: 'productName', title: 'Product Name' },
      { name: 'productNumber', title: 'Product Number' },
      { name: 'casNumber', title: 'CAS Number' },
      { name: 'casName', title: 'CAS Name' },
      { name: 'packagingSize', title: 'Packaging Size' },
      { name: 'unit', title: 'Unit' },
      { name: 'packagingType', title: 'Packaging Type' }
    ]
  }

  componentDidMount() {
    this.props.getProductsCatalogRequest()
  }

  render() {
    const {
      rows,
      filterValue,
      confirmMessage,
      openPopup,
      handleOpenConfirmPopup,
      closePopup,
      deleteConfirmation,
      loading
    } = this.props

    const { columns } = this.state

    return (
      <React.Fragment>
        <Confirm
          size="tiny"
          content="Do you really want to delete this product?"
          open={confirmMessage}
          onCancel={closePopup}
          onConfirm={deleteConfirmation}
        />
        <ProdexTable
          rows={rows}
          columns={columns}
          loading={loading}
          style={{ marginTop: '5px' }}
          filterValue={filterValue}
          rowActions={[
            { text: 'Edit', callback: row => openPopup(row) },
            {
              text: 'Delete',
              callback: row => handleOpenConfirmPopup(row.id)
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  openPopup,
  getProductsCatalogRequest,
  handleOpenConfirmPopup,
  closePopup,
  deleteConfirmation
}

const mapStateToProps = state => {
  return {
    rows: state.settings.productsCatalogRows,
    filterValue: state.settings.filterValue,
    confirmMessage: state.settings.confirmMessage,
    loading: state.settings.loading
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductCatalogTable)
