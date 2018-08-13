import React,{Component} from 'react';
import './AddedLots.css';
import upload from '../../../../../../../images/upload/upload.png';
import uploaded from '../../../../../../../images/upload/uploaded.png';


class AddedLot extends Component {

    constructor(props){
        super(props);
        this.state = {
            isUploaded: true
        }
    }

    render(){
        return (
        <div className='lots-item-container'>
            <div className='lots-item-info'>
                <span className='addLotNumber'>{this.props.position}</span>
                {this.props.lot.productName + ' • ' +
                this.props.lot.casNumber + ' • ' +
                this.props.lot.lotNumber}
            </div>
            <div className="vm">
            {/*<div className='lots-item-docs'>*/}
                {/*{this.state.isUploaded ? <img className="upload" src={uploaded} alt='drop'/> : <img className="uploaded" src={upload} alt='drop-close' />}*/}
                {/*<p className="uploadText">Click to upload C of A</p>*/}
            {/*</div>*/}
            </div>
            <div className="vl"></div>
            <div className='lots-item-button-text'>
                REMOVE
                <button onClick={()=>{this.props.removeLots()}} className="lots-item-button"></button>
            </div>
        </div>
        )
    }
}

export default AddedLot;