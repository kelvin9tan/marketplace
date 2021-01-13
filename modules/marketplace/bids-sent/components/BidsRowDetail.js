import React from 'react'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
import { Input, Button, TextArea, Checkbox } from 'formik-semantic-ui-fixed-validation'
import {
  Form,
  Modal,
  Dimmer,
  Loader,
  Grid,
  GridRow,
  GridColumn,
  List,
  Label,
  FormField,
  FormGroup,
  Segment,
  Radio
} from 'semantic-ui-react'

import { Formik } from 'formik'
import { Field as FormikField } from 'formik'
import * as Yup from 'yup'
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl'
import { errorMessages } from '~/constants/yupValidation'
import { currencyId, currency } from '~/constants/index'
import styled from 'styled-components'
import { Required } from '~/components/constants/layout'
import { withDatagrid } from '~/modules/datagrid'
import { removeEmpty, getSafe, getPricing } from '~/utils/functions'
import confirm from '~/src/components/Confirmable/confirm'
import { uniqueArrayByKey } from '~/utils/functions'
import get from 'lodash/get'
import ErrorFocus from '~/components/error-focus'
import { Schedule } from '@material-ui/icons'
import {
  DefaultIcon,
  IconWrapper,
  StyledName,
  NameWrapper,
  HistoryRow,
  HistoryDetailGrid,
  HistoryDetailRow
} from '../../constants/layout'
import moment from 'moment'

import { TableSegment, StyledList, StyledRectangle, PriceInput, BottomButtons } from '../../constants/layout'
import * as AT from "../../../admin/action-types";
import * as api from "../../../admin/api";

export const DetailRow = styled.div`
  text-align: left;
  font-size: 14px;
  border: solid 1px #dee2e6;
  background-color: #f8f9fb;
  max-height: calc(80vh - 180px);
  overflow-y: auto;
`

const FieldRectangle = styled.div`
  padding: 10px 15px;
  border-radius: 3px;
  border: solid 1px #dee2e6;
  background-color: #f8f9fb;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #20273a;
  
  &.disabled {
    opacity: 0.45;
  }
`

const MessageInputHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const SmallText = styled.div`
  font-size: 12px;
  color: #848893;
  position: relative;
  bottom: -6px;
`

const StyledGrid = styled(Grid)`
  &.ui.grid {
    margin: 0;
  
    .row {
      margin: 0;
      padding: 7.5px 0;
      
      .column {
        margin: 0;
        padding: 0 10px;  
      }  
    }
    
    .ui.input {
      height: 40px;
    }
  }
`

const RowDescription = styled.div`
  white-space: nowrap;
  display: flex;
  text-overflow: ellipsis;
  overflow: hidden;
`

const BlueText = styled.div`
  color: #2599d5;
  margin: 0 4px;
`

const formValidation = () =>
  Yup.object().shape({
    pricePerUOM: Yup.string().trim().required(errorMessages.requiredMessage),
    pkgAmount: Yup.number()
      .min(1, errorMessages.minimum(1))
      .required(errorMessages.requiredMessage)
      .test('int', errorMessages.integer, val => {
        return val % 1 === 0
      })
  })

class BidsRowDetail extends React.Component {
  state = {
    initialFormValues: {
      id: '',
      message: '',
      pkgAmount: '',
      pricePerUOM: ''
    },
    detailExpandedIds: [],
    touched: false,
    radioState: ''
  }

  componentDidMount() {
    const { popupValues, initValues } = this.props

    if (initValues && initValues.values && (initValues.values.id === popupValues.id)) {
      this.setState({
        ...initValues.state,
        initialFormValues: initValues.values,
        touched: false
      })
    } else {
      this.setState({
        initialFormValues: {
          id: popupValues.id,
          message: '',
          pkgAmount: popupValues.cfHistoryLastPkgAmount,
          pricePerUOM: ''
        },
        detailExpandedIds: [],
        touched: false
      })
    }
  }

