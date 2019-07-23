import React from "react"
import { connect } from "react-redux"
import { withToastManager } from 'react-toast-notifications'
import { Modal, FormGroup } from "semantic-ui-react"

import {
  closePopup,
  closeRolesPopup,
  handlerSubmitUserEditPopup,
  postNewUserRequest,
  putNewUserRoleRequest,
  getCurrencies
} from "../../actions"
import { Form, Input, Button, Dropdown, Checkbox } from "formik-semantic-ui"
import * as Yup from "yup"
import { FormattedMessage, injectIntl } from "react-intl"

import { generateToastMarkup } from '~/utils/functions'

const formValidation = popupValues => Yup.object().shape({
  name: Yup.string().trim()
    .min(3, "Too short")
    .required("Name is required"),
  email: Yup.string().trim()
    .email("Invalid email")
    .required("Emails is required"),
  homeBranch: Yup.number()
    .required('Home Branch is required'),
  title: Yup.string().trim()
    .min(3, "Too short"),
  phone: Yup.string().trim()
    .min(3, "Too short"),
})

class UsersPopup extends React.Component {
  componentDidMount() {
    this.props.getCurrencies()
  }

  submitHandler = async (values, actions) => {
    let { toastManager } = this.props
    if (this.props.userEditRoles) {
      this.props.putNewUserRoleRequest(
        this.addNewRole(values),
        this.props.popupValues.id
      )
      return
    }
    let requestData = {
      email: values.email,
      name: values.name,
      homeBranch: values.homeBranch,
      jobTitle: values.title,
      phone: values.phone,
      preferredCurrency: values.preferredCurrency

    }
    if (this.props.popupValues) {
      await this.props.handlerSubmitUserEditPopup(requestData, this.props.popupValues.id)
    } else {
      await this.props.postNewUserRequest(requestData)
    }

    let status = this.props.popupValues ? 'userUpdated' : 'userCreated'


    toastManager.add(generateToastMarkup(
      <FormattedMessage id={`notifications.${status}.header`} />,
      <FormattedMessage id={`notifications.${status}.content`} values={{ name: requestData.name }} />
    ), {
        appearance: 'success'
      })


    actions.setSubmitting(false)
  }

  addNewRole(values) {
    const newRoles = []
    for (let key in values) {
      const id = Number(key.split("checkBoxId_")[1])
      if (values[`checkBoxId_${id}`]) {
        id && newRoles.push(id)
      }
    }

    return newRoles
  }

  render() {
    const {
      closePopup,
      popupValues,
      branchesAll,
      userEditRoles,
      closeRolesPopup,
      roles,
      userRoles,
      currencies,
      intl
    } = this.props

    const {
      name = "",
      email = "",
      homeBranch = undefined,
      preferredCurrency = "",
      additionalBranches = [],
      title = "",
      phone = "",
    } = popupValues || {}

    const initialFormValues = {
      name,
      email,
      homeBranch,
      additionalBranches,
      preferredCurrency,
      title,
      phone,
    }

    const { formatMessage } = intl

    // necessary for Edit Roles
    this.props.roles.forEach(item => {
      let flag = this.props.popupValues ? this.props.popupValues.allUserRoles.some(
        role => role.id === item.id
      ) : []
      initialFormValues[`checkBoxId_${item.id}`] = flag
    })

    return (
      <Modal open centered={false} size={userEditRoles ? "mini" : null}>
        <Modal.Header>
          {(userEditRoles
            ? formatMessage({ id: 'settings.assignUserRoles', defaultMessage: "Assign User Roles" })
            : (popupValues
              ? formatMessage({ id: 'settings.editUser', defaultMessage: "Edit User" })
              : formatMessage({ id: 'settings.addUser', defaultMessage: "Add User" })
            )
          )}
        </Modal.Header>
        <Modal.Content>
          <Form
            initialValues={initialFormValues}
            validationSchema={formValidation(popupValues)}
            onReset={userEditRoles ? closeRolesPopup : closePopup}
            onSubmit={this.submitHandler}

          >
            {({values}) => (
              <>
                {userEditRoles ? (
                  roles.map((role, i) => (
                    <FormGroup key={i}>
                      <Checkbox
                        label={role.name}
                        name={`checkBoxId_${role.id}`}
                        inputProps={{ defaultChecked: userRoles.includes(role.id) }}
                      />
                    </FormGroup>
                  ))
                ) : (
                    <>
                      <FormGroup widths="equal">
                        <Input type="text" label="Name" name="name" />
                        <Input type="text" label="Job Title" name="title" />
                      </FormGroup>
                      <FormGroup widths="equal">
                        <Input type="text" label="Email" name="email" />
                        <Input type="text" label="Phone" name="phone" />
                      </FormGroup>
                      <FormGroup>
                        <Dropdown
                          label="Home Branch"
                          name="homeBranch"
                          options={branchesAll}
                          fieldProps={{ width: 7 }}
                        />
                        <Dropdown
                          label="Additional Branches"
                          name="additionalBranches"
                          options={branchesAll.filter(b => b.value !== values.homeBranch)}
                          fieldProps={{ width: 7 }}
                          inputProps={{
                            multiple: true
                          }}
                        />
                        <Dropdown label="Currency" name="preferredCurrency" options={currencies} fieldProps={{ width: 2 }} />
                      </FormGroup>
                    </>
                  )}
                <div style={{ textAlign: "right" }}>
                  <Button.Reset
                    onClick={userEditRoles ? closeRolesPopup : closePopup}
                  >
                    Cancel
                  </Button.Reset>
                  <Button.Submit>Save</Button.Submit>
                </div>
              </>
            )}
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  postNewUserRequest,
  putNewUserRoleRequest,
  closePopup,
  closeRolesPopup,
  handlerSubmitUserEditPopup,
  getCurrencies
}

const mapStateToProps = state => {
  return {
    popupValues: state.settings.popupValues,
    userRoles: state.settings.popupValues && state.settings.popupValues.allUserRoles.map(r => (
      r.id
    )),
    branchesAll: state.settings.branchesAll,
    roles: state.settings.roles,
    userEditRoles: state.settings.userEditRoles,
    currencies: state.settings.currency.map(d => {
      return {
        id: d.id,
        text: d.code,
        value: d.id
      }
    }),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withToastManager(injectIntl(UsersPopup)))
