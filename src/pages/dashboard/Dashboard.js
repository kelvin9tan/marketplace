import React, {Component} from 'react';
import './dashboard.css'
import ConMess from '../../components/constructionMessage';
import Spinner from "../../components/Spinner/Spinner";


class Dashboard extends Component {

    render() {
        return (
            <div>
            <div className="dashboard">
                <h1 className='header'>Dashboard</h1>
                <ConMess/>
            </div>
            </div>
        );
    }
}

export default Dashboard;
