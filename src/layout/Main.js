import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

import Dashboard from '../pages/dashboard'
import Inventory from "../pages/inventory";
import Orders from "../pages/orders/Orders";
import Clients from "../pages/clients/Clients"
import Reports from "../pages/reports/Reports"
import Settings from "../pages/settings/Settings"
import Support from "../pages/support/Support"


class Main extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route path="/inventory" component={Inventory}/>
                    <Route exact path="/orders" component={Orders}/>
                    <Route exact path="/clients" component={Clients}/>
                    <Route exact path="/reports" component={Reports}/>
                    <Route exact path="/settings" component={Settings}/>
                    <Route exact path="/support" component={Support}/>
                </Switch>
            </div>
        );
    }
}

export default Main