import React, { Component } from 'react'

import { Label, Popup, List } from 'semantic-ui-react'
import { string, object} from "prop-types";

import { FormattedMessage } from 'react-intl'


export default class ArrayToMultiple extends Component {
  render() {
    let {values} = this.props
    if (!values || values.length === 0) return null

    if (values.length > 1) {
      return (
        <div>
          <Popup
            wide='very'
            data-test='array_to_multiple_list'
            content={<List items={values} />}
            trigger={<Label><FormattedMessage id='global.multiple' defaultMessage='Multiple' /></Label>}
          />
        </div>
      )
    }
    else {
      return values[0]
    }
  }
}

ArrayToMultiple.propTypes = {
  values: object
}

ArrayToMultiple.defaultProps = {
  values: null
}