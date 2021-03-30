import { Component } from 'react'
import { connect } from 'react-redux'
import { logout } from '~/modules/auth/actions'

class Logout extends Component {
  componentDidMount() {
    const { logout, router } = this.props
    logout(router.query.auto)
  }

  render() {
    return null
  }
}

export default connect(() => ({}), { logout })(Logout)
