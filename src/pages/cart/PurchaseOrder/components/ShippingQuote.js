import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import Spinner from '../../../../components/Spinner/Spinner'
import Radio from '../../../../components/Radio/Radio'

class ShippingQuote extends Component {
    state = {}

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: null,
            shippingQuotesAreFetching: this.props.shippingQuotesAreFetching
        };
    }

    changeRadio(value){
        this.setState({selectedItem: value});
    }

    renderShippingQuotes() {
        if (typeof this.props.shippingQuotes.length === 'undefined' || this.props.shippingQuotes.length < 1 || typeof this.props.selectedAddress.id == 'undefined') {
            return (
                <div>Nothing to show</div>
            );
        }

        return (
            <>
                <table className="freight-selection">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Carrier</th>
                            <th className="a-right">Cost</th>
                            <th>Estimated Delivery</th>
                            <th>ETD</th>
                            <th>Service Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.shippingQuotes.map((sQuote, i) => {
                            let now = moment();
                            let deliveryDate = sQuote.estimatedDeliveryDate;
                            let etd = now.diff(deliveryDate, 'days') * -1 + 1;
                            const label = sQuote.carrierName;
                            const radioOptions = [{value: i.toString(), label: label}];

                            return (
                                <tr key={i}>
                                    <td>
                                        <Radio onChange={(value)=>this.changeRadio(value)}
                                            name="freight"
                                            opns={radioOptions}
                                            checked={this.state.selectedItem} />
                                    </td>
                                    <td>{sQuote.carrierName}</td>
                                    <td className="a-right"><NumberFormat
                                            value={sQuote.estimatedPrice}
                                            displayType={'text'}
                                            prefix={'$'}
                                            thousandSeparator={','}
                                            decimalSeparator={'.'}
                                            decimalScale={2}
                                            fixedDecimalScale={true} /></td>
                                    <td>{moment(sQuote.estimatedDeliveryDate).format('MMM D, YYYY')}</td>
                                    <td>{etd + (etd == 1 ? ' Day' : ' Days')}</td>
                                    <td>{sQuote.serviceType}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }

    render() {
        let sQuotes = this.renderShippingQuotes();
        return (
            <div className="shopping-cart-items">
                <header><h2>2. Freight Selection</h2></header>
                <div className="purchase-order-section">
                    <div className="group-item-wr">
                        {this.props.shippingQuotesAreFetching ? <Spinner /> : sQuotes}
                    </div>
                </div>
            </div>
        );
    }
}

export default ShippingQuote

ShippingQuote.propTypes = {
    selectedAddress: PropTypes.object,
    shippingQuotes: PropTypes.array,
    shippingQuotesAreFetching: PropTypes.bool
}