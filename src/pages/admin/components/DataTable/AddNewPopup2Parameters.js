import React from 'react'
import { connect } from 'react-redux'

import { Modal, FormGroup } from 'semantic-ui-react'

import { closeAddPopup , postNewRequest } from '../../actions'
import { Form, Input, Button } from 'formik-semantic-ui'
import * as Yup from 'yup'


const initialFormValues = {
    val0: '',
    val1: '',
}

const formValidation = Yup.object().shape({
    val0: Yup.string().min(1, "Too short").required("Required"),
    val1: Yup.string().min(1, "Too short").required("Required"),
})

class AddNewPopup2Parameters extends React.Component {

    render() {
        const {
            closeAddPopup,
            currentTab,
            config,
            postNewRequest
        } = this.props

        return (
            <Modal open centered={false}>
                <Modal.Header>Add { config.addEditText }</Modal.Header>
                <Modal.Content>
                    <Form
                        initialValues={initialFormValues}
                        validationSchema={formValidation}
                        onReset={closeAddPopup}
                        onSubmit={(values, actions) => {
                            let data = {
                                [config.edit[0].name]: values.val0,
                                [config.edit[1].name]: values.val1,
                            }
                            postNewRequest(config, data)
                        }}
                    >
                        <FormGroup widths="equal">
                            <Input type={config.edit[0].type} label={config.edit[0].title} name="val0" />
                        </FormGroup>
                        <FormGroup widths="equal">
                            <Input type={config.edit[1].type} label={config.edit[1].title} name="val1" />
                        </FormGroup>

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
    closeAddPopup,
    postNewRequest
};

const mapStateToProps = state => {
    let cfg = state.admin.config[state.admin.currentTab];
    return {
        config: cfg,
        currentTab: state.admin.currentTab,
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPopup2Parameters)
