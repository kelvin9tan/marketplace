import Enzyme from 'enzyme'
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17'

// Utils
// import { filterTypes } from '../constants/filter'
import { findByTestAttr, mountWithIntl, checkProps, storeFactory } from '../../../test/testUtils'
//Components
import ZipDropdown from './ZipDropdown'

/**
 * @description Helper console.log view to see in each test what exactly is rendered in test.
 * console.log(component.debug()) // see what is exactly rendered
 */

Enzyme.configure({ adapter: new EnzymeAdapter() })

const defaultProps = {
  selection: true,
  search: true,
  allowAdditions: true,
  codes: [],
  onAddition: (e, data) => { },
  handleChange: (e, data) => { },
  onSearchChange: (e, data) => { },
  label: '',
  initialZipCodes: [],
  onChange: () => { },
  required: false,
  name: '',
}

describe('`ZipDropdown` render component', () => {

  test('does not throw warning with expected props', () => {
    //It checks components with default props.
    checkProps(ZipDropdown, defaultProps)
  })

})
