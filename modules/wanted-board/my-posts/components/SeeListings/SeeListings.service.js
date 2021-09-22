import { FormattedMessage } from 'react-intl'
import moment from 'moment/moment'
import { getSafe } from '../../../../../utils/functions'
import { getLocaleDateFormat } from '../../../../../components/date-format'
import { ArrayToFirstItem, FormattedAssay } from '../../../../../components/formatted-messages'
import { FormattedNumber } from 'react-intl'
import { currency } from '../../../../../constants/index'
import {
  CapitalizedText,
} from './SeeListings.styles'

export const columns = [
    {
      name: 'productName',
      title: (
        <FormattedMessage id='wantedBoard.productName' defaultMessage='Product Name' />
      ),
      width: 250,
      sortPath: 'ProductOffer.companyProduct.intProductName',
      allowReordering: false
    },
    {
      name: 'packaging',
      title: (
        <FormattedMessage id='wantedBoard.packaging' defaultMessage='Packaging' />
      ),
      sortPath: 'ProductOffer.packaging'
    },
    {
      name: 'seller',
      title: (
        <FormattedMessage id='wantedBoard.seller' defaultMessage='Seller' />
      ),
      sortPath: 'ProductOffer.companyProduct.intProductCode'
    },
    { name: 'echoName', disabled: true },
    { name: 'echoCode', disabled: true },
    {
      name: 'fobPrice',
      title: (
        <FormattedMessage id='wantedBoard.fobPrice' defaultMessage='Fob Price' />
      ),
    }
]


export const getRows = (data, setState) => {
  let title

  let result = data.map((r, rIndex) => {
    const isOfferValid = r.validityDate ? moment().isBefore(r.validityDate) : true

    if (r.groupId) {
        title = (
        <FormattedMessage
            id='myInventory.broadcasting.disabled'
            defaultMessage='This Product Offer is part of virtual Product Group, its broadcast setting cannot be changed. If you wish not to broadcast it, remove it from the group.'
        />
        )
    } else if (isOfferValid) {
        switch (r.cfStatus.toLowerCase()) {
        case 'broadcasting':
            title = (
            <FormattedMessage
                id='myInventory.broadcasting.active'
                defaultMessage='Broadcasting now, switch off to stop broadcasting.'
            />
            )
            break
        case 'not broadcasting':
            title = (
            <FormattedMessage
                id='myInventory.broadcasting.inactive'
                defaultMessage='Not Broadcasting now, switch on to start broadcasting.'
            />
            )
            break
        case 'incomplete':
            title = (
            <FormattedMessage
                id='myInventory.broadcasting.incomplete'
                defaultMessage='Incomplete, please enter all required values first.'
            />
            )
            break
        case 'unmapped':
            title = (
            <FormattedMessage
                id='myInventory.broadcasting.unmapped'
                defaultMessage='Unmapped, please make sure related Product is mapped first.'
            />
            )
            break
        case 'unpublished':
            title = (
            <FormattedMessage
                id='myInventory.broadcasting.unpublished'
                defaultMessage='Unpublished, please make sure related Product is published first.'
            />
            )
            break
        default:
            title = (
            <FormattedMessage id='myInventory.broadcasting.notAvailable' defaultMessage='Status is not available' />
            )
        }
    } else {
        title = (
        <FormattedMessage
            id='myInventory.broadcasting.validityExpired'
            defaultMessage='This product offer validity date has expired, so it cannot be broadcasted.'
        />
        )
    }

    return {
        ...r,
        packaging: (
        <>
            {`${r.packagingSize} ${r.packagingUnit} `}
            <CapitalizedText>{r.packagingType}</CapitalizedText>{' '}
        </>
        )
    }
  })
  setState(prevState => ({ ...prevState, rows: result }))
}

