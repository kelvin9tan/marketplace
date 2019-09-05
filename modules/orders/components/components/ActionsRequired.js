import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from "../../actions"
import { Segment, Grid, Header, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getSafe } from "~/utils/functions"

class ActionsRequired extends React.Component {

  confirmOrder = () => {
    this.props.confirmOrder(this.props.order.id)
  }

  openAssignLots = () => {
    this.props.openAssignLots()
  }

  rejectOrder = () => {
    this.props.rejectOrder(this.props.order.id)
  }

  shipOrder = () => {
    this.props.shipOrder(this.props.order.id)
  }

  renderSegment(columnWidth, description, buttons) {
    return (
      <Segment color='blue' style={{ marginLeft: '32px', marginRight: '32px' }}>
        <Grid verticalAlign='middle' columns='equal'>
          <Grid.Column width={columnWidth}>
            <Header as='h3' style={{ margin: '0 0 0.3571429rem' }}>
              <FormattedMessage id='order.actionRequired' defaultMessage='Action Required' />
            </Header>
            <FormattedMessage id={description} />
          </Grid.Column>
          <Grid.Column>
            <Grid verticalAlign='middle' columns='equal'>
              {buttons.map(button => {
                return (
                  <Grid.Column>
                    <Button primary={button.buttonType === 'primary'}
                            basic={button.buttonType === 'basic'}
                            fluid
                            size='large'
                            onClick={() => button.onClick()}
                            data-test={button.dataTest}>
                      <FormattedMessage id={button.text} />
                    </Button>
                  </Grid.Column>
                )
              })}
            </Grid>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }

  render() {
    const { action, ordersType } = this.props

    return (
      <>
        {ordersType === 'Sales' ? (
          <>
            {action === '100' ? this.renderSegment(
              13,
              'order.confirm.description',
              [{
                buttonType: 'primary',
                onClick: this.confirmOrder,
                dataTest: 'orders_detail_accept_btn',
                text: 'global.accept'
              }, {
                buttonType: 'basic',
                onClick: this.rejectOrder,
                dataTest: 'orders_detail_decline_btn',
                text: 'global.decline'
              }]
            ) : null}

            {action === '210' ? this.renderSegment(
              14,
              'order.assignLots.description',
              [{
                buttonType: 'primary',
                onClick: this.openAssignLots,
                dataTest: 'orders_detail_assign_lots_btn',
                text: 'order.assignLots'
              }]
            ) : null}

            {action === '211' ? this.renderSegment(
              12,
              'order.ship.description',
              [{
                buttonType: 'primary',
                onClick: this.openAssignLots,
                dataTest: 'orders_detail_assign_lots_btn',
                text: 'order.assignLots.re'
              }, {
                buttonType: 'primary',
                onClick: this.shipOrder,
                dataTest: 'orders_detail_ship_btn',
                text: 'order.ship'
              }]
            ) : null}
          </>
        ) : null}
      </>
    )
  }
}

function actionRequired(data) {
  // return merged status codes
  // orderStatus + shippingStatus + assignedLots
  const statusCode = getSafe(() => data.orderStatus.toString(), 0) +
                     getSafe(() => data.shippingStatus.toString(), 0) +
                     getSafe(() => data.orderItems.filter(orderItem => { return orderItem.amount === orderItem.lots.reduce(function(allocated, lot) { return allocated + lot.amount }, 0) }).length === data.orderItems.length ? 1 : 0, 0)
  return statusCode
}

function mapStateToProps(state, ownProps) {
  const {orders} = state

  return {
    action: actionRequired(orders.detail),
    order: ownProps.order,
    ordersType: ownProps.ordersType
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsRequired)