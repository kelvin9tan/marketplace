import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, track, actions } from "react-redux-form";
import BroadcastField from "./BroadcastField";
import StateBroadcastField from "./StateBroadcastField";
import RegionBroadcastField from "./RegionBroadcastField";
import RootBroadcastField from "./RootBroadcastField";
import {RegionsSearchBox, StatesSearchBox, CompaniesSearchBox, DefaultSearchBox} from "./BroadcastSearchBoxes";
import Dropdown from "../../../../../components/Dropdown/Dropdown";
import PopupComponent from "../../../../../components/PopUp/PopupComponent";
import Button from "../../../../../components/Button/Button";
import Spinner from '../../../../../components/Spinner/Spinner'
import InputControlled from '../../../../../components/InputControlled/InputControlled'
import "./AddBroadcast.css";

class AddBroadcast extends Component {
  state = {
    isClientList: true,
    categoryFilter: "allcompanies",
    regionsExpanded: [],
    statesExpanded: [],
    companiesExpanded: [],
    clickedModel: "",
    clickedModelId: false,
    filterInput: "",
    filteredRegions: [],
    filteredStates: [], 
    filteredCompanies: [], 
    filteredOffices: []
  };

  componentDidMount() {
    const {dispatch} = this.props
    this.props.fetchRegions()


    new Promise((resolve) => {
      this.props.fetchBroadcast(resolve)
    }).then(() => {
      const root = this.props.broadcastData.root
      if(root.anonymous === 1 || root.anonymous === 2) dispatch(actions.change(`forms.brcRules.root[${root.id}].anonymous`, true))
      if(root.anonymous === 0) dispatch(actions.change(`forms.brcRules.root[${root.id}].anonymous`, false))
      if(root.anonymous === 2) {
        dispatch(actions.change(`forms.brcRules.root[${root.id}].anonymousPartly`, true))
      } else dispatch(actions.change(`forms.brcRules.root[${root.id}].anonymousPartly`, false))
      
      if(root.broadcast === 1 || root.broadcast === 2) dispatch(actions.change(`forms.brcRules.root[${root.id}].broadcast`, true))
      if(root.broadcast === 0) dispatch(actions.change(`forms.brcRules.root[${root.id}].broadcast`, false))
      if(root.broadcast === 2) {
        dispatch(actions.change(`forms.brcRules.root[${root.id}].broadcastPartly`, true))
      } else dispatch(actions.change(`forms.brcRules.root[${root.id}].broadcastPartly`, false))


      if(root.priceAddition) {
        dispatch(actions.change(`forms.brcRules.root[${root.id}].priceValue`, root.priceAddition.toString()))
        dispatch(actions.change(`forms.brcRules.root[${root.id}].priceUnit`, "$"))
      }
      if(root.priceMultiplier) {
        dispatch(actions.change(`forms.brcRules.root[${root.id}].priceValue`, root.priceMultiplier.toString()))
        dispatch(actions.change(`forms.brcRules.root[${root.id}].priceUnit`, "$"))
      }

      const regions = root.regions
      regions.forEach(region => {
        if(region.anonymous === 1 || region.anonymous === 2) dispatch(actions.change(`forms.brcRules.region[${region.id}].anonymous`, true))
        if(region.anonymous === 0) dispatch(actions.change(`forms.brcRules.region[${region.id}].anonymous`, false))
        if(root.anonymous === 2) {
          dispatch(actions.change(`forms.brcRules.region[${region.id}].anonymousPartly`, true))
        } else dispatch(actions.change(`forms.brcRules.region[${region.id}].anonymousPartly`, false))

        if(region.broadcast === 1 || region.broadcast === 2) dispatch(actions.change(`forms.brcRules.region[${region.id}].broadcast`, true))
        if(region.broadcast === 0) dispatch(actions.change(`forms.brcRules.region[${region.id}].broadcast`, false))
        if(root.broadcast === 2) {
          dispatch(actions.change(`forms.brcRules.region[${region.id}].broadcastPartly`, true))
        } else dispatch(actions.change(`forms.brcRules.region[${region.id}].broadcastPartly`, false))

        if(region.priceAddition) {
          dispatch(actions.change(`forms.brcRules.region[${region.id}].priceValue`, region.priceAddition.toString()))
          dispatch(actions.change(`forms.brcRules.region[${region.id}].priceUnit`, "$"))
        }
        if(region.priceMultiplier) {
          dispatch(actions.change(`forms.brcRules.region[${region.id}].priceValue`, region.priceMultiplier.toString()))
          dispatch(actions.change(`forms.brcRules.region[${region.id}].priceUnit`, "$"))
        }
      })

      const states = regions.map(i => {
        const statesWithId = i.states.map(j => {
          j.regionId = i.id;
          return j;
        })
        return statesWithId;
      })
      
      const flattenStates = states.flat()
      flattenStates.forEach(state => {
        if(state.anonymous === 1 || state.anonymous === 2) dispatch(actions.change(`forms.brcRules.state[${state.id}].anonymous`, true))
        if(state.anonymous === 0) dispatch(actions.change(`forms.brcRules.state[${state.id}].anonymous`, false))
        if(root.anonymous === 2) {
          dispatch(actions.change(`forms.brcRules.state[${state.id}].anonymousPartly`, true))
        } else dispatch(actions.change(`forms.brcRules.state[${state.id}].anonymousPartly`, false))

        if(state.broadcast === 1 || state.broadcast === 2) dispatch(actions.change(`forms.brcRules.state[${state.id}].broadcast`, true))
        if(state.broadcast === 0) dispatch(actions.change(`forms.brcRules.state[${state.id}].broadcast`, false))
        if(root.broadcast === 2) {
          dispatch(actions.change(`forms.brcRules.state[${state.id}].broadcastPartly`, true))
        } else dispatch(actions.change(`forms.brcRules.state[${state.id}].broadcastPartly`, false))

        if(state.priceAddition) {
          dispatch(actions.change(`forms.brcRules.state[${state.id}].priceValue`, state.priceAddition.toString()))
          dispatch(actions.change(`forms.brcRules.state[${state.id}].priceUnit`, "$"))
        }
        if(state.priceMultiplier) {
          dispatch(actions.change(`forms.brcRules.state[${state.id}].priceValue`, state.priceMultiplier.toString()))
          dispatch(actions.change(`forms.brcRules.state[${state.id}].priceUnit`, "$"))
        }
     })

     const companies = flattenStates.map(i => {
        const companiesWithId = i.companies.map(j => {
          j.stateId = i.id;
          j.regionId = i.regionId;
          return j;
        })
        return companiesWithId;
      })
    
     const flattenCompanies = companies.flat()
     flattenCompanies.forEach(company => {
       if(company.anonymous === 1 || company.anonymous === 2) dispatch(actions.change(`forms.brcRules.company[${company.id}].anonymous`, true))
       if(company.anonymous === 0) dispatch(actions.change(`forms.brcRules.company[${company.id}].anonymous`, false))
       if(root.anonymous === 2) {
         dispatch(actions.change(`forms.brcRules.company[${company.id}].anonymousPartly`, true))
       } else dispatch(actions.change(`forms.brcRules.company[${company.id}].anonymousPartly`, false))

       if(company.broadcast === 1 || company.broadcast === 2) dispatch(actions.change(`forms.brcRules.company[${company.id}].broadcast`, true))
       if(company.broadcast === 0) dispatch(actions.change(`forms.brcRules.company[${company.id}].broadcast`, false))
       if(root.broadcast === 2) {
         dispatch(actions.change(`forms.brcRules.company[${company.id}].broadcastPartly`, true))
       } else {dispatch(actions.change(`forms.brcRules.company[${company.id}].broadcastPartly`, false))}

       if(company.priceAddition) {
         dispatch(actions.change(`forms.brcRules.company[${company.id}].priceValue`, company.priceAddition.toString()))
         dispatch(actions.change(`forms.brcRules.company[${company.id}].priceUnit`, "$"))
       }
       if(company.priceMultiplier) {
         dispatch(actions.change(`forms.brcRules.company[${company.id}].priceValue`, company.priceMultiplier.toString()))
         dispatch(actions.change(`forms.brcRules.company[${company.id}].priceUnit`, "$"))
       }
      })

      const offices = flattenCompanies.map(i => {
        const officesWithId = i.offices.map(j => {
          j.companyId = i.id;
          j.stateId = i.stateId;
          j.regionId = i.regionId;
          return j;
        })
        return officesWithId;
      })
      const flattenOffices = offices.flat()
      flattenOffices.forEach(office => {
        if(office.anonymous === 1 || office.anonymous === 2) dispatch(actions.change(`forms.brcRules.office[${office.id}].anonymous`, true))
        if(office.anonymous === 0) dispatch(actions.change(`forms.brcRules.office[${office.id}].anonymous`, false))
        if(root.anonymous === 2) {
          dispatch(actions.change(`forms.brcRules.office[${office.id}].anonymousPartly`, true))
        } else {dispatch(actions.change(`forms.brcRules.office[${office.id}].anonymousPartly`, false))}
        if(office.broadcast === 1 || office.broadcast === 2) dispatch(actions.change(`forms.brcRules.office[${office.id}].broadcast`, true))
        if(office.broadcast === 0) dispatch(actions.change(`forms.brcRules.office[${office.id}].broadcast`, false))
        if(root.broadcast === 2) {
          dispatch(actions.change(`forms.brcRules.office[${office.id}].broadcastPartly`, true))
        } else dispatch(actions.change(`forms.brcRules.office[${office.id}].broadcastPartly`, false))
        if(office.priceAddition) {
          dispatch(actions.change(`forms.brcRules.office[${office.id}].priceValue`, office.priceAddition.toString()))
          dispatch(actions.change(`forms.brcRules.office[${office.id}].priceUnit`, "$"))
        }
        if(office.priceMultiplier) {
          dispatch(actions.change(`forms.brcRules.office[${office.id}].priceValue`, office.priceMultiplier.toString()))
          dispatch(actions.change(`forms.brcRules.office[${office.id}].priceUnit`, "$"))
        }
    })
    })
  }

  onChangeHandler = (e) =>{
   this.setState({filterInput: e.target.value}, () => {
      const {filterInput} = this.state;
      const regions = this.props.broadcastData.root.regions
      const states = regions.map(i => i.states)
      const flattenStates = states.flat()
      const companies = flattenStates.map(state => state.companies)
      const flattenCompanies = companies.flat()
      const offices = flattenStates.map(state => state.companies.map(company => company.offices))
      const flattenOffices = offices.flat(2)
      const filteredRegions = regions.filter(i => i.name.toLowerCase().startsWith(filterInput.toLowerCase()))
      const filteredStates = flattenStates.filter(i => i.name.toLowerCase().startsWith(filterInput.toLowerCase()))
      const filteredCompanies = flattenCompanies.filter(i => i.name.toLowerCase().startsWith(filterInput.toLowerCase()))
      const filteredOffices = flattenOffices.filter(i => i.name.toLowerCase().startsWith(filterInput.toLowerCase()))
      this.setState({
        filteredRegions,filteredStates, filteredCompanies, filteredOffices
      })
   });
  }

  handleExpanded = (e) => {
    const { regionsExpanded, statesExpanded, companiesExpanded } = this.state;
    const typeOfClickedItem = e.target.getAttribute('name');
    const idOfClickedItem = parseInt(e.target.id, 10);

    if (typeOfClickedItem === "office") return;
    if (typeOfClickedItem === "region") {
      const isExpanded = regionsExpanded.includes(idOfClickedItem)
      if (isExpanded) {
        const newRegionsExpanded = [ ...regionsExpanded ]
        const filtered = newRegionsExpanded.filter(i => i !== idOfClickedItem)
        this.setState({regionsExpanded: filtered})
      } else this.setState({regionsExpanded: [ ...regionsExpanded, idOfClickedItem ]})
    }
    if (typeOfClickedItem === "state") {
      const isExpanded = statesExpanded.includes(idOfClickedItem)
      if (isExpanded) {
        const newRegionsExpanded = [ ...statesExpanded ]
        const filtered = newRegionsExpanded.filter(i => i !== idOfClickedItem)
        this.setState({statesExpanded: filtered})
      } else this.setState({statesExpanded: [ ...statesExpanded, idOfClickedItem ]})
    }
    if (typeOfClickedItem === "company") {
      const isExpanded = companiesExpanded.includes(idOfClickedItem)
      if (isExpanded) {
        const newRegionsExpanded = [ ...companiesExpanded ]
        const filtered = newRegionsExpanded.filter(i => i !== idOfClickedItem)
        this.setState({companiesExpanded: filtered})
      } else this.setState({companiesExpanded: [ ...companiesExpanded, idOfClickedItem ]})
    }
  }
  
  handleRuleClick = (e) => {
    this.setState({clickedModel: e.target.getAttribute('name')})
    this.setState({clickedModelId: parseInt(e.target.id, 10)})
  }

  //transform storedStates/storedCompanies/storedRegions from object of objects to array of objects (the former object key is now id property)
  convertObjectToArray = (storedObject) => {
    if (!storedObject) return;
    const storedValues = Object.values(storedObject) 
    const storedKeys = Object.keys(storedObject)
    const newArray = storedValues.map((item, index) => ({...item, id: parseInt(storedKeys[index], 10)}))
    return newArray;
  }
  componentDidUpdate() {
    const {
      dispatch, storedRoot, broadcastData, 
      storedRegions, storedStates, storedCompanies, storedOffices
    } = this.props;
    const {clickedModel, clickedModelId} = this.state;
    if (!broadcastData) return;
    const broadcastRoot = this.convertObjectToArray(storedRoot)
    const broadcastRegions = this.convertObjectToArray(storedRegions)
    const broadcastStates = this.convertObjectToArray(storedStates)
    const broadcastCompanies = this.convertObjectToArray(storedCompanies)
    const broadcastOffices = this.convertObjectToArray(storedOffices)

    const regions = broadcastData.root.regions
    const states = regions.map(i => i.states)
    const flattenStates = states.flat()
    const companies = flattenStates.map(state => state.companies)
    const flattenCompanies = companies.flat()
    const offices = flattenStates.map(state => state.companies.map(company => company.offices))
    const flattenOffices = offices.flat(2)
    const rules = ["anonymous", "broadcast"]
    const units = ["$", "%"]
    const root = broadcastRoot && broadcastRoot[0]


    if (clickedModel.includes("root")) {
      rules.forEach(rule => {
        if (clickedModel.includes(rule)) {
          const isChecked = root[rule] === true ? true : false 
          if(root[rule] === isChecked) {
            broadcastRegions.forEach(i => dispatch(actions.change(`forms.brcRules.region[${i.id}].${rule}`, isChecked)))
            broadcastStates.forEach(i => dispatch(actions.change(`forms.brcRules.state[${i.id}].${rule}`, isChecked)))
            broadcastCompanies.forEach(i => dispatch(actions.change(`forms.brcRules.company[${i.id}].${rule}`, isChecked)))
            broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.office[${i.id}].${rule}`, isChecked)))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, !isChecked))
            broadcastRegions.forEach(i => dispatch(actions.change(`forms.brcRules.region[${i.id}].${rule}Partly`, !isChecked)))
            broadcastStates.forEach(i => dispatch(actions.change(`forms.brcRules.state[${i.id}].${rule}Partly`, !isChecked)))
            broadcastCompanies.forEach(i => dispatch(actions.change(`forms.brcRules.company[${i.id}].${rule}Partly`, !isChecked)))
            broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.office[${i.id}].${rule}Partly`, !isChecked)))
          };
        }
      })
      units.forEach(unit => {
        if (clickedModel.includes("priceUnit")) {
          if(root.priceUnit === unit) broadcastRegions.forEach(i => dispatch(actions.change(`forms.brcRules.region.${i.id}.priceUnit`, unit)))
          if(root.priceUnit === unit) broadcastStates.forEach(i => dispatch(actions.change(`forms.brcRules.state.${i.id}.priceUnit`, unit)))
          if(root.priceUnit === unit) broadcastCompanies.forEach(i => dispatch(actions.change(`forms.brcRules.company.${i.id}.priceUnit`, unit)))
          if(root.priceUnit === unit) broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.office.${i.id}.priceUnit`, unit)))
        }
      })
      if (clickedModel.includes("priceValue")) {
        if(root.priceValue) broadcastRegions.forEach(i => dispatch(actions.change(`forms.brcRules.region.${i.id}.priceValue`, root.priceValue)))
        if(!root.priceValue) broadcastRegions.forEach(i => dispatch(actions.change(`forms.brcRules.region.${i.id}.priceValue`, "")))
        if(root.priceValue) broadcastStates.forEach(i => dispatch(actions.change(`forms.brcRules.state.${i.id}.priceValue`, root.priceValue)))
        if(!root.priceValue) broadcastStates.forEach(i => dispatch(actions.change(`forms.brcRules.state.${i.id}.priceValue`, "")))
        if(root.priceValue) broadcastCompanies.forEach(i => dispatch(actions.change(`forms.brcRules.company.${i.id}.priceValue`, root.priceValue)))
        if(!root.priceValue) broadcastCompanies.forEach(i => dispatch(actions.change(`forms.brcRules.company.${i.id}.priceValue`, "")))
        if(root.priceValue) broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.office.${i.id}.priceValue`, root.priceValue)))
        if(!root.priceValue) broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.office.${i.id}.priceValue`, "")))

        if(!root.priceValue) broadcastOffices.forEach(i => dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, ""))) //TODO: for ALL

      }
    }

    if (clickedModel.includes("region")) {
      const clickedRegion = regions.find(region => region.id === clickedModelId)
      const clickedBroadcastRegion = broadcastRegions.find(region => region.id === clickedModelId)

      rules.forEach(rule => {
        if (clickedModel.includes(rule)) {
          const isChecked = clickedBroadcastRegion[rule] === true ? true : false 
          dispatch(actions.change(`forms.brcRules.region[${clickedModelId}].${rule}Partly`, !isChecked))
          if (broadcastRegions.some(region => region[rule] === true)) dispatch(actions.change(`forms.brcRules.root[1].${rule}`, true))
          if (broadcastRegions.every(region => region[rule] === false)) dispatch(actions.change(`forms.brcRules.root[1].${rule}`, false))
          
          if (broadcastRegions.every(region => region[rule] === true) && broadcastRegions.every(region => region[`${rule}Partly`] === false)) dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, false))
          if (broadcastRegions.some(region => region[rule] === false)) dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, true))
          
          if (clickedBroadcastRegion[rule] === isChecked && clickedRegion.states) {
            clickedRegion.states.forEach(state => {
              dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}`, isChecked))
              dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}Partly`, !isChecked))
              if (state.companies) state.companies.forEach(company => {
                const allCompanies = flattenCompanies.filter(i => i.id === company.id)
                const allOffices = allCompanies.map(i => i.offices).flat()
                const allOfficesBrc = broadcastOffices.filter(obj => allOffices.find(obj2 => obj.id === obj2.id))
                if (allOfficesBrc.every(obj => obj[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}`, false))
                if (allOfficesBrc.some(obj => obj[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}`, true))
                if (allOfficesBrc.every(obj => obj[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}Partly`, false))
                if (allOfficesBrc.some(obj => obj[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}Partly`, true))

                if (company.offices) company.offices.forEach(office => {
                    dispatch(actions.change(`forms.brcRules.office[${office.id}].${rule}`, isChecked))
                })
              })
            })
          };
        }
      })
      if (clickedModel.includes("priceUnit")) {
        units.forEach(unit => {
          if (broadcastRegions.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, unit))
          if (!broadcastRegions.every(i => i.priceUnit === "$") && !broadcastRegions.every(i => i.priceUnit === "%")) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, ""));
          if (clickedBroadcastRegion && clickedBroadcastRegion.priceUnit === unit) {
            clickedRegion.states.forEach(state => {
              dispatch(actions.change(`forms.brcRules.state[${state.id}].priceUnit`, unit))
              if (state.companies) state.companies.forEach(company => {
                dispatch(actions.change(`forms.brcRules.company[${company.id}].priceUnit`, unit))
                if (company.offices) company.offices.forEach(office => {
                  dispatch(actions.change(`forms.brcRules.office[${office.id}].priceUnit`, unit))
                })
              })
            })
          };
        })
      }
      if (clickedModel.includes("priceValue")) {
        if (broadcastRegions.every(i => i.priceValue === broadcastRegions[0].priceValue)) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, (clickedBroadcastRegion.priceValue)));
        if (broadcastRegions.some(i => i.priceValue !== broadcastRegions[0].priceValue)) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, ""));
        clickedRegion.states.forEach(state => {
          dispatch(actions.change(`forms.brcRules.state[${state.id}].priceValue`, (clickedBroadcastRegion.priceValue)))
          if (state.companies) state.companies.forEach(company => {
            dispatch(actions.change(`forms.brcRules.company[${company.id}].priceValue`, (clickedBroadcastRegion.priceValue)))
            if (company.offices) company.offices.forEach(office => {
              dispatch(actions.change(`forms.brcRules.office[${office.id}].priceValue`, (clickedBroadcastRegion.priceValue)))
            })
          })
        })
      }
    }

    if (clickedModel.includes("state")) {
      const clickedState = flattenStates.find(state => state.id === clickedModelId)
      const clickedBroadcastState = broadcastStates.find(state => state.id === clickedModelId)
      const parentRegion = regions.find(region => region.id === clickedState.regionId)
      const statesFiltered = broadcastStates.filter(obj => parentRegion["states"].find(obj2 => obj.id === obj2.id)) //from broadcastStates filter only those states that are also in the parentRegion

      rules.forEach(rule => {
        if (clickedModel.includes(rule)) {
          const isChecked = clickedBroadcastState[rule] === true ? true : false 
          dispatch(actions.change(`forms.brcRules.state[${clickedModelId}].${rule}Partly`, !isChecked))
          if (statesFiltered.some(state => state[rule] === true)) {
            dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].${rule}`, true))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}`, true))
          }

          if (statesFiltered.every(state => state[rule] === false)) dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].${rule}`, false))
          if (statesFiltered.every(state => state[rule] === false) && broadcastRegions.every(region => region[`${rule}`] === false)) dispatch(actions.change(`forms.brcRules.root[1].${rule}`, false))

          if (statesFiltered.some(state => state[rule] === false)) {
            dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].${rule}Partly`, true))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, true))
          }

          if (statesFiltered.every(state => state[rule] === true) && statesFiltered.every(state => state[`${rule}Partly`] === false))  dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].${rule}Partly`, false))
          if (statesFiltered.every(state => state[rule] === true) && broadcastRegions.every(region => region[rule] === true) && broadcastRegions.every(region => region[`${rule}Partly`] === false))  dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, false))


          if (clickedBroadcastState[rule] === isChecked && clickedState.companies) {
 
            clickedState.companies.forEach(company => {
              const allCompanies = flattenCompanies.filter(i => i.id === company.id)
              const allOffices = allCompanies.map(i => i.offices).flat()
              const allOfficesBrc = broadcastOffices.filter(obj => allOffices.find(obj2 => obj.id === obj2.id))
              if (allOfficesBrc.every(obj => obj[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}`, false))
              if (allOfficesBrc.some(obj => obj[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}`, true))
              if (allOfficesBrc.every(obj => obj[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}Partly`, false))
              if (allOfficesBrc.some(obj => obj[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${company.id}].${rule}Partly`, true))

              if (company.offices) company.offices.forEach(office => {
                dispatch(actions.change(`forms.brcRules.office[${office.id}].${rule}`, isChecked))
              })
            })
          };
        }
      })

      if (clickedModel.includes("priceUnit")) {
        units.forEach(unit => {
          if (statesFiltered.every(i => i.priceUnit === unit) && broadcastRegions.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, unit))
          if (statesFiltered.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].priceUnit`, unit))
          if (clickedBroadcastState && clickedBroadcastState.priceUnit === unit) {
            clickedState.companies.forEach(company => {
              dispatch(actions.change(`forms.brcRules.company[${company.id}].priceUnit`, unit))
              if (company.offices) company.offices.forEach(office => {
                dispatch(actions.change(`forms.brcRules.office[${office.id}].priceUnit`, unit))
              })
            })
          };
        })
        if (!statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%")) dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].priceUnit`, ""))
        if ((!statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%")) || (!broadcastRegions.every(i => i.priceUnit === "$") && !broadcastRegions.every(i => i.priceUnit === "%"))) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, ""))
      }

      const someStatesValuesNotEqual = statesFiltered.some(i => i.priceValue !== statesFiltered[0].priceValue)
      const someRegionsValuesNotEqual = broadcastRegions.some(i => i.priceValue !== broadcastRegions[0].priceValue)
      const everyStatesValuesEqual = statesFiltered.every(i => i.priceValue === statesFiltered[0].priceValue)
      const everyRegionsValuesEqual = broadcastRegions.every(i => i.priceValue === broadcastRegions[0].priceValue)

      if (clickedModel.includes("priceValue")) {
        if (everyStatesValuesEqual && everyRegionsValuesEqual) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, (clickedBroadcastState.priceValue)));
        if (everyStatesValuesEqual) dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].priceValue`, (clickedBroadcastState.priceValue)));

        if (someStatesValuesNotEqual || someRegionsValuesNotEqual ) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, ""));
        if (someStatesValuesNotEqual) dispatch(actions.change(`forms.brcRules.region[${clickedState.regionId}].priceValue`, ""));
        clickedState.companies.forEach(company => {
          dispatch(actions.change(`forms.brcRules.company[${company.id}].priceValue`, (clickedBroadcastState.priceValue)))
          if (company.offices) company.offices.forEach(office => {
            dispatch(actions.change(`forms.brcRules.office[${office.id}].priceValue`, (clickedBroadcastState.priceValue)))
          })
        })
      }
    }
    if (clickedModel.includes("company")) {
      const clickedCompany = flattenCompanies.find(company => company.id === clickedModelId)
      const clickedCompanies = flattenCompanies.filter(company => company.id === clickedModelId) //filter all companies with id === clickedModelId (there can be more than one!)
      const clickedBroadcastCompany = broadcastCompanies.find(company => company.id === clickedModelId)
      const parentRegion = regions.find(region => region.id === clickedCompany.regionId)
      const statesFiltered = broadcastCompanies.filter(obj => parentRegion["states"].find(obj2 => obj.id === obj2.id)) //from broadcastCompanies filter only those that are also in the parentRegion
      const parentState = flattenStates.find(state => state.id === clickedCompany.stateId)

      const officesInThisCompany = flattenOffices.filter(office => office.companyId === clickedModelId)
      const parentStatesIds = officesInThisCompany.map(office => office.stateId)
      const parentStates = flattenStates.filter(state => parentStatesIds.includes(state.id))
      const parentRegionsIds = officesInThisCompany.map(i => i.regionId)
      const parentRegions = regions.filter(region => parentRegionsIds.includes(region.id))
      const companiesFiltered = broadcastCompanies.filter(obj => parentState["companies"].find(obj2 => obj.id === obj2.id)) //from broadcastCompanies filter only those that are also in the parentState
      const allStatesFilteredBrc = broadcastStates.filter(obj => parentStatesIds.includes(obj.id))
      const allRegionsFilteredBrc = broadcastRegions.filter(obj => parentRegionsIds.includes(obj.id))

      rules.forEach(rule => {
        if (clickedModel.includes(rule)) {
          const isChecked = clickedBroadcastCompany[rule] === true ? true : false 
          dispatch(actions.change(`forms.brcRules.company[${clickedModelId}].${rule}Partly`, !isChecked))

          if (companiesFiltered.some(company => company[rule] === true)) {
            parentStates.forEach(state => dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}`, true)))
            parentRegions.forEach(region => dispatch(actions.change(`forms.brcRules.region[${region.id}].${rule}`, true)))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}`, true))
          }

          if (companiesFiltered.every(company => company[rule] === false)) {
            parentStates.forEach(state => dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}`, false)))
          }
          if (companiesFiltered.every(company => company[rule] === false) && statesFiltered.every(i => i[rule] === false)) {
            parentRegions.forEach(region => dispatch(actions.change(`forms.brcRules.region[${region.id}].${rule}`, false)))
          }
          if (companiesFiltered.every(company => company[rule] === false) && statesFiltered.every(i => i[rule] === false) && broadcastRegions.every(i => i[`${rule}`] === false)) {
            dispatch(actions.change(`forms.brcRules.root[1].${rule}`, false))
          }

          parentStates.forEach(state => {
            const companiesOfThisState = broadcastCompanies.filter(obj => state["companies"].find(obj2 => obj.id === obj2.id))
            if (companiesOfThisState.some(company => company[rule] === false)) dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}Partly`, true))
            if (companiesOfThisState.every(company => company[rule] === true)) dispatch(actions.change(`forms.brcRules.state[${state.id}].${rule}Partly`, false))
          }) //TODO: takhle je to dobre! predelat i pro regiony!!!! a pro pricevalues a units

          if (companiesFiltered.some(company => company[rule] === false) || allStatesFilteredBrc.some(state => state[rule] === false)) parentRegions.forEach(region => dispatch(actions.change(`forms.brcRules.region[${region.id}].${rule}Partly`, true)))
          if (companiesFiltered.some(company => company[rule] === false) || allStatesFilteredBrc.some(state => state[rule] === false) || allRegionsFilteredBrc.some(state => state[rule] === false) ) {            
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, true))
          }
          

          if (companiesFiltered.every(company => company[rule] === true) && statesFiltered.every(state => state[rule] === true)) {
            parentRegions.forEach(region => dispatch(actions.change(`forms.brcRules.region[${region.id}].${rule}Partly`, false)))
          }
          if (companiesFiltered.every(company => company[rule] === true) && statesFiltered.every(state => state[rule] === true) && broadcastRegions.every(region => region[rule] === true)) {
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, false))
          }

          if (clickedBroadcastCompany[rule] === isChecked && clickedCompany.offices) {
            const allOffices = clickedCompanies.map(i => i.offices).flat()
            allOffices.forEach(office => {
                dispatch(actions.change(`forms.brcRules.office[${office.id}].${rule}`, isChecked))
            })
          };
        }
      })

      if (clickedModel.includes("priceUnit")) {
        units.forEach(unit => {
          if (companiesFiltered.every(i => i.priceUnit === unit) && statesFiltered.every(i => i.priceUnit === unit) && broadcastRegions.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, unit))
          if (companiesFiltered.every(i => i.priceUnit === unit) && statesFiltered.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.region[${clickedCompany.regionId}].priceUnit`, unit))
          if (companiesFiltered.every(i => i.priceUnit === unit)) dispatch(actions.change(`forms.brcRules.state[${clickedCompany.stateId}].priceUnit`, unit))
          if (clickedBroadcastCompany && clickedBroadcastCompany.priceUnit === unit) {
            const allOffices = clickedCompanies.map(i => i.offices).flat()
            allOffices.forEach(office => {
                dispatch(actions.change(`forms.brcRules.office[${office.id}].priceUnit`, unit))
            })
          };
        })
        if (!companiesFiltered.every(i => i.priceUnit === "$") && !companiesFiltered.every(i => i.priceUnit === "%")) dispatch(actions.change(`forms.brcRules.state[${clickedCompany.stateId}].priceUnit`, ""))
        if ((!companiesFiltered.every(i => i.priceUnit === "$") && !companiesFiltered.every(i => i.priceUnit === "%")) 
          || (!statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%"))
        ) dispatch(actions.change(`forms.brcRules.region[${clickedCompany.regionId}].priceUnit`, ""))
        if ((!companiesFiltered.every(i => i.priceUnit === "$") && !companiesFiltered.every(i => i.priceUnit === "%"))
          || (!statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%")) 
          || (!broadcastRegions.every(i => i.priceUnit === "$") && !broadcastRegions.every(i => i.priceUnit === "%"))
          ) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, ""))
      }

      const someCompaniesValuesNotEqual = companiesFiltered.some(i => i.priceValue !== companiesFiltered[0].priceValue)
      const someStatesValuesNotEqual = statesFiltered.some(i => i.priceValue !== statesFiltered[0].priceValue)
      const someRegionsValuesNotEqual = broadcastRegions.some(i => i.priceValue !== broadcastRegions[0].priceValue)
      const everyCompaniesValuesEqual = companiesFiltered.every(i => i.priceValue === companiesFiltered[0].priceValue)
      const everyStatesValuesEqual = statesFiltered.every(i => i.priceValue === statesFiltered[0].priceValue)
      const everyRegionsValuesEqual = broadcastRegions.every(i => i.priceValue === broadcastRegions[0].priceValue)

      if (clickedModel.includes("priceValue")) {
        if (everyCompaniesValuesEqual && everyStatesValuesEqual && everyRegionsValuesEqual) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, (clickedBroadcastCompany.priceValue)));
        if (everyCompaniesValuesEqual && everyStatesValuesEqual) dispatch(actions.change(`forms.brcRules.region[${clickedCompany.regionId}].priceValue`, (clickedBroadcastCompany.priceValue)));
        if (everyCompaniesValuesEqual) dispatch(actions.change(`forms.brcRules.state[${clickedCompany.stateId}].priceValue`, (clickedBroadcastCompany.priceValue)));

        if (someCompaniesValuesNotEqual || someStatesValuesNotEqual || someRegionsValuesNotEqual ) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, ""));
        if (someCompaniesValuesNotEqual || someStatesValuesNotEqual) dispatch(actions.change(`forms.brcRules.region[${clickedCompany.regionId}].priceValue`, ""));
        if (someCompaniesValuesNotEqual) dispatch(actions.change(`forms.brcRules.state[${clickedCompany.stateId}].priceValue`, ""));
        const allOffices = clickedCompanies.map(i => i.offices).flat()
        allOffices.forEach(office => {
            dispatch(actions.change(`forms.brcRules.office[${office.id}].priceValue`, (clickedBroadcastCompany.priceValue)))
        })
      }
    }

    if (clickedModel.includes("office")) {
      const clickedOffice = flattenOffices.find(office => office.id === clickedModelId)
      const clickedBroadcastOffice = broadcastOffices.find(office => office.id === clickedModelId)

      const parentCompany = flattenCompanies.filter(company => company.id === clickedOffice.companyId) 
      //use filter, not find! Because there can be more than one parent company! (because offices from different states can be from same company)
      const parentCompanyOffices = (parentCompany.map(i => i.offices)).flat()
      const officesCompanyFiltered = broadcastOffices.filter(obj => parentCompanyOffices.flat().find(obj2 => obj.id === obj2.id)) 

      const parentState = flattenStates.find(state => state.id === clickedOffice.stateId)
      const parentStatesOffices = parentState.companies.map(i => i.offices)
      const officesFiltered = broadcastOffices.filter(obj => parentStatesOffices.flat().find(obj2 => obj.id === obj2.id)) 

      const parentRegion = regions.find(region => region.id === clickedOffice.regionId)
      const statesFiltered = broadcastStates.filter(obj => parentRegion["states"].find(obj2 => obj.id === obj2.id))

      rules.forEach(rule => {
        if (clickedModel.includes(rule)) {
          if (officesFiltered.some(office => office[rule] === true)) {
            dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].${rule}`, true))
            dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].${rule}`, true))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}`, true))
          }
          if (officesCompanyFiltered.some(office => office[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].${rule}`, true))

          if (officesCompanyFiltered.every(office => office[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].${rule}`, false))
          if (officesFiltered.every(office => office[rule] === false)) dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].${rule}`, false))
          if (officesFiltered.every(office => office[rule] === false) && statesFiltered.every(state => state[rule] === false)) dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].${rule}`, false))
          if (officesFiltered.every(office => office[rule] === false) && statesFiltered.every(state => state[rule] === false) && broadcastRegions.every(region => region[`${rule}`] === false)) {
            dispatch(actions.change(`forms.brcRules.root[1].${rule}`, false))
          }

          if (officesFiltered.some(office => office[rule] === false)) {
            dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].${rule}Partly`, true))
            dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].${rule}Partly`, true))
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, true))
          }
          if (officesCompanyFiltered.some(office => office[rule] === false)) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].${rule}Partly`, true))

          if (officesCompanyFiltered.every(office => office[rule] === true)) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].${rule}Partly`, false))
          if (officesFiltered.every(office => office[rule] === true)) dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].${rule}Partly`, false))
          if (officesFiltered.every(office => office[rule] === true) && statesFiltered.every(state => state[`${rule}Partly`] === false)) dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].${rule}Partly`, false))
          if (officesFiltered.every(office => office[rule] === true) && statesFiltered.every(state => state[`${rule}Partly`] === false) && broadcastRegions.every(region => region[`${rule}Partly`] === false)) {
            dispatch(actions.change(`forms.brcRules.root[1].${rule}Partly`, false))
          }
        }
      })

      if (clickedModel.includes("priceUnit")) {
        units.forEach(unit => {
          const officesCompanyUnitsEqual = officesCompanyFiltered.every(i => i.priceUnit === unit)
          const officesUnitsEqual = officesFiltered.every(i => i.priceUnit === unit)
          const statesUnitsEqual = statesFiltered.every(i => i.priceUnit === unit)
          const regionsUnitsEqual = broadcastRegions.every(i => i.priceUnit === unit)

          if (officesUnitsEqual && statesUnitsEqual && regionsUnitsEqual) dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, unit))
          if (officesUnitsEqual && statesUnitsEqual) dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].priceUnit`, unit))
          if (officesUnitsEqual) dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].priceUnit`, unit))
          if (officesCompanyUnitsEqual) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].priceUnit`, unit))
        })
        if ((!officesFiltered.every(i => i.priceUnit === "$") && !officesFiltered.every(i => i.priceUnit === "%")) 
              || !statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%")) {
                dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].priceUnit`, ""))
        }
        if ((!officesFiltered.every(i => i.priceUnit === "$") && !officesFiltered.every(i => i.priceUnit === "%")) 
          || (!statesFiltered.every(i => i.priceUnit === "$") && !statesFiltered.every(i => i.priceUnit === "%"))
          || (!broadcastRegions.every(i => i.priceUnit === "$") && !broadcastRegions.every(i => i.priceUnit === "%"))) {
            dispatch(actions.change(`forms.brcRules.root[1].priceUnit`, ""))
        }
        if (!officesFiltered.every(i => i.priceUnit === "$") && !officesFiltered.every(i => i.priceUnit === "%")) {
          dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].priceUnit`, ""))
        }
        if (!officesCompanyFiltered.every(i => i.priceUnit === "$") && !officesCompanyFiltered.every(i => i.priceUnit === "%")) {
          dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].priceUnit`, ""))
        }
      }

      if (clickedModel.includes("priceValue")) {
        const officesValuesNotEqual = officesFiltered && officesFiltered.some(i => i.priceValue !== officesFiltered[0].priceValue)
        const statesValuesNotEqual = statesFiltered && statesFiltered.some(i => i.priceValue !== statesFiltered[0].priceValue)
        const regionsValuesNotEqual = broadcastRegions && broadcastRegions.some(i => i.priceValue !== broadcastRegions[0].priceValue)

        const officesValuesEqual = officesFiltered && officesFiltered.every(i => i.priceValue === officesFiltered[0].priceValue)
        const statesValuesEqual = statesFiltered && statesFiltered.every(i => i.priceValue === statesFiltered[0].priceValue) 
        const regionsValuesEqual = broadcastRegions && broadcastRegions.every(i => i.priceValue === broadcastRegions[0].priceValue)

        if (officesValuesEqual && statesValuesEqual && regionsValuesEqual) {
          dispatch(actions.change(`forms.brcRules.root[1].priceValue`, clickedBroadcastOffice.priceValue));
        }
        
        if (officesValuesEqual && statesValuesEqual) {
          dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].priceValue`, clickedBroadcastOffice.priceValue));
        }
        if (officesValuesEqual) dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].priceValue`, clickedBroadcastOffice.priceValue));
        if (officesValuesEqual) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].priceValue`, clickedBroadcastOffice.priceValue));

        if (officesValuesNotEqual || statesValuesNotEqual || regionsValuesNotEqual) dispatch(actions.change(`forms.brcRules.root[1].priceValue`, ""));
        if (officesValuesNotEqual || statesValuesNotEqual) dispatch(actions.change(`forms.brcRules.region[${clickedOffice.regionId}].priceValue`, ""));
        if (officesValuesNotEqual) dispatch(actions.change(`forms.brcRules.state[${clickedOffice.stateId}].priceValue`, ""));
        if (officesValuesNotEqual) dispatch(actions.change(`forms.brcRules.company[${clickedOffice.companyId}].priceValue`, ""));
      }
    }
  }

  handleContinue = () => {
    console.log("broadcast was applied"); //TODO
    this.props.removePopup();
  };

  switchToList = () => {
    this.setState({ isClientList: true });
  };

  switchToPrice = () => {
    this.setState({ isClientList: false });
  };

  render() {
    const { 
      removePopup, dispatch, broadcastData, broadcastIsFetching,
      storedRoot, storedRegions, storedStates, storedOffices, storedCompanies
    } = this.props;
    const { isClientList, categoryFilter, regionsExpanded, companiesExpanded, statesExpanded, filterInput, filteredRegions, filteredStates, filteredCompanies, filteredOffices } = this.state;
    if (broadcastIsFetching || !storedOffices) return <Spinner />
    console.log(this.props, this.state)
    const categoryFilterOptions = [
      { name: "All Regions", id: "allregions" },
      { name: "All Companies", id: "allcompanies" },
    ];
    const templatesOptions = [] //TODO

    const footerComponent = (
      <>
        <Button color="grey-white" onClick={() => removePopup()}>
          Cancel
        </Button>
        {/*<Button color="green-white" size="large-2x" onClick={() => removePopup()}>*/}
          {/*Save As Template*/}
        {/*</Button>*/}
        <Button color="blue" onClick={() => removePopup()}>
          Apply
        </Button>
      </>
    )
    const brcOffices = this.convertObjectToArray(storedOffices)
    const broadcastingTo = brcOffices.filter(i => i.broadcast === true).length

    return (
      <PopupComponent
        handleContinue={this.handleContinue}
        footerComponent={footerComponent}
        removePopup={removePopup}
        headerTitle="Broadcast control"
      >
        <div className="add-broadcast">
          <div className="broadcast-nav">
            <div className={isClientList ? "active" : ""} onClick={this.switchToList}>
              Client List
            </div>
            <div
              className={!isClientList ? "active" : ""}
              onClick={this.switchToPrice}
            >
              Price List 
            </div>
          </div>

          <div className="broadcast-filter">
            <div className="broadcasting-info">
              <i className="fas fa-info-circle" />
              <span>
                Broadcasting to: <b>{broadcastingTo}/{brcOffices.length}</b>
              </span>
            </div>
            <div className="group-item-wr smaller">
              <label>Category Filter</label>
              <Dropdown
                opns={categoryFilterOptions}
                placeholder="Select Category Filter"
                onChange={value => this.setState({categoryFilter: value})}
              />
            </div>


            <div className="group-item-wr search">
              <i className="fa fa-search" />
              <InputControlled
                value={this.state.filterInput}
                handleChange={e => this.onChangeHandler(e)}
                name="filterInput"
                placeholder="Search Company or Region"
              />
            </div>

            <hr />
            <div className="group-item-wr smaller">
              <label>Templates ({templatesOptions.length})</label>
              <Dropdown opns={[]} placeholder="Select Template" disabled={templatesOptions.length === 0 ? true : false}/>
            </div>
          </div>

          {isClientList 
            ? <div className="broadcast-filter-nav client-list">
                  <div className="field-name">Name</div>
                  <div className="list-rules">
                    <div>Include</div>
                    <div>Anonymous</div>
                  </div>
              </div>
            : <div className="broadcast-filter-nav price-list">
                <div className="field-name">Name</div>
                <div>Mark-up/down</div>
              </div>
          }

          <div className="broadcast-main">
          <Form model="forms.brcRules" onSubmit={v => console.log(v)}>
            <RootBroadcastField
              name="Root"
              type="root"
              rootData={broadcastData.root}
              categoryFilter={categoryFilter}
              dispatch={dispatch}
              isClientList={isClientList}
              handleExpanded={this.handleExpanded}
              regionsExpanded={regionsExpanded}
              statesExpanded={statesExpanded}
              companiesExpanded={companiesExpanded}
              handleRuleClick={this.handleRuleClick}
              storedRoot={storedRoot}
              storedRegions={this.convertObjectToArray(storedRegions)}
              storedStates={this.convertObjectToArray(storedStates)}
              storedCompanies={this.convertObjectToArray(storedCompanies)}
              filterInput={filterInput}
              filteredRegions={filteredRegions}
              filteredStates={filteredStates}
              filteredCompanies={filteredCompanies} 
              filteredOffices={filteredOffices}
            />
          {/* {!searchedItem && regions.map(i => <RegionBroadcastField
              regionDetail={regionDetail}
              regionDetailIsFetching={regionDetailIsFetching}
              stateDetailIsFetching={stateDetailIsFetching}
              stateDetail={stateDetail}
              dispatch={dispatch}
              isClientList={isClientList}
              regionIsExpanded={regionIsExpanded === i.id}
              stateIsExpanded={stateIsExpanded}
              name={i.name}
              id={i.id}
              key={i.id}
            />)} */}
          </Form>
          </div>
        </div>
      </PopupComponent>
    );
  }
}

AddBroadcast.propTypes = {
  isFetching: PropTypes.bool,
  removePopup: PropTypes.func
};

export default AddBroadcast;
