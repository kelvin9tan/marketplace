import React, { Component } from 'react';
import ProductOffers from "./components/ProductOffers";
import Filter from '../../../components/Filter';
import './myInventory.css';
import BroadcastRule from "./components/BroadcastRule";
import Spinner from "../../../components/Spinner/Spinner";

const GROUP_BY_ALL_COMPANIES = 1;
const GROUP_BY_REGIONS = 2;

class MyInventory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            targetGroups: [],
            currentSelected: 'All companies',
            selections: [
                {name: 'All companies', id: GROUP_BY_ALL_COMPANIES},
                {name: 'Region', id: GROUP_BY_REGIONS}
            ]
        };
    }

    componentDidMount() {
        this.props.getProductOffers();
        this.props.getCompanies();
    }

    componentWillReceiveProps(nextProps) {
        this.setFilter(GROUP_BY_ALL_COMPANIES, nextProps.companies)
    }

    setFilter(type, companies = this.props.companies) {
        switch (type) {
            case GROUP_BY_ALL_COMPANIES: {
                this.setState({currentSelected: 'All companies'}, ()=> this.groupByAllCompanies(companies));
                break;
            }
            case GROUP_BY_REGIONS: {
                this.setState({currentSelected: 'Regions'}, ()=> this.groupByRegions(companies));
                break;
            }
            default: this.setState({currentSelected: 'All companies'}, ()=> this.groupByAllCompanies(companies));
        }
    }

    groupByAllCompanies(companies) {
        let targets = companies.map(company => ({name: company.name}));
        this.setState({
            targetGroups: [{name: 'All Companies', visible: true, targets: targets}],
        });
    }

    groupByRegions(companies) {
        let targetsGroups = Object.values(companies.reduce((carry, company) => {
            let locations = company.offices.map(office => office.location);
            locations.forEach(location => {
                (carry[location.id] = carry[location.id] || {name: location.state, visible: true, targets: []})
                    .targets
                    .push({name: company.name});
            });
            return carry;
        }, {}));

        this.setState({
            targetGroups: targetsGroups,
        });
    }

    render() {
        let content = this.props.isFetching ? <Spinner/> : <ProductOffers productOffers={this.props.productOffers}/>;
        return (
            <div className='my-inventory'>
                <Filter filterFunc={(inputs) => {this.props.getData(inputs)}} />
                {content}
                <BroadcastRule
                    targetGroups={this.state.targetGroups}
                    selections={this.state.selections}
                    setFilter={(type) => this.setFilter(type)}
                    currentSelected={this.state.currentSelected}
                />
            </div>
        )
    }
}

export default MyInventory;