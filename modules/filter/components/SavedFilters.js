import { Component } from 'react'
import { func, array, bool, object, string } from 'prop-types'
import { Accordion, Segment, Grid, GridRow, GridColumn, Dimmer, Loader } from 'semantic-ui-react'
import { Form, Button } from 'formik-semantic-ui-fixed-validation'
import { withToastManager } from 'react-toast-notifications'

import {
  SavedFilterItem,
  SavedFilterTitle,
  SavedFiltersSegment,
  SavedFilterRow,
  SavedFilterIcon,
  DeleteFilterIcon,
  AccordionContent,
  ActionRow,
  BoldTextColumn,
  FlexContent,
  FilterAccordion,
  SavedFiltersGrid,
  SavedFilterDetailGrid,
  SavedFiltersNotifications
} from '../constants/layout'

import styled from 'styled-components'

import Notifications from './Notifications'
import { FormattedMessage, injectIntl } from 'react-intl'
import { savedFilterValidation } from '../constants/validation'
import { groupFilters } from '../constants/filter'
import Tooltip from '~/components/tooltip'
import ErrorFocus from '~/components/error-focus'
import { AlertTriangle } from 'react-feather'

const StyledDimmer = styled(Dimmer)`
  margin: 1rem 0;

  &.dimmer {
    background: none !important;
  }
`

const StyledGrid = styled(Grid)`
  word-break: break-word;
  > .row {
    padding: 0.5rem 0px 0.5rem 0px !important;
  }
`

export const NoSavedFilters = styled.div`
  margin: 2.307692308em 0;
  text-align: center;
  color: #848893;
  height: 100%;
`

const RedTriangle = styled(AlertTriangle)`
  display: block;
  width: 20px;
  height: 19px;
  margin: 0 auto;
  vertical-align: middle;
  font-size: 20px;
  color: #f16844;
  line-height: 20px;
`

class SavedFilters extends Component {
  state = {
    activeIndex: -1,
    activeTooltip: -1
  }
  componentDidMount() {
    this.props.getSavedFilters()
  }

  toggle = (id, name = 'activeIndex') => {
    const activeIndex = this.state[name]
    const newIndex = activeIndex === id ? -1 : id

    this.setState({ [name]: newIndex })
  }

  handleFilterApply = filter => {
    let { onApply } = this.props
    onApply(filter)
  }

  handleValuesDescription = f => {
    const result =
      f.valuesDescription instanceof Array
        ? f.valuesDescription.map(v => v)
        : typeof f.valuesDescription === 'string'
        ? f.valuesDescription.replace(/,/g, ', ')
        : f.tagDescription
    return result
  }

