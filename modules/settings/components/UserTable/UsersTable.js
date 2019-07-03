import React, { Component } from "react"
import { connect } from "react-redux"
import { injectIntl } from 'react-intl'
import { withToastManager } from 'react-toast-notifications'
import { FormattedMessage } from 'react-intl'

import ProdexGrid from "~/components/table"
import { withDatagrid } from '~/modules/datagrid'
import { TablePopUp } from "~/components/tablePopup"
import confirm from '~/src/components/Confirmable/confirm'

import {
  getUsersDataRequest,
  openPopup,
  handleOpenConfirmPopup,
  closeConfirmPopup,
  deleteUser,
  openRolesPopup,
  userSwitchEnableDisable
} from "../../actions"
import Router from "next/router"
import { Checkbox, Popup } from "semantic-ui-react"


const handleSwitchEnabled = (id) => {
  userSwitchEnableDisable(id)
}

class UsersTable extends Component {
  state = {
    columns: [
      { name: "name", title: "User" },
      { name: "title", title: "Job Title" },
      { name: "email", title: "E-mail" },
      { name: "phone", title: "Phone" },
      { name: "homeBranchName", title: "Home Branch" },
      { name: "userRoles", title: "Roles", width: 200 },
      { name: "switchEnable", title: "Enable User", width: 120 }
    ]
  }

  componentDidMount() {
    this.props.getUsersDataRequest()
  }

  componentDidUpdate(oldProps) {
    const { addedItem, editedItem, removedItem, datagrid, toastManager } = this.props

    if (addedItem !== oldProps.addedItem) {
      datagrid.loadData()
      toastManager.add((
        <div>
          <strong>
            <FormattedMessage
              id='productCatalog.newUser'
              defaultMessage={'New User'}
            />
          </strong>
          <div>
            <FormattedMessage
              id='productCatalog.userCreated'
              defaultMessage={'User {userName} successfully created.'}
              values={{ userName: addedItem.name }}
            />
          </div>
        </div>
      ), {
        appearance: 'success',
        autoDismiss: true
      })
    }

    if (editedItem !== oldProps.editedItem) {
      datagrid.updateRow(editedItem.id, this.getEditedUser)
      toastManager.add((
        <div>
          <strong>
            <FormattedMessage
              id='productCatalog.editedUser'
              defaultMessage={'Edited User'}
            />
          </strong>
          <div>
            <FormattedMessage
              id='productCatalog.userUpdated'
              defaultMessage={'User {userName} successfully updated.'}
              values={{ userName: editedItem.name }}
            />
          </div>
        </div>
      ), {
        appearance: 'success',
        autoDismiss: true
      })
    }

    if (removedItem !== oldProps.removedItem) {
      toastManager.add((
        <div>
          <strong>
            <FormattedMessage
              id='productCatalog.removedUser'
              defaultMessage={'Removed User'}
            />
          </strong>
          <div>
            <FormattedMessage
              id='productCatalog.userRemoved'
              defaultMessage={'User {userName} successfully removed.'}
              values={{ userName: removedItem.name }}
            />
          </div>
        </div>
      ), {
        appearance: 'success',
        autoDismiss: true
      })
    }
  }

  getEditedUser = () => {
    return this.props.editedItem
  }

  render() {
    const {
      rows,
      filterValue,
      loading,
      openPopup,
      openRolesPopup,
      intl,
      datagrid,
      deleteUser,
      // confirmMessage,
      // handleOpenConfirmPopup,
      // closeConfirmPopup,
      // deleteRowById,
      // currentTab
    } = this.props

    let { columns } = this.state
    const { formatMessage } = intl

    return (
      <React.Fragment>
        <ProdexGrid
          tableName="settings_users"
          {...datagrid.tableProps}
          filterValue={filterValue}
          columns={columns}
          rows={rows}
          loading={datagrid.loading || loading}
          style={{ marginTop: "5px" }}
          rowActions={[
            { text: "Edit", callback: row => openPopup(row) },
            { text: "Edit Roles", callback: row => openRolesPopup(row) },
            {
              text: "Delete", callback: row => confirm(
                formatMessage({ id: 'confirm.deleteUser', defaultMessage: 'Delete user' }),
                formatMessage({ id: 'confirm.deleteItem', defaultMessage: `Do you really want to delete ${row.name}?` }, { item: row.name })
              ).then(() => deleteUser(row.id, row.name))
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = {
  getUsersDataRequest,
  openPopup,
  openRolesPopup,
  handleOpenConfirmPopup,
  closeConfirmPopup,
  deleteUser,
  userSwitchEnableDisable,
}

const userEnableDisableStatus = (r, currentUserId) => (
  <div style={{ float: 'right' }}>
    <Popup id={r.id}
      trigger={
        <Checkbox toggle={true}
          defaultChecked={r.enabled}
          disabled={r.id === currentUserId}
          onChange={() => handleSwitchEnabled(r.id)}
        />
      }
      content={
        r.id === currentUserId ?
          r.enabled ? 'User enabled.' : 'User disabled.' :
          r.enabled ? 'User enabled. Click to disable user.' : 'User disabled. Click to enable user.'
      }
    />
  </div>
)

const mapStateToProps = (state, { datagrid }) => {
  const currentUserId = state.settings.currentUser && state.settings.currentUser.id
  return {
    rows: datagrid.rows.map(user => ({
      name: user.name,
      title: user.jobTitle || '',
      email: user.email,
      phone: user.phone || '',
      homeBranch: user.homeBranch && user.homeBranch.id,
      enabled: user.enabled,
      preferredCurrency: (user.preferredCurrency || {}).id || 0,
      homeBranchName: user.homeBranch && user.homeBranch.name,
      permissions: user.roles ? user.roles.name : "", // ! ! array?
      id: user.id,
      allUserRoles: user.roles || [],
      userRoles: user.roles.map(rol => (
        rol.name
      )).join(", "),
      switchEnable: userEnableDisableStatus(user, currentUserId)
    })),
    addedItem: state.settings.addedItem,
    editedItem: state.settings.editedItem,
    removedItem: state.settings.removedItem,
    filterValue: state.settings.filterValue,
    confirmMessage: state.settings.confirmMessage,
    deleteRowById: state.settings.deleteRowById,
    currentTab: Router && Router.router && Router.router.query && Router.router.query.type ?
      state.settings.tabsNames.find(tab => tab.type === Router.router.query.type) : state.settings.tabsNames[0],
    loading: state.settings.loading,
    roles: state.settings.roles
  }
}

export default withDatagrid(connect(mapStateToProps, mapDispatchToProps)(injectIntl(withToastManager(UsersTable))))
