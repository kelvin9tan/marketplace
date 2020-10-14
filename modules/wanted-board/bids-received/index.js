import BidsReceivedContainer from './components/BidsReceivedContainer'
import { DatagridProvider } from '~/modules/datagrid'

export const BidsReceived = props => {
  const apiConfig = {
    url: `/prodex/api/purchase-requests/own/datagrid?type=${props.type.toUpperCase()}`,
    searchToFilter: v =>
      v && v.searchInput
        ? { url: `/prodex/api/purchase-requests/own/datagrid?type=${props.type.toUpperCase()}&pattern=${encodeURIComponent(v.searchInput)}` }
        : { url: `/prodex/api/purchase-requests/own/datagrid?type=${props.type.toUpperCase()}` }
  }
  return (
    <>
      <DatagridProvider apiConfig={apiConfig} preserveFilters skipInitLoad>
        <BidsReceivedContainer {...props} />
      </DatagridProvider>
    </>
  )
}
