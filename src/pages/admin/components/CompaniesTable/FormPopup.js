import React from 'react'
import { connect } from 'react-redux'

import { Modal, FormGroup, Divider } from 'semantic-ui-react'

import { closePopup, updateCompany, createCompany, getCountries, getPrimaryBranchProvinces, getMailingBranchProvinces } from '../../actions'
import { Form, Input, Button, Checkbox, Dropdown } from 'formik-semantic-ui'
import * as Yup from 'yup'

// debug purposes only
import JSONPretty from 'react-json-pretty'

const initialFormValues = {
  name: '',
  nacdMember: true,
  phone: '',
  website: '',
  mailingBranch: {
    name: '',
    accessorials: [],
    address: {
      city: '',
      country: '',
      province: '',
      streetAddress: '',
      zip: ''
    },
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    warehouse: true
  },
  primaryBranch: {
    name: '',
    accessorials: [],
    address: {
      city: '',
      country: '',
      province: '',
      streetAddress: '',
      zip: ''
    },
    contactEmail: '',
    contactName: '',
    contactPhone: '',
    warehouse: true
  },
  primaryUser: {
    email: '',
    name: '',
  }
}

const formValidationEdit = Yup.object().shape({
  name: Yup.string().min(2, 'Name should has at least 2 characters').required()
})

const formValidationNew = Yup.lazy(values => {
  let primaryUserRequired = values.primaryUser.email !== '' || values.primaryUser.name !== ''
  let mailingBranchRequired = values.mailingBranch.name !== '' || values.mailingBranch.contactEmail !== '' ||
    values.mailingBranch.contactName !== '' || values.mailingBranch.contactPhone !== '' ||
    values.mailingBranch.address.streetAddress !== '' || values.mailingBranch.address.city !== '' ||
    values.mailingBranch.address.zip !== '' || values.mailingBranch.address.country !== ''

  let validation = Yup.object().shape({
    name: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),

    mailingBranch: Yup.lazy(() => {
      if (mailingBranchRequired) return Yup.object().shape({
        name: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
        contactEmail: Yup.string().email('Enter valid e-mail address').required('Enter e-mail address'),
        contactName: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
        contactPhone: Yup.string().required('Enter phone number'),
        address: Yup.object().shape({
          city: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
          streetAddress: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
          zip: Yup.string().required('Enter zip code'),
          country: Yup.number().required()
        })
      })
      return Yup.mixed().notRequired();
    }),

    primaryBranch: Yup.object().shape({
      name: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
      contactEmail: Yup.string().email('Enter valid e-mail address').required('Enter e-mail address'),
      contactName: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
      contactPhone: Yup.string().required('Enter phone number'),
      address: Yup.object().shape({
        city: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
        streetAddress: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
        zip: Yup.string().required('Enter zip code'),
        country: Yup.number().required()
      })
    }),
    primaryUser: Yup.lazy(() => {
      if (primaryUserRequired) return Yup.object().shape({
        email: Yup.string().email('Enter valid e-mail address').required('Enter e-mail address'),
        name: Yup.string().min(2, 'Enter at least 2 characters').required('Enter at least 2 characters'),
      })
      return Yup.mixed().notRequired();
    }),
  })

  return validation
})

const removeEmpty = (obj) =>
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      removeEmpty(val)
      if (Object.entries(val).length === 0) delete obj[key]
    }
    else if (val == null || val === '') delete obj[key]
  })



class AddNewPopupCasProducts extends React.Component {
  state = {
    primaryBranchHasProvinces: false,
    mailingBranchHasProvinces: false
  }

  componentDidMount() {
    this.props.getCountries()
  }

  handlePrimaryBranchCountry = (e, d) => {
    let country = this.props.countries.find(obj => obj.id == d.value);
    if (country.hasProvinces) {
      this.props.getPrimaryBranchProvinces(country.id)
    }
    this.setState({primaryBranchHasProvinces: country.hasProvinces})
  }

  handleMailingBranchCountry = (e, d) => {
    let country = this.props.countries.find(obj => obj.id == d.value);
    if (country.hasProvinces) {
      this.props.getMailingBranchProvinces(country.id)
    }
    this.setState({mailingBranchHasProvinces: country.hasProvinces})
  }


