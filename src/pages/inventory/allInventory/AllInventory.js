import React, { Component } from 'react';
import ProductOffers from "./components/ProductOffers";
import Filter from '../../../components/Filter';
import Spinner from '../../../components/Spinner/Spinner';

class AllInventory extends Component {

    componentDidMount(){
        this.props.getData();
    }

    render() {
        let content = this.props.isFetching ? <div><Spinner/></div> :
            <ProductOffers productOffers={this.props.productOffers} addPopup={this.props.addPopup}/>;
        return (
            <div>
                <h1 className='header'>INVENTORY OVERVIEW</h1>
                <Filter filterFunc={(inputs) => {this.props.getData(inputs)}}/>
                {content}
            </div>
        )
    }
}

export default AllInventory;