import React from 'react'
import { connect } from 'react-redux'

import { Modal, FormGroup, Divider } from 'semantic-ui-react'

import { closePopup, updateCompany, createCompany, getCountries } from '../../actions'
import { Form, Input, Button, Checkbox, Dropdown } from 'formik-semantic-ui'
import * as Yup from 'yup'

const initialFormValues = {
  name: '',
  nacdMember: true,
  phone: '',
  website: '',
  primaryBranch: {
    accessorials: [],
    address: {
      city: "",
      country: 0,
      province: 0,
      streetAddress: "",
      zip: ""
    },
    contactEmail: "",
    contactName: "",
    contactPhone: "",
    name: "",
    warehouse: true
  }
}

const formValidation = Yup.object().shape({
  name: Yup.string().min(2, 'Name should has at least 2 characters').required(),
  nacdMember: Yup.bool().required(),
  phone: Yup.string().min(9, 'Enter valid phone number').required(),
  website: Yup.string().required()
})

class AddNewPopupCasProducts extends React.Component {
  
  componentDidMount() {
    this.props.getCountries()
  }

  render() {
    const {
      closePopup,
      popupValues,
      updateCompany,
      createCompany,
      countries,
      config,
    } = this.props

    return (
      <Modal open centered={false} size="small">
        <Modal.Header>Add { config.addEditText }</Modal.Header>
        <Modal.Content>
          <Form
            enableReinitialize
            initialValues={{...initialFormValues, ...popupValues}}
            validationSchema={formValidation}
            onReset={closePopup}
            onSubmit={async (values, actions) => {
              if (popupValues) await updateCompany(popupValues.id, values)
              else await createCompany(values)

              actions.setSubmitting(false)
            }}
          >
            <FormGroup widths="equal">
              <Input label="Company name" name="name" />
            </FormGroup>
            <FormGroup widths="equal">
              <Input label="Phone Number" name="phone" />
              <Input label="Web" name="website" />
            </FormGroup>
            <FormGroup widths="equal">
              <Checkbox label="NACD Member" name="nacdMember" />
            </FormGroup>
            
            {!popupValues && <>
              <Divider />
              <h4>Primary Branch</h4>
              <FormGroup widths="equal">
                <Input label="Name" name="primaryBranch.name" />
              </FormGroup>
              <FormGroup widths="equal">
                <Input label="Contact Email" name="primaryBranch.contactEmail" />
                <Input label="Contact Name" name="primaryBranch.contactName" />
                <Input label="Contact Phone" name="primaryBranch.contactPhone" />
              </FormGroup>
              <FormGroup widths="equal">
                <Checkbox label="Warehouse" name="primaryBranch.warehouse" />
              </FormGroup>
              <h5>Address</h5>
              <FormGroup widths="equal">
                <Input label="Street" name="primaryBranch.address.streetAddress" />
                <Input label="City" name="primaryBranch.address.city" />
              </FormGroup>
              <FormGroup widths="equal">
                <Input label="Zip" name="primaryBranch.address.zip" />
                <Dropdown label="Country" name="primaryBranch.address.country" inputProps={{search: true}} options={countries} />
              </FormGroup>
            </>}

            <div style={{ textAlign: 'right' }}>
              <Button.Reset>Cancel</Button.Reset>
              <Button.Submit>Save</Button.Submit>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapDispatchToProps = {
  closePopup,
  updateCompany,
  createCompany,
  getCountries
}

const mapStateToProps = ({admin}) => {
  return {
    ...admin,
    config: admin.config[admin.currentTab]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPopupCasProducts)