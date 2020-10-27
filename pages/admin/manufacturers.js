import React, { Component } from 'react'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import AdminPage from '~/modules/admin'
import { injectIntl } from 'react-intl'

class Index extends Component {
  render() {
    const {
      intl: { formatMessage }
    } = this.props
    return (
      <Layout
        title={
          formatMessage({ id: 'title.admin.manufacturers', defaultMessage: 'Manufacturers' })
        }
      >
        <AdminPage currentTab={'manufacturers'} />
      </Layout>
    )
  }
}

export default securePage(injectIntl(Index))