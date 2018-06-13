import React, {Component} from 'react';
import PropTypes from "prop-types";
import './dropdown.css';
import classnames from 'classnames';
import ArrowUp from '../../images/inv-filter/dropdown.png';

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.setCurrentValue = this.setCurrentValue.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.dropdownRef = React.createRef();
        this.state = {
            isOpen: false,
            currentValue: this.props.currentValue,
        };
    }

    setCurrentValue(val){
        this.setState({currentValue: val, isOpen: false})
    }

    componentWillReceiveProps(nextProps){
        this.setState({currentValue: nextProps.currentValue, isOpen: false})
    }

    componentWillMount(){
        document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside(e) {
        if (this.dropdownRef.current.contains(e.target)) return;
        this.setState({isOpen: false})
    }



    render() {
        let {currentValue, isOpen} = this.state;
        let opt = this.props.opns.map((option, index)=>{
            return <li key={index + 'dropdown'} onClick={()=>{this.setCurrentValue(option.value)}}>{option.value}</li>
        });
        let options = this.state.isOpen ?
            <ul className='dropdown-options'>
                {opt}
            </ul> : null;
        return (
            <div className='dropdown-wr' ref={this.dropdownRef} >
                <div className={'dropdown-trigger ' + classnames({'open' : isOpen})} onClick={()=>{this.setState({isOpen: !this.state.isOpen})}}>
                    <div>{currentValue || this.props.placeholder || 'Select Option'}<img src={ArrowUp} /></div>
                </div>
                {options}
                {/*<div class="sk-cube-grid">*/}
                    {/*<div class="sk-cube sk-cube1"></div>*/}
                    {/*<div class="sk-cube sk-cube2"></div>*/}
                    {/*<div class="sk-cube sk-cube3"></div>*/}
                    {/*<div class="sk-cube sk-cube4"></div>*/}
                    {/*<div class="sk-cube sk-cube5"></div>*/}
                    {/*<div class="sk-cube sk-cube6"></div>*/}
                    {/*<div class="sk-cube sk-cube7"></div>*/}
                    {/*<div class="sk-cube sk-cube8"></div>*/}
                    {/*<div class="sk-cube sk-cube9"></div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

Dropdown.propTypes = {
    opns: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
        })
    ).isRequired,
    currentValue: PropTypes.string,
    placeholder: PropTypes.string
};


export default Dropdown;