  getTitle = (filter, i) => {
    let { id, name, invalid } = filter
    let filterDescription = groupFilters(filter.filters, this.props.params, this.props.filterType)

    return (
      <SavedFilterTitle>
        <SavedFilterRow>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Tooltip
              trigger={
                <div
                  onClick={() => this.handleFilterApply(filter)}
                  data-test={`filter_activateFilter_${i}`}
                  style={{ color: '#20273a', fontWeight: '600' }}>
                  {name}
                </div>
              }
              position='top center'>
              <FormattedMessage id='filter.activateFilter' />
            </Tooltip>
            {invalid && (
              <Tooltip
                trigger={
                  <div>
                    <RedTriangle style={{ marginLeft: '7px' }} />
                  </div>
                } // <div> has to be there otherwise popup will be not shown
                position='top center'>
                <FormattedMessage id='filter.invalidFilter' />
              </Tooltip>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Tooltip
              trigger={
                <div onClick={() => this.toggle(id)} data-test={`filter_editNotifications_${i}`}>
                  <SavedFilterIcon
                    name='bell outline'
                    color={this.state.activeIndex === id ? 'yellow' : 'gray'}
                    size='mini'
                  />
                </div>
              }
              position='left center'>
              <FormattedMessage id='filter.editNotifications' />
            </Tooltip>
            <Tooltip
              trigger={
                <div onClick={() => this.toggle(i, 'activeTooltip')} data-test={`filter_activeTooltip_${i}`}>
                  <SavedFilterIcon
                    color={this.state.activeTooltip === i ? 'blue' : 'gray'}
                    name='info circle outline'
                    size='mini'
                  />
                </div>
              }
              position='left center'>
              <div>
                <StyledGrid verticalAlign='top'>
                  {filterDescription && filterDescription.length > 0 ? (
                    filterDescription.map((f, index) => {
                      return (
                        <GridRow key={index}>
                          <GridColumn computer={8}>{f.description}:</GridColumn>
                          <GridColumn computer={8}>{this.handleValuesDescription(f)}</GridColumn>
                        </GridRow>
                      )
                    })
                  ) : (
                    <GridRow>
                      <GridColumn>
                        {' '}
                        <FormattedMessage id='filter.noFitlersApplied' defaultMessage='No filters applied' />{' '}
                      </GridColumn>
                    </GridRow>
                  )}
                </StyledGrid>
              </div>
            </Tooltip>
            <Tooltip
              trigger={
                <div onClick={() => this.props.deleteFilter(id)} data-test={`filter_deleteFilter_${i}`}>
                  <DeleteFilterIcon name='trash alternate outline' size='mini' />
                </div>
              }
              position='left center'>
              <FormattedMessage id='filter.deleteFilter' />
            </Tooltip>
          </div>
        </SavedFilterRow>
      </SavedFilterTitle>
    )
  }

  render() {
    const {
      intl: { formatMessage },
      savedFilters
    } = this.props

    if (this.props.savedFiltersLoading) {
      return (
        <Segment basic style={{ margin: '-28px 0 30px 0' }}>
          <StyledDimmer active inverted>
            <Loader active />
          </StyledDimmer>
        </Segment>
      )
    }

    return (
      <FilterAccordion >
        {savedFilters.length ? (
          savedFilters.map((filter, i) => {
            let {
              notificationEnabled,
              notifyMail,
              notifyPhone,
              notifySystem,
              notificationMail,
              notificationPhone
            } = filter
            let initialValues = {
              checkboxes: {
                notificationEnabled,
                notifyMail,
                notifyPhone,
                notifySystem
              },
              notifications: {
                notificationMail,
                notificationPhone
              }
            }

            return (
              <SavedFilterItem key={filter.id}>
                {this.getTitle(filter, i)}

                <AccordionContent key={i} active={this.state.activeIndex === filter.id}>
                  {this.state.activeIndex === filter.id && (
                    <Form
                      enableReinitialize={true}
                      validationSchema={savedFilterValidation}
                      initialValues={initialValues}
                      validateOnChange={false}
                      validateOnBlur={false}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          let { notificationMail, notificationPhone } = values.notifications

                          let body = {
                            name: filter.name,
                            ...values.checkboxes,
                            ...(notificationMail === undefined || notificationMail === ''
                              ? null
                              : { notificationMail }),
                            ...(notificationPhone === undefined || notificationPhone === ''
                              ? null
                              : { notificationPhone })
                          }

                          await this.props.updateFilterNotifications(this.state.activeIndex, body)
                          this.props.toastManager.add(
                            <div>
                              <strong>
                                <FormattedMessage id='confirm.filter.updated' values={{ name: filter.name }} />
                              </strong>
                            </div>,
                            { appearance: 'success', pauseOnHover: true }
                          )
                        } catch (err) {}
                        setSubmitting(false)
                      }}>
                      {formikProps => {
                        return (
                          <div style={{ padding: '0 10px' }}>
                            <SavedFilterDetailGrid style={{ backgroundColor: '#edeef2' }}>
                              <GridRow>
                                <GridColumn computer={8} floated='left'>
                                  <Notifications values={formikProps.values} formikProps={formikProps} />
                                </GridColumn>
                              </GridRow>
                              <GridRow>
                                <GridColumn computer={4} floated='left'>
                                  <Button onClick={formikProps.submitForm} secondary data-test='filter_save_btn'>
                                    {formatMessage({ id: 'global.save', defaultMessage: 'Save' })}
                                  </Button>
                                </GridColumn>
                              </GridRow>
                            </SavedFilterDetailGrid>
                          </div>
                        )
                      }}
                    </Form>
                  )}
                </AccordionContent>
              </SavedFilterItem>
            )
          })
        ) : (
          <SavedFilterItem>
            <AccordionContent>
              <NoSavedFilters>
                <FormattedMessage id='filter.noSavedFilters' defaultMessage='You don’t have saved filters' />
              </NoSavedFilters>
            </AccordionContent>
          </SavedFilterItem>
        )}
      </FilterAccordion>
    )
  }
}

SavedFilters.propTypes = {
  onApply: func,
  getSavedFilters: func,
  savedFilters: array,
  savedFiltersLoading: bool,
  deleteFilter: func,
  params: object,
  filterType: string
}

SavedFilters.defaultProps = {
  savedFilters: [],
  savedFiltersLoading: false,
  params: {},
  filterType: 'inventory'
}

export default injectIntl(withToastManager(SavedFilters))
