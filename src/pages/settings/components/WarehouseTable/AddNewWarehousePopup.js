import React from 'react';
import { connect } from 'react-redux';
import { Control, Form } from 'react-redux-form';

// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';

import { handleAddNewWarehousePopup, addNewWarehouseRequest } from '../../actions';

class EditWarehousePopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      warehouseNameValue: '',
      addressValue: '',
      cityValue: '',
      stateValue: '',
      zipCodeValue: '',
      warehouseContactNameValue: '',
      phoneValue: '',
      emailValue: ''
    }
  }

  render() {
    const { 
      warehouseNameValue, 
      addressValue, 
      cityValue, 
      stateValue, 
      zipCodeValue, 
      warehouseContactNameValue, 
      phoneValue, 
      emailValue 
    } = this.state
    const { 
      handleAddNewWarehousePopup,  
      addNewWarehouseRequest 
    } = this.props;

    return (					
      <div className="popup-wrapper col-xs-10 center-xs">      
        <Form 
          model="forms.settingsPopup.addNewWarehouse" 
          onSubmit={ (value) => addNewWarehouseRequest(value) }
          className="b-popup col-xs-10"
        >    
          <h2>{'Warehouse'} Profile</h2>
          <ul>
            <li className="add-warehouse-inputs-wrapper">
              <label className="warehouse-label name" htmlFor="warehouse-name">                        
                Warehouse name
              <Control.text model=".warehouseName" className="warehouse-input" id="warehouse-name" defaultValue={ warehouseNameValue } />
              </label>
              <label className="warehouse-label address" htmlFor="warehouse-address">
                Address
                <Control.text model=".address" className="warehouse-input" id="warehouse-address" defaultValue={ addressValue } />
              </label>
              <label className="warehouse-label city" htmlFor="warehouse-city">
                City
                <Control.text model=".city" className="warehouse-input" id="warehouse-city" defaultValue={ cityValue } />
              </label>            
              <label className="warehouse-label state" htmlFor="warehouse-state">  
                State
                <Control.text model=".state" className="warehouse-input" id="warehouse-state" defaultValue={ stateValue } />
                {/* <TextField
                  select
                  className="b-search__select-field col-xs-3"
                  onChange={ handleChangeFieldsCurrentValue('filterFieldCurrentValue') }
                  variant="outlined"
                  onClick={ (e) => { 
                      if(e.target.value === undefined) return;
                      return 123;
                    } 
                  }
                > 
                  {unitedStates.map(option => (
                    <MenuItem 
                      key={ option.name }  
                      value={ option.name }
                    >
                      { option.name }
                    </MenuItem>
                  ))}
                </TextField>  */}
              </label>            
              <label className="warehouse-label zip-code" htmlFor="warehouse-zip-code">
                Zip Code
                <Control.text model=".zipCode" className="warehouse-input" id="warehouse-zip-code" defaultValue={ zipCodeValue } />
              </label>
            </li>
            <li className="add-warehouse-inputs-wrapper">
              <label className="warehouse-label contact-name" htmlFor="warehouse-contactName">
                Contact name
                <Control.text model=".contactName" className="warehouse-input" id="warehouse-contactName" defaultValue={ warehouseContactNameValue } />
              </label>                    
              <label className="warehouse-label phone" htmlFor="warehouse-phone">
                Phone number
                <Control.text model=".phone" className="warehouse-input" id="warehouse-phone" defaultValue={ phoneValue } />
              </label>
              <label className="warehouse-label email" htmlFor="warehouse-email">  
                E-mail
                <Control.text model=".email" className="warehouse-input" id="warehouse-email" defaultValue={ emailValue } />
              </label>
              <div className="buttons-wrapper">
                <input 
                  type="button" 
                  defaultValue="Cancel"
                  onClick={ handleAddNewWarehousePopup }
                  className="cancel-popup-btn"
                />
                <button className="save-btn">Save</button>
              </div>
            </li>          
          </ul>
        </Form>
      </div>
    );    
  }
}

const mapDispatchToProps = {   
  handleAddNewWarehousePopup,
  addNewWarehouseRequest
};

export default connect(null, mapDispatchToProps)(EditWarehousePopup);