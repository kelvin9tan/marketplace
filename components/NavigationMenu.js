import React, { Component } from 'react'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'

import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { withAuth } from '~/hocs'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
// import Settings from '~/components/settings'
import { tabChanged, triggerSystemSettingsModal } from '~/modules/settings/actions'
import { getSafe } from '~/utils/functions'
import {
  Layers,
  Settings,
  ShoppingBag,
  Grid,
  Sliders,
  FileText,
  Bell,
  Briefcase,
  Home,
  Package,
  Archive,
  Disc,
  Coffee
} from 'react-feather'
import Tabs from '~/modules/admin/components/Tabs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import TabsOperations from '~/modules/operations/components/Tabs'
import TabsProducts from '~/modules/products/components/Tabs'
import TabsCompanies from '~/modules/companies/components/Tabs'

const DropdownItem = ({ children, refFunc, refId, ...props }) => {
  return (
    <Dropdown
      item
      icon='chevron down'
      ref={dropdownItem => {
        if (refFunc && refId !== false) refFunc(dropdownItem, refId)
      }}
      {...props}>
      {children}
    </Dropdown>
  )
}

class Navigation extends Component {
  state = {
    dropdowns: {},
    settings: getSafe(() => Router.router.pathname === '/settings', false),
    orders:
      getSafe(() => Router.router.pathname === '/orders', false) ||
      getSafe(() => Router.router.pathname === '/orders/detail', false),
    admin: getSafe(() => Router.router.pathname === '/admin', false),
    operations: getSafe(() => Router.router.pathname === '/operations', false),
    products: getSafe(() => Router.router.pathname === '/products', false),
    companies: getSafe(() => Router.router.pathname === '/companies', false),
    manageGuests: getSafe(() => Router.router.pathname === '/manage-guests', false),
    wantedBoard: getSafe(() => Router.router.pathname === '/wanted-board/listings', false) ||
      getSafe(() => Router.router.pathname === '/wanted-board/bids-sent', false) ||
      getSafe(() => Router.router.pathname === '/wanted-board/bids-received', false),
    inventory: getSafe(() => Router.router.pathname === '/inventory/my-products', false) ||
      getSafe(() => Router.router.pathname === '/inventory/my-listings', false),
    marketplace: getSafe(() => Router.router.pathname === '/marketplace/listings', false) ||
      getSafe(() => Router.router.pathname === '/marketplace/holds', false)
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkDropdowns.bind(this))
  }

  componentDidUpdate() {
    this.checkDropdowns()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkDropdowns)
  }

  settingsLink = (e, to, tab) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      router,
      router: { pathname, asPath },
      tabChanged,
      tabsNames,
      currentSettingsTab
    } = this.props
    /* // ! ! if (pathname === to) {
      switch (asPath) {
        case '/inventory/my':
          this.setState(prevState => ({ // ! !
            settings: false,
            orders: false
          }))
          break
        case '/marketplace/all':
          this.setState(prevState => ({
            settings: false,
            orders: false
          }))
          break
      }
    }*/

    if (pathname === '/settings' && tab) {
      const newTab = tabsNames.find(t => t.type === tab)
      tabChanged(newTab, currentSettingsTab)
      router.push('/settings?type=' + tab)
    } else {
      router.push(to)
    }
  }

  createRef = (dropdownItem, refId) => {
    const { dropdowns } = this.state
    if (getSafe(() => !dropdowns[refId], false)) {
      this.setState({
        dropdowns: {
          ...dropdowns,
          [refId]: dropdownItem
        }
      })
    }
  }

  getWindowDimensions = () => {
    const hasWindow = typeof window !== 'undefined'

    const width = hasWindow ? window.innerWidth : null
    const height = hasWindow ? window.innerHeight : null

    return {
      width,
      height
    }
  }

  toggleOpened = type => {
    const { dropdowns } = this.state
    const typeState = this.state[type]
    if (type === 'admin') {
      Router.push('/admin')
    }
    if (type === 'operations') {
      Router.push('/operations')
    }
    if (type === 'products') {
      Router.push('/products')
    }
    if (type === 'companies') {
      Router.push('/companies')
    }
    // toggle dropdown state
    this.setState({
      orders: false,
      settings: false,
      admin: false,
      operations: false,
      products: false,
      companies: false,
      manageGuests: false,
      wantedBoard: false,
      inventory: false,
      marketplace: false,
      [type]: !typeState
    })

    // resize dropdown
    this.resizeDropdown(type, typeState)
  }

  checkDropdowns = () => {
    const { dropdowns } = this.state
    const ddStatuses = Object.keys(dropdowns)

    for (var i = 0; i < ddStatuses.length; i++) {
      if (this.state[ddStatuses[i]]) {
        this.resizeDropdown(ddStatuses[i], false)
      }
    }
  }

  resizeDropdown = (type, typeState) => {
    const { dropdowns } = this.state
    const current = dropdowns[type].ref.current

    // Manipulate opened dropdown design - It affects only collapsed menu styles
    if (current) {
      // Sometimes null
      if (!typeState) {
        const wievport = this.getWindowDimensions()

        // Calculate free space around dropdown
        const topSpace = current.offsetTop - 80 // space for TopBar
        const bottomSpace = getSafe(() => wievport.height - (current.offsetTop + current.clientHeight + 1), 0)

        // Changing dropdown behavior as we know more about available space (top/bottom)
        if (topSpace > bottomSpace) {
          if (!current.classList.contains('upward')) {
            current.classList.add('upward')
          }
          current.lastChild.style.maxHeight = `${topSpace}px`
        } else {
          if (current.classList.contains('upward')) {
            current.classList.remove('upward')
          }
          current.lastChild.style.maxHeight = `${bottomSpace}px`
        }
      } else {
        // Reset styles
        current.lastChild.style.maxHeight = ''
      }

      this.props.navigationPS.current.updateScroll()
    }
  }

  render() {
    const {
      isAdmin,
      isEchoOperator,
      isOrderOperator,
      auth,
      takeover,
      intl: { formatMessage },
      router: { pathname, asPath },
      collapsedMenu,
      isClientCompanyAdmin,
      isClientCompanyManager
    } = this.props

    const {
      dropdowns,
      settings,
      orders,
      admin,
      operations,
      products,
      companies,
      manageGuests,
      inventory,
      marketplace,
      wantedBoard
    } = this.state

    const MenuLink = withRouter(({ router: { asPath }, to, children, tab, className, dataTest }) => {
      return (
        <Link prefetch href={to}>
          <Menu.Item
            as='a'
            data-test={dataTest}
            active={asPath === to}
            onClick={async e => await this.settingsLink(e, to, tab)}
            className={className}>
            {children}
          </Menu.Item>
        </Link>
      )
    })

    const { isCompanyAdmin, isUserAdmin, isProductCatalogAdmin, company } = getSafe(() => auth.identity, {
      isCompanyAdmin: null,
      isUserAdmin: null,
      isProductCatalogAdmin: null,
      company: null
    })

    const { isClientCompany } = getSafe(() => company, { isClientCompany: false })
    return (!isAdmin && !isEchoOperator && !isOrderOperator) || takeover ? (
      <div className='flex-wrapper'>
        <MenuLink to='/dashboard' dataTest='navigation_menu_admin_dashboard'>
          <>
            <Home size={22} />
            {formatMessage({ id: 'navigation.dashboard', defaultMessage: 'Dashboard' })}
          </>
        </MenuLink>
        {!isClientCompany && (
          <DropdownItem
            icon={<Layers size={22} />}
            text={formatMessage({ id: 'navigation.inventory', defaultMessage: 'Inventory' })}
            className={inventory ? 'opened' : null}
            opened={inventory}
            onClick={() => this.toggleOpened('inventory')}
            refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
            refId={'inventory'}
            data-test='navigation_menu_inventory_drpdn'
          >
            <Dropdown.Menu data-test='navigation_menu_inventory_menu'>
              <PerfectScrollbar>
                <Dropdown.Item
                  as={MenuLink}
                  to='/inventory/my-products'
                  dataTest='navigation_menu_inventory_my_products_drpdn'>
                  {formatMessage({ id: 'navigation.inventoryMyProducts', defaultMessage: 'My Products' })}
                </Dropdown.Item>
                <Dropdown.Item
                  as={MenuLink}
                  to='/inventory/my-listings'
                  dataTest='navigation_menu_inventory_my_listings_drpdn'>
                  {formatMessage({ id: 'navigation.inventoryMyListings', defaultMessage: 'My Listings' })}
                </Dropdown.Item>
              </PerfectScrollbar>
            </Dropdown.Menu>
          </DropdownItem>
        )}

        <DropdownItem
          icon={<ShoppingBag size={22} />}
          text={formatMessage({ id: 'navigation.marketplace', defaultMessage: 'Marketplace' })}
          className={marketplace ? 'opened' : null}
          opened={marketplace}
          onClick={() => this.toggleOpened('marketplace')}
          refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
          refId={'marketplace'}
          data-test='navigation_menu_marketplace_drpdn'
        >
          <Dropdown.Menu data-test='navigation_menu_marketplace_menu'>
            <PerfectScrollbar>
              <Dropdown.Item
                as={MenuLink}
                to='/marketplace/listings'
                dataTest='navigation_menu_marketplace_listings_drpdn'>
                {formatMessage({ id: 'navigation.marketplaceListings', defaultMessage: 'Listings' })}
              </Dropdown.Item>
              <Dropdown.Item
                as={MenuLink}
                to='/marketplace/holds'
                dataTest='navigation_menu_marketplace_holds_drpdn'>
                {formatMessage({ id: 'navigation.marketplaceHolds', defaultMessage: 'Holds' })}
              </Dropdown.Item>
            </PerfectScrollbar>
          </Dropdown.Menu>
        </DropdownItem>

        <DropdownItem
          icon={<Grid size={22} />}
          text={formatMessage({ id: 'navigation.wantedBoard', defaultMessage: 'Wanted Board' })}
          className={wantedBoard ? 'opened' : null}
          opened={wantedBoard}
          onClick={() => this.toggleOpened('wantedBoard')}
          refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
          refId={'wantedBoard'}
          data-test='navigation_menu_wanted_board_drpdn'
        >
          <Dropdown.Menu data-test='navigation_menu_manage_wanted_board_menu'>
            <PerfectScrollbar>
              {!isClientCompany && (
                <>
                  <Dropdown.Item
                    as={MenuLink}
                    to='/wanted-board/listings'
                    dataTest='navigation_wanted_board_listings_drpdn'>
                    {formatMessage({ id: 'navigation.wantedBoardListings', defaultMessage: 'Listings' })}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={MenuLink}
                    to='/wanted-board/bids-sent'
                    dataTest='navigation_wanted_board_bids_sent_drpdn'>
                    {formatMessage({ id: 'navigation.wantedBoardBidsSent', defaultMessage: 'Bids Sent' })}
                  </Dropdown.Item>
                </>
                )}
              <Dropdown.Item
                as={MenuLink}
                to='/wanted-board/bids-received'
                dataTest='navigation_wanted_board_bids_received_drpdn'>
                {formatMessage({ id: 'navigation.wantedBoardBidsReceived', defaultMessage: 'Bids Received' })}
              </Dropdown.Item>
            </PerfectScrollbar>
          </Dropdown.Menu>
        </DropdownItem>
        <DropdownItem
          icon={<FileText size={22} />}
          text={formatMessage({ id: 'navigation.orders', defaultMessage: 'Orders' })}
          className={orders ? 'opened' : null}
          opened={orders.toString()}
          onClick={() => this.toggleOpened('orders')}
          refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
          refId={'orders'}
          data-test='navigation_orders_drpdn'>
          <Dropdown.Menu data-test='navigation_menu_orders_drpdn_menu'>
            <PerfectScrollbar>
              {!isClientCompany && (
                <Dropdown.Item as={MenuLink} to='/orders?type=sales' dataTest='navigation_orders_sales_orders_drpdn'>
                  {formatMessage({ id: 'navigation.salesOrders', defaultMessage: 'Sales Orders' })}
                </Dropdown.Item>
              )}
              <Dropdown.Item
                as={MenuLink}
                to='/orders?type=purchase'
                dataTest='navigation_orders_purchase_orders_drpdn'>
                {formatMessage({ id: 'navigation.purchaseOrders', defaultMessage: 'Purchase Orders' })}
              </Dropdown.Item>
            </PerfectScrollbar>
          </Dropdown.Menu>
        </DropdownItem>

        {isCompanyAdmin || isClientCompanyManager ? (
          <DropdownItem
            icon={<Coffee size={22} />}
            text={formatMessage({ id: 'navigation.manageGuests', defaultMessage: 'Manage Guests' })}
            className={manageGuests ? 'opened' : null}
            opened={manageGuests.toString()}
            onClick={() => this.toggleOpened('manageGuests')}
            refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
            refId={'manageGuests'}
            data-test='navigation_menu_manage_guests_drpdn'>
            <Dropdown.Menu data-test='navigation_menu_manage_guests_drpdn_menu'>
              <PerfectScrollbar>
                <Dropdown.Item
                  as={MenuLink}
                  to='/manage-guests?type=guests'
                  dataTest='navigation_manage_guests_guests_drpdn'>
                  {formatMessage({ id: 'navigation.guests', defaultMessage: 'Guests' })}
                </Dropdown.Item>
                {false && (
                  <Dropdown.Item
                    as={MenuLink}
                    to='/manage-guests?type=chat'
                    dataTest='navigation_manage_guests_chat_drpdn'>
                    {formatMessage({ id: 'navigation.chat', defaultMessage: 'Chat' })}
                  </Dropdown.Item>
                )}
              </PerfectScrollbar>
            </Dropdown.Menu>
          </DropdownItem>
        ) : null}

        {(isCompanyAdmin || isUserAdmin || isProductCatalogAdmin || isClientCompanyAdmin) && (
          <DropdownItem
            icon={<Settings size={22} />}
            text={formatMessage({ id: 'navigation.myAccount', defaultMessage: 'My Account' })}
            className={settings ? 'opened' : null}
            opened={settings.toString()}
            onClick={() => this.toggleOpened('settings')}
            refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
            refId={'settings'}
            data-test='navigation_menu_settings_drpdn'>
            <Dropdown.Menu data-test='navigation_menu_settings_drpdn_menu'>
              <PerfectScrollbar>
                {isCompanyAdmin || isClientCompanyAdmin ? (
                  <>
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=company-details'
                      tab='company-details'
                      dataTest='navigation_settings_company_details_drpdn'>
                      {formatMessage({ id: 'navigation.companySettings', defaultMessage: 'Company Details' })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=system-settings'
                      tab='system-settings'
                      dataTest='navigation_settings_system_settings_drpdn'>
                      {formatMessage({ id: 'navigation.companySettings', defaultMessage: 'Company Settings' })}
                    </Dropdown.Item>
                  </>
                ) : null}
                {isCompanyAdmin || isUserAdmin || isClientCompanyAdmin ? (
                  <Dropdown.Item
                    as={MenuLink}
                    to='/settings?type=users'
                    tab='users'
                    dataTest='navigation_settings_users_drpdn'>
                    {formatMessage({ id: 'navigation.users', defaultMessage: 'Users' })}
                  </Dropdown.Item>
                ) : null}
                {isCompanyAdmin || isClientCompanyAdmin ? (
                  <>
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=locations'
                      tab='locations'
                      dataTest='navigation_settings_locations_drpdn'>
                      {formatMessage({ id: 'navigation.locations', defaultMessage: 'Locations' })}
                    </Dropdown.Item>
                  </>
                ) : null}
                {(isCompanyAdmin || isProductCatalogAdmin) && !isClientCompany ? (
                  <Dropdown.Item
                    as={MenuLink}
                    to='/settings?type=products'
                    tab='products'
                    dataTest='navigation_settings_products_drpdn'>
                    {formatMessage({ id: 'navigation.productCatalog', defaultMessage: 'Product Catalog' })}
                  </Dropdown.Item>
                ) : null}
                {(isCompanyAdmin && !isClientCompany) || isClientCompanyAdmin ? (
                  <>
                    {!isClientCompanyAdmin && (
                      <Dropdown.Item
                        as={MenuLink}
                        to='/settings?type=global-broadcast'
                        tab='global-broadcast'
                        dataTest='navigation_settings_global_broadcast_drpdn'>
                        {formatMessage({ id: 'navigation.globalPriceBook', defaultMessage: 'Global Price Book' })}
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=bank-accounts'
                      tab='bank-accounts'
                      dataTest='navigation_settings_bank_accounts_drpdn'>
                      {formatMessage({ id: 'navigation.bankAccounts', defaultMessage: 'Bank Accounts' })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=logistics'
                      tab='logistics'
                      dataTest='navigation_settings_logistics_drpdn'>
                      {formatMessage({ id: 'navigation.logistics', defaultMessage: 'Logistics' })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={MenuLink}
                      to='/settings?type=documents'
                      tab='documents'
                      dataTest='navigation_settings_documents_drpdn'>
                      {formatMessage({ id: 'navigation.documents', defaultMessage: 'Documents' })}
                    </Dropdown.Item>
                  </>
                ) : null}
              </PerfectScrollbar>
            </Dropdown.Menu>
          </DropdownItem>
        )}
        <MenuLink to='/alerts' dataTest='navigation_menu_alerts_menulink'>
          <>
            <Bell size={22} />
            {formatMessage({ id: 'navigation.alerts', defaultMessage: 'Notifications' })}
          </>
        </MenuLink>
      </div>
    ) : (
      <div className='flex-wrapper'>
        {isAdmin && (
          <>
            <MenuLink to='/dashboard' dataTest='navigation_menu_admin_dashboard'>
              <>
                <Home size={22} />
                {formatMessage({ id: 'navigation.dashboard', defaultMessage: 'Dashboard' })}
              </>
            </MenuLink>
            <DropdownItem
              icon={<Briefcase size={22} />}
              text={formatMessage({ id: 'navigation.companies', defaultMessage: 'Companies' })}
              className={companies ? 'opened' : null}
              opened={companies.toString()}
              onClick={() => this.toggleOpened('companies')}
              refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
              refId={'companies'}>
              <TabsCompanies />
            </DropdownItem>
            <DropdownItem
              icon={<Package size={22} />}
              text={formatMessage({ id: 'navigation.products', defaultMessage: 'Products' })}
              className={products ? 'opened' : null}
              opened={products.toString()}
              onClick={() => this.toggleOpened('products')}
              refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
              refId={'products'}>
              <TabsProducts />
            </DropdownItem>
            <MenuLink to='/document-types' dataTest='navigation_menu_admin_document-types'>
              <>
                <FileText size={22} />
                {formatMessage({ id: 'navigation.documentTypes', defaultMessage: 'Document Types' })}
              </>
            </MenuLink>
            <MenuLink to='/market-segments' dataTest='navigation_menu_admin_market_segments'>
              <>
                <Disc size={22} />
                {formatMessage({ id: 'navigation.marketSegments', defaultMessage: 'Market Segments' })}
              </>
            </MenuLink>

            <DropdownItem
              icon={<Settings size={22} />}
              text={formatMessage({ id: 'navigation.adminSettings', defaultMessage: 'Admin Settings' })}
              className={admin ? 'opened' : null}
              opened={admin.toString()}
              onClick={() => this.toggleOpened('admin')}
              refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
              refId={'admin'}>
              <Tabs />
            </DropdownItem>
          </>
        )}
        {(isAdmin || isEchoOperator || isOrderOperator) && (
          <>
            <DropdownItem
              icon={<Archive size={22} />}
              text={formatMessage({ id: 'navigation.operations', defaultMessage: 'Operations' })}
              className={operations ? 'opened' : null}
              opened={operations.toString()}
              onClick={() => this.toggleOpened('operations')}
              refFunc={(dropdownItem, refId) => this.createRef(dropdownItem, refId)}
              refId={'operations'}>
              <TabsOperations />
            </DropdownItem>
          </>
        )}
        <MenuLink to='/alerts' dataTest='navigation_menu_admin_alerts'>
          <>
            <Bell size={22} />
            {formatMessage({ id: 'navigation.alerts', defaultMessage: 'Notifications' })}
          </>
        </MenuLink>
      </div>
    )
  }
}
export default withAuth(
  withRouter(
    connect(
      (store, { navigationPS }) => ({
        navigationPS: navigationPS,
        auth: store.auth,
        tabsNames: store.settings.tabsNames,
        currentSettingsTab: store.settings.currentTab,
        isAdmin: getSafe(() => store.auth.identity.isAdmin, false),
        isOrderOperator: getSafe(() => store.auth.identity.isOrderOperator, false),
        isClientCompanyAdmin: getSafe(() => store.auth.identity.isClientCompanyAdmin, false),
        isClientCompanyManager: getSafe(() => store.auth.identity.isClientCompanyManager, false),
        collapsedMenu: store.layout.collapsedMenu,
        isEchoOperator: getSafe(() => store.auth.identity.roles, []).some(role => role.name === 'Echo Operator')
      }),
      {
        triggerSystemSettingsModal,
        tabChanged
      }
    )(injectIntl(Navigation))
  )
)

// export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddNewPopupCasProducts))
