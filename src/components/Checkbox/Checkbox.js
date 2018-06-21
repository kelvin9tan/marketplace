import React, {Component} from 'react';
import './checkbox.css';
import PropTypes from "prop-types";

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        }
    }

    handleChange () {
        this.setState({checked: !this.state.checked}, ()=>this.props.onChange(this.state.checked));
    }

    render() {
        return (
            <div className="input-checkbox">
                <label><p>{this.props.label}</p>
                    <input type="checkbox" name={this.props.name}
                           onChange={(e) => {this.handleChange(e)}}
                           checked={this.state.checked}/>
                    <span className={"checkmark " + (this.props.style || '')}>  </span>
                </label>
            </div>
        )
    }
}

Checkbox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.string,
    onChange: PropTypes.func
};

export default Checkbox;