export const getMappedRows = datagrid => datagrid?.rows?.map(r => {
  const po = r.productOffer
  const qtyPart = getSafe(() => po.companyProduct.packagingUnit.nameAbbreviation)

  return {
    rawData: po,
    id: po.id,
    product: po.product,
    expired: po.lotExpirationDate ? moment().isAfter(po.lotExpirationDate) : false,
    productName: getSafe(() => po.companyProduct.intProductName),
    productNumber: getSafe(() => po.companyProduct.intProductCode, 'N/A'),
    echoName: getSafe(() => po.companyProduct.companyGenericProduct.name, ''),
    echoCode: getSafe(() => po.companyProduct.companyGenericProduct.code, 'Unmapped'),
    chemicalName: getSafe(() => po.product.casProduct.chemicalName, po?.companyProduct?.intProductName),
    warehouse: getSafe(() => po.warehouse.deliveryAddress.cfName, ''),
    productId: getSafe(() => po.product.casProduct.id, 0),
    available: po.pkgAvailable ? <FormattedNumber minimumFractionDigits={0} value={po.pkgAvailable} /> : 'N/A',
    packagingType: getSafe(() => po.companyProduct.packagingType.name, ''),
    packagingSize: getSafe(() => po.companyProduct.packagingSize, ''),
    packagingUnit: getSafe(() => po.companyProduct.packagingUnit.nameAbbreviation, ''),
    qtyPart: qtyPart,
    quantity: getSafe(() => po.quantity, ''),
    cost: po.costPerUOM ? (
      <FormattedNumber
        minimumFractionDigits={3}
        maximumFractionDigits={3}
        style='currency'
        currency={currency}
        value={po.costPerUOM}
      />
    ) : (
      'N/A'
    ),
    seller: po.owner.cfDisplayName,
    pricingTiers: po.pricingTiers,
    fobPrice:
        po.pricingTiers.length > 1 ? (
          <>
            {' '}
            <FormattedNumber
              minimumFractionDigits={3}
              maximumFractionDigits={3}
              style='currency'
              currency={currency}
              value={po.pricingTiers[po.pricingTiers.length - 1].pricePerUOM}
            />{' '}
            -{' '}
            <FormattedNumber
              minimumFractionDigits={3}
              maximumFractionDigits={3}
              style='currency'
              currency={currency}
              value={po.pricingTiers[0].pricePerUOM}
            />{' '}
            {qtyPart && `/ ${qtyPart}`}{' '}
          </>
        ) : (
          <>
            {' '}
            <FormattedNumber
              minimumFractionDigits={3}
              maximumFractionDigits={3}
              style='currency'
              currency={currency}
              value={getSafe(() => po.pricingTiers[0].pricePerUOM, 0)}
            />{' '}
            {qtyPart && `/ ${qtyPart}`}{' '}
          </>
        ),
    manufacturer: getSafe(() => po.companyProduct.companyGenericProduct.manufacturer.name, 'N/A'),
    broadcasted: po.broadcasted,
    cfStatus: getSafe(() => po.cfStatus, 'N/A'),
    minOrderQuantity: getSafe(() => po.minPkg, ''),
    splits: getSafe(() => po.splitPkg, ''),
    condition: getSafe(() => po.conforming, ''),
    grade: po.grades && po.grades.length ? <ArrayToFirstItem values={po.grades.map(d => d.name)} /> : '',
    origin: getSafe(() => po.origin.name, ''),
    form: getSafe(() => po.form.name, ''),
    assayString: <FormattedAssay min={po.assayMin} max={po.assayMax} />,
    mfgDate: po.lotManufacturedDate ? moment(po.lotManufacturedDate).format(getLocaleDateFormat()) : 'N/A',
    expDate: po.lotExpirationDate ? moment(po.lotExpirationDate).format(getLocaleDateFormat()) : 'N/A',
    allocatedPkg: po.pkgAllocated,
    offerExpiration: po.validityDate ? moment(po.validityDate).format(getLocaleDateFormat()) : 'N/A',
    groupId: getSafe(() => po.parentOffer, ''),
    lotNumber: getSafe(() => po.lotNumber, ''),
    productStatus:
      po.companyProduct &&
      po.companyProduct.companyGenericProduct &&
      !po.companyProduct.companyGenericProduct.isPublished,
    productGroup: getSafe(() => po.companyProduct.companyGenericProduct.productGroup.name, null),
    tagsNames:
      po.companyProduct &&
      po.companyProduct.companyGenericProduct &&
      po.companyProduct.companyGenericProduct.productGroup &&
      po.companyProduct.companyGenericProduct.productGroup.tags &&
      po.companyProduct.companyGenericProduct.productGroup.tags.length
        ? po.companyProduct.companyGenericProduct.productGroup.tags.map(tag => tag.name)
        : []
  }
})

