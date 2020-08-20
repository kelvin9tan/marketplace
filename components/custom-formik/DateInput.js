import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { FastField, Field, getIn } from 'formik'

import { getFieldError, setFieldValue } from './helpers'

import { DateInput } from 'semantic-ui-calendar-react'
import { getLocaleDateFormat, getStringISODate } from '../date-format'
import { FormattedMessage } from 'react-intl'

class FormikInput extends Component {
  constructor(props) {
    super(props)
    const { id, name } = props
    this.id = id || `field_input_${name}`
    this.state = {
      value: null
    }
  }

  handleRef = r => {
    r && r.inputNode.setAttribute('autocomplete', 'off')
  }

  render() {
    const { name, label, validate, inputProps = {}, fieldProps = {}, inputRef, fast } = this.props
    const { onChange, ...safeInputProps } = inputProps
    const DesiredField = fast === true ? FastField : Field

    return (
      <DesiredField
        name={name}
        validate={validate}
        render={({ field, form }) => {
          const error = getFieldError(field, form)
          return (
            <Form.Field error={!!error} {...fieldProps}>
              {!!label && <label htmlFor={this.id}>{label}</label>}

              {/* <InputRef inputRef={inputRef}> */}
              <DateInput
                {...safeInputProps}
                name={name}
                value={field.value}
                clearable
                onChange={(e, { name, value }) => {
                  setFieldValue(form, name, value, true)
                  Promise.resolve().then(() => {
                    onChange && onChange(e, { name, value })
                  })
                }}
                placeholder={getLocaleDateFormat()}
                data-test={`FormikInput_${this.id}_DateInput`}
                closable
                id={this.id}
                onBlur={form.handleBlur}
                dateFormat={getLocaleDateFormat()}
                animation='none'
                ref={this.handleRef}
                localization={typeof navigator !== 'undefined' ? window.navigator.language.slice(0, 2) : 'en'}
              />
              {error && <span className='sui-error-message'>{getIn(form.errors, name)}</span>}
              {/* </InputRef> */}
            </Form.Field>
          )
        }}
      />
    )
  }
}

export default FormikInput
