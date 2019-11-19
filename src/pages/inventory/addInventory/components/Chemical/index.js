import {connect} from 'react-redux'
import Chemical from './Chemical'
import {bindActionCreators} from 'redux'
import {actions} from 'react-redux-form'
//import {resetForm} from '../../../../../utils/functions';
import {addMessage} from '../../../../../modules/errors'
import {
  mapProducts,
  searchProducts,
  saveMapping,
  fetchRecentAddedProducts,
  fetchProductForms,
  fetchProductGrade,
  fetchProductConditions,
  fetchOrigin,
  fetchManufacturer,
  addLotSaveOffering,
  setSavedMappingToFalse
} from '../../../../../modules/products'
import {getUnitOfMeasurement, getUnitOfPackaging} from '../../../../../modules/productOffers'

const mapStateToProps = store => ({
  isSearching: store.products.isFetching,
  isMapping: store.products.isMapFetching,
  searchedProducts: store.products.data,
  productsFetched: store.products.productsFetched,
  mappedProducts: store.products.mappedData,
  mappedDataFetched: store.products.mappedDataFetched,
  productForms: store.products.productForms,
  productGrade: store.products.productGrade,
  productConditions: store.products.productConditions,
  originData: store.products.origin,
  originFetched: store.products.originFetched,
  manufacturer: store.products.manufacturer,
  manufacturerFetched: store.products.manufacturerFetched,
  isFetchingManufacturer: store.products.isFetchingManufacturer,
  isFetchingOrigin: store.products.isFetchingOrigin,
  recentProducts: store.products.recentProducts,
  unitOfMeasurement: store.productOffers.unitOfMeasurement,
  unitOfPackaging: store.productOffers.unitOfPackaging,
  productMapping: {
    ...store.forms.productMapping,
    packaging: {
      ...store.forms.productMapping.packaging,
      packagingType:
        store.productOffers.productOffer.packaging &&
        store.productOffers.productOffer.packaging.packagingType.measureType ===
          store.productOffers.productOffer.packaging.unit.measureType
          ? store.forms.productMapping.packaging.packagingType
          : ''
    }
  },
  comboData: store.products.origin,
  productOffering: store.forms.productOffering,
  productOffer: store.productOffers.productOffer,
  savedMapping: store.products.savedMapping,
  fileMaxSize: store.products.fileMaxSize
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      mapProducts,
      setMapping: values => actions.merge('forms.productMapping', values),
      searchProducts,
      saveMapping,
      fetchRecentAddedProducts,
      getUnitOfPackaging,
      fetchProductForms,
      fetchManufacturer,
      fetchProductGrade,
      getUnitOfMeasurement,
      fetchProductConditions,
      fetchOrigin,
      addMessage,
      addLotSaveOffering,
      setSavedMappingToFalse,
      dispatch
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Chemical)
