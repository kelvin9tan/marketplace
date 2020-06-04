import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from 'components/Layout'
import securePage from '~/hocs/securePage'
import Companies from '~/modules/companies'

class Index extends Component {
  render() {
    const { currentTab } = this.props
    return (
      <Layout title={currentTab.name}>
        <Companies />
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentTab: state.companiesAdmin.currentTab
  }
}

export default securePage(connect(mapStateToProps)(Index))