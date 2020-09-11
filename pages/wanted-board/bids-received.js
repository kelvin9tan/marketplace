import React, { Component } from 'react'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import { BidsReceived } from '~/modules/wanted-board/bids-received'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'

class MyRequestedItemsPage extends Component {
  render() {
    const {
      type,
      intl: { formatMessage }
    } = this.props

    return (
      <Layout title={formatMessage({ id: 'title.wantedBoardBidsReceived', defaultMessage: 'Bids Received' })}>
        <BidsReceived type={type} />
      </Layout>
    )
  }
}

export default securePage(
  connect(
    store => ({
      type: store.wantedBoard.myRequestedItemsType
    }),
    null
  )(injectIntl(MyRequestedItemsPage))
)