  render() {
    const {
      closePopup,
      popupValues,
      updateCompany,
      createCompany,
      countriesDropDown,
      primaryBranchProvinces,
      mailingBranchProvinces,
      zipCodes,
      config,
    } = this.props

    const {
      initialState,
      primaryBranchHasProvinces,
      mailingBranchHasProvinces
    } = this.state

    return (
      <Modal open centered={false} size="small">
        <Modal.Header>{popupValues ? ('Edit') : ('Add')} { config.addEditText }</Modal.Header>
        <Modal.Content>
          <Form
            enableReinitialize
            initialValues={popupValues ? popupValues : initialFormValues}
            validationSchema={popupValues ? formValidationEdit : formValidationNew}
            onReset={closePopup}
            onSubmit={async (values, actions) => {
              if (popupValues) {
                let newValues = {
                  "nacdMember": values.nacdMember,
                  "name": values.name,
                  "phone": values.phone,
                  "website": values.website
                }
                await updateCompany(popupValues.id, newValues)
              } 
              else {
                if (!(values.mailingBranch.name !== '' || values.mailingBranch.contactEmail !== '' ||
                  values.mailingBranch.contactName !== '' || values.mailingBranch.contactPhone !== '' ||
                  values.mailingBranch.address.streetAddress !== '' || values.mailingBranch.address.city !== '' ||
                  values.mailingBranch.address.zip !== '' || values.mailingBranch.address.country !== ''))
                  delete values['mailingBranch']

                removeEmpty(values)
                await createCompany(values)
              }

              actions.setSubmitting(false)
            }}
          >
            {({ values, errors, setFieldValue }) => (
              <>
            <FormGroup widths="equal">
              <Input label="Company Name" name="name" />
            </FormGroup>
            <FormGroup widths="equal">
              <Input label="Phone" name="phone" />
              <Input label="Website URL" name="website" />
            </FormGroup>
            <FormGroup widths="equal">
              <Checkbox label="NACD Member" name="nacdMember" />
            </FormGroup>
            
            {!popupValues && <>
              <Divider />
              <h4>Primary Branch (Billing Address)</h4>
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
                <Input label="Street Address" name="primaryBranch.address.streetAddress" />
                <Input label="City" name="primaryBranch.address.city" />
              </FormGroup>
              <FormGroup widths="equal">
                <Dropdown label="Zip" name="primaryBranch.address.zip" inputProps={{search: true}} options={zipCodes} />
                <Dropdown label="Country" name="primaryBranch.address.country" options={countriesDropDown}
                          inputProps={{search: true, onChange:  (e, d) => {
                              setFieldValue('primaryBranch.address.province', ''); this.handlePrimaryBranchCountry(e, d)}}} />
                <Dropdown label="Province" name="primaryBranch.address.province" options={primaryBranchProvinces}
                          inputProps={{search: true, disabled: !this.state.primaryBranchHasProvinces}} />
              </FormGroup>
              <Divider />
              <h4>Mailing Branch (optional)</h4>
              <FormGroup widths="equal">
                <Input label="Name" name="mailingBranch.name" />
              </FormGroup>
              <FormGroup widths="equal">
                <Input label="Contact Email" name="mailingBranch.contactEmail" />
                <Input label="Contact Name" name="mailingBranch.contactName" />
                <Input label="Contact Phone" name="mailingBranch.contactPhone" />
              </FormGroup>
              <FormGroup widths="equal">
                <Checkbox label="Warehouse" name="mailingBranch.warehouse" />
              </FormGroup>
              <h5>Address</h5>
              <FormGroup widths="equal">
                <Input label="Street Address" name="mailingBranch.address.streetAddress" />
                <Input label="City" name="mailingBranch.address.city" />
              </FormGroup>
              <FormGroup widths="equal">
                <Dropdown label="Zip" name="mailingBranch.address.zip" inputProps={{search: true}} options={zipCodes} />
                <Dropdown label="Country" name="mailingBranch.address.country" options={countriesDropDown}
                          inputProps={{search: true, onChange:  (e, d) => {
                            setFieldValue('mailingBranch.address.province', ''); this.handleMailingBranchCountry(e, d)}}} />
                <Dropdown label="Province" name="mailingBranch.address.province" options={mailingBranchProvinces}
                          inputProps={{search: true, disabled: !this.state.mailingBranchHasProvinces}} />
              </FormGroup>
              <Divider />
              <h4>Primary User</h4>
              <FormGroup widths="equal">
                <Input label="Email" name="primaryUser.email" />
                <Input label="Name" name="primaryUser.name" />
              </FormGroup>
            </>}

            <div style={{ textAlign: 'right' }}>
              <Button.Reset>Cancel</Button.Reset>
              <Button.Submit>Save</Button.Submit>
            </div>
            </>)}
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
  getCountries,
  getPrimaryBranchProvinces,
  getMailingBranchProvinces
}

const mapStateToProps = ({admin}) => {
  return {
    ...admin,
    config: admin.config[admin.currentTab]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPopupCasProducts)