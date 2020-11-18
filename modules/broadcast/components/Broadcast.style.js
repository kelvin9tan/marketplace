import { Grid, GridRow, Form, Dropdown, Input, Button } from 'semantic-ui-react'
import styled from 'styled-components'

const COLORS = {
  root: '#edeef2',
  region: 'rgba(240, 240, 240, 0)',
  state: 'rgba(240, 240, 240, 0)',
  company: 'rgba(240, 240, 240, 0)'
}

const FONT_WEIGHT = {
  root: 'bold',
  region: 'bold',
  state: 'normal',
  company: 'normal'
}

const Row = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  line-height: 45px;
  border-bottom: 1px solid #e7e7e7;

  background-color: ${({ type }) => COLORS[type]};
  font-weight: ${({ type }) => FONT_WEIGHT[type]};
  cursor: pointer;
  color: #20273a;

  &:hover {
    background-color: #eee;
  }

  > div {
  }
  > div:first-child {
    border-left: none;
  }
`

const Root = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin: 1.428571429em 0.714285714em;

  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
  border: solid 1px #dee2e6;
  background-color: #ffffff;
`
const Header = styled(Row)`
  /* font-weight: bold; */
  flex: 0 0 auto;
  padding: 0;
  display: flex;
  color: #848893;
  font-weight: bold;

  > div {
  }
  > div:nth-child(2) {
    border-left: none;
    padding-left: 10px;
  }
  > div:last-child {
    padding-right: 10px;
  }
`
const Content = styled.div`
  display: flex;
  flex: 1 0 300px;
  flex-direction: column;
  overflow-y: none;
`

const RowContent = styled.div`
  flex: 1 1 auto;
  display: flex;
  padding: 9px 0 10px 0;
  line-height: 1.43;
  align-items: center;
  > *:first-child {
    flex: 0 0 1.18em;
  }
  .icon.chevron {
    color: #2599d5;
  }
  padding-left: ${({ depth }) => depth * 15 - 15}px;
`

const Toggle = styled.div`
  flex: 0 0 138px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  color: #20273a;
  font-weight: 500;
`
const Checkbox = styled.div`
  flex: 0 0 138px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BottomUnpaddedRow = styled(GridRow)`
  padding-bottom: 0px !important;
  .column {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    color: #404040 !important;
  }
`

const RightAlignedDiv = styled.div`
  text-align: right;
  margin-top: 20px;
`

const StretchedGrid = styled(Grid)`
  height: 90% !important;

  .ui.info.message {
    border: solid 1px #2599d5;
    background-color: #ffffff;
    color: #848893;
    box-shadow: none;
    i.info.circle.icon {
      color: #2599d5;
    }
    strong {
      font-weight: bold;
      color: #20273a;
    }
  }

  .ui.divider {
    margin: 1.357142857em 0 1.071428571em 0;
  }

  .upper-grid .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .column {
      padding-top: 0;
      padding-bottom: 0;
    }

    .ui.button {
      height: 40px;
      border-radius: 3px;
      border: solid 1px #f16844;
    }

    .ui.button.negative {
      color: #f16844;
      background-color: #fff0ed;
    }

    .ui.button.positive {
      border: solid 1px #84c225;
      background-color: #e5efd8;
      color: #84c225;
    }
  }
`

const GridRowSearch = styled(GridRow)`
  padding: 0 !important;
`

const FieldInHeaderTable = styled(Form.Field)`
  margin-right: 5px !important;
  max-width: 250px !important;
`

const DropdownInHeaderTable = styled(Dropdown)`
  background: #fdfdfd !important;
  min-width: 150px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #20273a !important;
`

const InputSearch = styled(Input)`
  input {
    background: #fdfdfd !important;
    border: solid 1px #dee2e6 !important;
  }
`

const GridRowTable = styled(Grid.Row)`
  padding-top: 7px !important;
`

const ButtonSave = styled(Button)`
  background-color: #2599d5 !important;
  color: #ffffff !important;
  margin-left: 8px !important;
`

export const Rule = {
  Row,
  RowContent,
  Root,
  Content,
  Header,
  Checkbox,
  Toggle
}

export {
  BottomUnpaddedRow,
  RightAlignedDiv,
  StretchedGrid,
  GridRowSearch,
  FieldInHeaderTable,
  DropdownInHeaderTable,
  InputSearch,
  GridRowTable,
  ButtonSave
}