  componentWillUnmount() {
    if ((this.state.touched || Object.keys(this.formikProps.touched).length) && this.props.onUnmount) {
      this.props.onUnmount({
        values: this.formikProps.values,
        state: this.state
      })
    }
  }

  submitOffer = async ({values, setSubmitting }) => {
    const { popupValues, onClose, counterOffer, acceptOffer, rejectOffer, datagrid } = this.props
    const { radioState } = this.state

    switch (radioState) {
      case 'counter': {
        const body = {
          pkgAmount: parseInt(values.pkgAmount),
          pricePerUOM: parseFloat(values.pricePerUOM),
          message: values.message
        }
        removeEmpty(body)

        try {
          const response = await counterOffer(popupValues.id, body)
          console.log('!!!!!!!!!! submitOffer counterOffer response', response)
          // ! ! update row only
          datagrid.loadData()
          onClose(popupValues)
        } catch (e) {
          console.error(e)
        }
        break
      }
      case 'accept': {
        try {
          await acceptOffer(popupValues.id)
          datagrid.loadData()
          onClose(popupValues)
        } catch (e) {
          console.error(e)
        }
        break
      }
      case 'reject': {
        try {
          await rejectOffer(popupValues.id)
          datagrid.loadData()
          onClose(popupValues)
        } catch (e) {
          console.error(e)
        }
        break
      }
    }
    setSubmitting(false)
  }

