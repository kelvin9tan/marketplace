import React, {Component} from 'react';
import {Control} from 'react-redux-form';
import DropdownRedux from "../../../../../components/Dropdown/DropdownRedux";
// import Checkbox from "../../../../../components/Checkbox/Checkbox";
import IncrementalPricing from './IncrementalPricing';
import CheckboxRedux from "../../../../../components/Checkbox/CheckboxRedux";
import Checkbox from "../../../../../components/Checkbox/Checkbox";

export default class Pricing extends Component {
    constructor(props){
        super(props);
        this.state = {incrementalPricing: false}
    }

    render() {
        let incremental = this.state.incrementalPricing ?
            <div className='incremental-wr'>
                <h4>Tiered Pricing</h4>
                <IncrementalPricing splits={15} minimum={20} />
            </div>
            : null;
        return (
            <div>

                    <h6>SET PRICE & RULES</h6>
                <div>
                    <div className='group-item-wr'>
                        <label htmlFor=".pricePr">Price pr (lb)</label>
                        <Control.text model=".pricePr"
                                      id=".pricePr"
                                      placeholder="$"/>
                    </div>
                    <div className='group-item-wr'>
                        <label htmlFor=".costPr">Cost pr (lb)</label>
                        <Control.text model=".costPr"
                                      id=".costPr"
                                      placeholder="$"/>
                    </div>
                    <div className='group-item-wr'>
                        <label htmlFor=".grossMargin">Gross Margin %</label>
                        <Control.text model=".grossMargin"
                                      id=".grossMargin"
                                      placeholder="$"/>
                    </div>
                    <div className='group-item-wr'>
                        <h6>Total Sales Price</h6>
                        <h6>$ UNDEFINED</h6>
                    </div>
                </div>
                <div>
                    <div className='group-item-wr'>
                        <Checkbox name='incremental'
                                  label='Tiered Pricing'
                                  onChange={(value) => this.setState({incrementalPricing: value})} />
                    </div>
                </div>
                <div>
                <div className='group-item-wr'>
                <label htmlFor=".splits">Splits</label>
                <Control.text model=".splits"
                              id=".splits"
                              placeholder="Packages"/>
                </div>
                <div className='group-item-wr'>
                <label htmlFor=".minimum">Minimum</label>
                <DropdownRedux opns={[{id: 10, name: '10'}]} placeholder='Packages'
                model="forms.addProductOffer.addProductOffer.minimum"
                dispatch={this.props.dispatch}/>
                </div>
                </div>
                <div className='group-item-wr'>
                        <CheckboxRedux model="forms.addProductOffer.addProductOffer.merchantVisibility"
                                       name="merchantVisibility"
                                       label="List Anonymously"
                                       dispatch={this.props.dispatch}/>
                </div>

                {incremental}
            </div>
        );
    }
}
