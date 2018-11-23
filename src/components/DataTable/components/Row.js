import React, { Component } from 'react';
import CheckboxControlled from '../../Checkbox/CheckboxControlled';
import ThreeDots from '../../ThreeDots/ThreeDots';
import classnames from 'classnames';
import ThreeDotsMenu from '../../ThreeDots/ThreeDotsMenu';
import AddCart from '../../../pages/cart/components/AddCart';

class Row extends Component {

  static openedPopup = {
    id: false
  }

  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = { openContext: false, openRowComponent: false };
    this.row = React.createRef();
  }

  handleClickOutside(event) {
    if (this.row.current && this.row.current.contains(event.target)) return;
    this.setState({ openContext: false });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClick(e) {
    e.preventDefault();
    if (!this.state.openContext) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }
    this.setState({ openContext: !this.state.openContext });
  }

  addCart(id){
    // check that new popup has different id than previous
    if (Row.openedPopup.id !== id) {
      // previous popup has different id - remove it
      if (Row.openedPopup.id) {
        Row.openedPopup.id = false;
        this.props.removePopup();
      }

      // create new popup
      Row.openedPopup.id = id;
      this.props.addPopup(<AddCart id={id} history={this.props.history} className='add-cart-popup'/>);
    }
  }

  render() {
    const {tableType} = this.props
    const isAllInventory = tableType ==="allInventoryTable"
    return (
      <React.Fragment>
        <tr className={isAllInventory ? "isAllInventory" : ""} onClick={isAllInventory ? () => this.addCart(this.props.id) : () => {}}>
          {this.props.selectable ? (
            <td className="data-table-select">
              <CheckboxControlled
                value={this.props.rowOpns.selected}
                onChange={value =>
                  this.props.selectFunc(
                    this.props.groupId,
                    this.props.rowOpns.index,
                    value
                  )
                }
              />
            </td>
          ) : null}
          {this.props.contextMenu ? (
            <React.Fragment>
              <td
                className="data-table-context-td"
                ref={this.row}
                onClick={e => this.handleClick(e)}
              >
                <ThreeDots
                  className={
                    'small' + classnames({ ' active': this.state.openContext })
                  }
                />
              </td>
              <td className="data-table-context-holder">
                <ThreeDotsMenu
                  callback={() =>
                    this.setState({
                      openRowComponent: !this.state.openRowComponent
                    })
                  }
                  id={this.props.rowOpns.id}
                  links={this.props.contextMenu}
                  isOpen={this.state.openContext}
                />
              </td>
            </React.Fragment>
          ) : null}
          {this.props.data.map((cell, index) => {
            const cellShortName =
              typeof cell === 'string' ? cell.slice(0, 14) : cell;

            const cellName =
              typeof cell === 'string'
                ? `${cellShortName}${
                    cellShortName.length < cell.length ? '...' : ''
                  }`
                : cell;

            if (!this.props.headers[index].visible) return null;

            return (
              <td
                key={index}
                title={cellName && cellName.length > 14 ? cell : ''}
              >
                {cellName}
              </td>
            );
          })}
        </tr>
        {this.props.rowComponent && this.state.openRowComponent ? (
          <tr>
            <td colSpan={this.props.data.length + 3}>
              {React.cloneElement(this.props.rowComponent, {
                visible: this.state.openRowComponent,
                id: this.props.rowOpns.id,
                closeRowComponent: () =>
                  this.setState({ openRowComponent: false })
              })}
            </td>
          </tr>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Row;