  getDetailTable = table => {
    return (
      <TableSegment>
        <StyledList divided relaxed horizontal size='large'>
          {table.map(t => (
            <List.Item>
              <List.Content>
                <List.Header as='label'>
                  {t[0]}
                </List.Header>
                <List.Description as='span' className={t[2] ? t[2] : ''}>
                  {t[1]}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </StyledList>
      </TableSegment>
    )
  }

  getRowText = ({ row, index, fob, quantity, product }) => {
    const hasUserName = !!row.createdBy.name

    return (
      <RowDescription>
        <FormattedMessage
          id='marketplace.detailRow.userCompanyHasCountered'
          values={{
            name: <BlueText>{row.createdBy.name}</BlueText>,
            company: <BlueText>{row.createdBy.company.name}</BlueText>,
            fob: <BlueText>{fob}</BlueText>,
            quantity: <BlueText>{quantity}</BlueText>,
            product: <BlueText>{product}</BlueText>
          }}
        />
      </RowDescription>
    )
  }

  render() {
    const {
      intl: { formatMessage },
      popupValues,
      productOffer,
      closePopup,
      isSending,
      loading,
      listFobPriceUnit,
      packagingType,
      packagingUnit,
      packagingSize
    } = this.props

    const { detailExpandedIds, radioState } = this.state

    //console.log('!!!!!!!!!! aaaaa popupValues', popupValues)

    const histories = popupValues.histories.slice(1)
    const lastHistory = popupValues.histories[popupValues.histories.length - 1]

    return (
      <Formik
        autoComplete='off'
        enableReinitialize
        initialValues={this.state.initialFormValues}
        validationSchema={formValidation()}
        onSubmit={this.submitOffer}>
        {formikProps => {
          let { values, setFieldValue, setFieldTouched, errors, touched, isSubmitting } = formikProps
          this.formikProps = formikProps

          const pkgAmount = parseInt(values.pkgAmount)
          let amount = pkgAmount
          if (isNaN(pkgAmount)) amount = 1

          const listFobPrice = getPricing(popupValues.productOffer, amount).price
          const totalListPrice = amount * packagingSize * listFobPrice

          const disabledInputPrice = radioState !== 'counter'

          return (
            <DetailRow>
              <Dimmer active={isSending || loading} inverted>
                <Loader />
              </Dimmer>
              <Form>
                <StyledGrid >
                  {histories.map((r, index) => {
                    return (
                      <HistoryRow>
                        <GridColumn style={{ padding: '0' }}>
                          <HistoryDetailGrid>
                            <HistoryDetailRow
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const { detailExpandedIds } = this.state
                                if (detailExpandedIds.length) {
                                  if (detailExpandedIds[0] === index) {
                                    this.setState({ detailExpandedIds: [], touched: true })
                                  } else {
                                    this.setState({ detailExpandedIds: [index], touched: true })
                                  }
                                } else {
                                  this.setState({ detailExpandedIds: [index], touched: true })
                                }
                              }}>
                                <GridColumn width={4}>
                                  <NameWrapper>
                                    <IconWrapper>{DefaultIcon}</IconWrapper>
                                    <StyledName style={{ marginLeft: '10px', paddingTop: '2px' }}>
                                      <div className='name'>
                                        {r.createdBy.name}
                                      </div>
                                      <div className='company'>
                                        {r.createdBy.company.cfDisplayName}
                                      </div>
                                    </StyledName>
                                  </NameWrapper>
                                </GridColumn>
                                <GridColumn width={9}>
                                  {this.getRowText({
                                      row: r,
                                      index,
                                      fob: (
                                        <>
                                          <FormattedNumber
                                            minimumFractionDigits={2}
                                            maximumFractionDigits={2}
                                            style='currency'
                                            currency={currency}
                                            value={r.pricePerUOM}
                                          />
                                          {listFobPriceUnit}
                                        </>
                                      ),
                                    quantity: `${r.pkgAmount} (${packagingSize} ${packagingUnit} ${packagingType})`,
                                    product: this.props.productName
                                  })}
                                </GridColumn>
                                <GridColumn width={3} style={{ color: '#848893' }}>
                                  {moment(r.createdAt).fromNow()}
                                </GridColumn>
                            </HistoryDetailRow>
                            {detailExpandedIds.some(id => id === index) && (
                              <>
                                <GridRow>
                                  <GridColumn>
                                    {this.getDetailTable([
                                      [
                                        <FormattedMessage id='marketplace.quantity' defaultMessage='Quantity' />,
                                        `${r.pkgAmount} (${packagingSize} ${packagingUnit} ${packagingType})`,
                                        'green'
                                      ],
                                      [
                                        <FormattedMessage
                                          id='marketplace.offeredFobPrice' defaultMessage='Offered FOB Price' />,
                                        <>
                                          <FormattedNumber
                                            minimumFractionDigits={2}
                                            maximumFractionDigits={2}
                                            style='currency'
                                            currency={currency}
                                            value={r.pricePerUOM}
                                          />
                                          {listFobPriceUnit}
                                        </>,
                                        'green'
                                      ],
                                      [
                                        <FormattedMessage
                                          id='marketplace.totalOfferedPrice' defaultMessage='Total Offered Price' />,
                                        <FormattedNumber
                                          minimumFractionDigits={2}
                                          maximumFractionDigits={2}
                                          style='currency'
                                          currency={currency}
                                          value={r.pkgAmount * r.pricePerUOM * packagingSize}
                                        />,
                                        'green'
                                      ]
                                    ])}
                                  </GridColumn>
                                </GridRow>
                                <GridRow>
                                  <GridColumn>
                                    <StyledRectangle className='dark-grey'>
                                      <div className='header'>
                                        <FormattedMessage
                                          id='marketplace.messageFromSeller'
                                          defaultMessage='Message from Seller' />
                                      </div>
                                      <div className='message'>
                                        {r.message}
                                      </div>
                                    </StyledRectangle>
                                  </GridColumn>
                                </GridRow>
                              </>
                            )}
                          </HistoryDetailGrid>
                        </GridColumn>
                      </HistoryRow>
                    )})
                  }
                  <GridRow>
                    <GridColumn>
                      {this.getDetailTable([
                        [
                          <FormattedMessage id='marketplace.productName' defaultMessage='Product Name' />,
                          this.props.productName
                        ],
                        [
                          <FormattedMessage id='marketplace.quantity' defaultMessage='Quantity' />,
                          isNaN(pkgAmount)
                            ? `${packagingSize} ${packagingUnit} ${packagingType}`
                            : `${pkgAmount} (${packagingSize} ${packagingUnit} ${packagingType})`
                        ],
                        [
                          <FormattedMessage id='marketplace.listFobPrice' defaultMessage='List FOB Price' />,
                          <>
                            <FormattedNumber
                              minimumFractionDigits={2}
                              maximumFractionDigits={2}
                              style='currency'
                              currency={currency}
                              value={listFobPrice}
                            />
                            {listFobPriceUnit}
                          </>
                        ],
                        [
                          <FormattedMessage id='marketplace.totalListPrice' defaultMessage='Total List Price' />,
                          <FormattedNumber
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style='currency'
                            currency={currency}
                            value={totalListPrice}
                          />
                        ]
                      ])}
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      {this.getDetailTable([
                        [
                          <FormattedMessage id='marketplace.offeredFobPrice' defaultMessage='Offered FOB Price' />,
                          <>
                            <FormattedNumber
                              minimumFractionDigits={2}
                              maximumFractionDigits={2}
                              style='currency'
                              currency={currency}
                              value={popupValues.cfHistoryLastPricePerUOM}
                            />
                            {listFobPriceUnit}
                          </>,
                          'green'
                        ],
                        [
                          <FormattedMessage
                            id='marketplace.totalOfferedPrice' defaultMessage='Total Offered Price'/>,
                          <FormattedNumber
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style='currency'
                            currency={currency}
                            value={
                              popupValues.cfHistoryLastPricePerUOM * packagingSize
                              * popupValues.cfHistoryLastPkgAmount
                            }
                          />,
                          'green'
                        ]
                      ])}
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn>
                      <StyledRectangle className='dark-grey'>
                        <div className='header'>
                          <FormattedMessage
                            id='marketplace.messageFromSeller'
                            defaultMessage='Message from Seller' />
                        </div>
                        <div className='message'>
                          {lastHistory.message}
                        </div>
                      </StyledRectangle>
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn width={5}>
                      <Input
                        label={
                          <>
                            {formatMessage({ id: 'global.quantity', defaultMessage: 'Quantity' })}
                            {!disabledInputPrice && (<Required />)}
                          </>
                        }
                        name='pkgAmount'
                        inputProps={{
                          placeholder:
                            formatMessage({ id: 'global.enterQuantity', defaultMessage: 'Enter Quantity' }),
                          type: 'number',
                          min: 1,
                          step: 1,
                          disabled: disabledInputPrice
                        }}
                      />
                    </GridColumn>
                    <GridColumn width={5}>
                      <PriceInput
                        name='pricePerUOM'
                        inputProps={{
                          placeholder: formatMessage({
                            id: 'marketplace.enterCounterBid',
                            defaultMessage: 'Enter Counter Bid'
                          }),
                          min: 0,
                          type: 'number',
                          disabled: disabledInputPrice
                        }}
                        label={
                          <>
                            <FormattedMessage
                              id='marketplace.yourFobPriceOffer'
                              defaultMessage='Your FOB price offer'>
                              {text => text}
                            </FormattedMessage>
                            {!disabledInputPrice && (<Required />)}
                          </>
                        }
                        currencyLabel={'$'}
                      />
                    </GridColumn>
                    <GridColumn width={5}>
                      <Form.Field>
                        <label>
                          <FormattedMessage
                            id='marketplace.YourTotalBid'
                            defaultMessage='Your Total Bid'>
                            {text => text}
                          </FormattedMessage>
                        </label>
                        <FieldRectangle className={disabledInputPrice ? 'disabled' : ''}>
                          <FormattedNumber
                            minimumFractionDigits={2}
                            maximumFractionDigits={2}
                            style='currency'
                            currency={currency}
                            value={values.pkgAmount * packagingSize * values.pricePerUOM}
                          />
                        </FieldRectangle>
                      </Form.Field>
                    </GridColumn>
                  </GridRow>

                  <GridRow>
                    <GridColumn width={4} style={{ display: 'flex', flexDirection: 'column', paddingTop: '4px'}}>
                      <Radio
                        checked={radioState === 'counter'}
                        value={'counter'}
                        onChange={(_e, { value }) => {
                          this.setState({ radioState: value })
                        }}
                        label={formatMessage({ id: 'marketplace.counter', defaultMessage: 'Counter' })}
                      />
                      <Radio
                        checked={radioState === 'accept'}
                        value={'accept'}
                        onChange={(_e, { value }) => {
                          this.setState({ radioState: value })
                        }}
                        label={formatMessage({ id: 'marketplace.accept', defaultMessage: 'Accept' })}
                      />
                      <Radio
                        checked={radioState === 'reject'}
                        value={'reject'}
                        onChange={(_e, { value }) => {
                          this.setState({ radioState: value })
                        }}
                        label={formatMessage({ id: 'marketplace.reject', defaultMessage: 'Reject' })}
                      />
                    </GridColumn>
                    <GridColumn width={12}>
                      <TextArea
                        name='message'
                        label={
                          <MessageInputHeader>
                            <FormattedMessage id='marketplace.messageToBuyer' defaultMessage='Message to Buyer' />
                            <SmallText>
                              <FormattedMessage id='marketplace.optional' defaultMessage='Optional' />
                            </SmallText>
                          </MessageInputHeader>
                        }
                        inputProps={{
                          'data-test': 'wanted_board_sidebar_specialNotes_inp',
                          placeholder: formatMessage({
                            id: 'marketplace.enterMessage',
                            defaultMessage: 'Enter Message...'
                          })
                        }}
                      />
                    </GridColumn>
                  </GridRow>
                </StyledGrid>
                <ErrorFocus />
                <BottomButtons>
                  <Button
                    className='borderless'
                    size='large'
                    onClick={() => this.props.onClose(popupValues)}
                    data-test='inventory_quick_edit_pricing_popup_cancel_btn'>
                    {formatMessage({ id: 'marketplace.close', defaultMessage: 'Close' })}
                  </Button>
                  <Button.Submit
                    disabled={radioState === ''}
                    className='light'
                    size='large'
                    onClick={() => {
                      let { validateForm, submitForm } = formikProps
                      validateForm().then(err => {
                        const errors = Object.keys(err)
                        if (errors.length && errors[0] !== 'isCanceled') {
                          submitForm() // to show errors
                        } else {
                          this.submitOffer(formikProps)
                        }
                      })
                    }}
                    type='button'
                    data-test='inventory_quick_edit_pricing_popup_save_btn'>
                    {formatMessage({ id: 'marketplace.submit', defaultMessage: 'Submit' })}
                  </Button.Submit>
                </BottomButtons>
              </Form>
            </DetailRow>
          )
        }}
      </Formik>
    )
  }
}

function mapStateToProps(store, params) {
  //const { popupValues } = store.marketplace
  const { popupValues } = params
  const productOffer = popupValues.productOffer
  const companyProduct = productOffer.companyProduct

  const priceUnit = getSafe(() => companyProduct.packagingUnit.nameAbbreviation, '')

  return {
    popupValues,
    productOffer,
    isSending: store.marketplace.isSending,
    loading: store.marketplace.loading,
    productName: getSafe(() => companyProduct.intProductName, ''),
    listFobPriceUnit: priceUnit ? `/${priceUnit}` : '',
    packagingType: getSafe(() => companyProduct.packagingType.name, ''),
    packagingUnit: getSafe(() => companyProduct.packagingUnit.nameAbbreviation, ''),
    packagingSize: getSafe(() => companyProduct.packagingSize, 1)
  }
}

export default withDatagrid(connect(mapStateToProps, { ...Actions })(injectIntl(BidsRowDetail)))