import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
// Components
import SharedListings from './SharedListings'
// Actions
import * as Actions from '../../actions'
import { getTemplates, broadcastChange } from '../../../broadcast/actions'
import { openBroadcast } from '../../../broadcast/actions'
// Services
import { getMappedRows } from './SharedListings.services'
// HOC
import { withDatagrid } from '../../../datagrid'
// Selectors
import { makeGetBroadcastTemplates } from '../../selectors'

const makeMapStateToProps = () => {
  const getBroadcastTemplates = makeGetBroadcastTemplates()

  const mapStateToProps = (state, {datagrid}) => {
    return {
      rows: getMappedRows(datagrid), //Memoized. Recalculate rows only if in prevProps.datagrid.rows !== props.datagrid.rows
      ...state.simpleAdd,
      broadcastTemplates: getBroadcastTemplates(state) //Not memoized.
    }
  }
  return mapStateToProps
}

const mapDispatchToProps = {
  ...Actions,
  getTemplates,
  broadcastChange,
  openBroadcast
}

export default injectIntl(withDatagrid(connect(makeMapStateToProps, mapDispatchToProps)(SharedListings)))
