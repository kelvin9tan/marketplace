import {connect} from 'react-redux';
import SearchProduct from './SearchProduct';
import {bindActionCreators} from 'redux'
import {searchProduct} from "../../modules/searchProduct";


function mapStateToProps(store) {
    return {
        results: store.searchProduct.results
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({searchProduct}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchProduct);
