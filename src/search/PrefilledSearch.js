// import './prefilledSearch.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FilterContext } from '../FilterContext'
import React, { useContext, useRef, useEffect, useState } from 'react';

function PrefilledSearch(props) {
    const { positions, setPositions, status, setStatus, statType, setStatType } = useContext(FilterContext)
    const [selection, setSelection] = useState({});
    const formRef = useRef([]);
    // let selection = {}

  function setFilter(){
    switch(props.dropdownType){
      case 'statType':
        setStatType({...selection})
        break
      case 'positions':
        setPositions({...selection})  
        break
      case 'status':
        setStatus({...selection})
        break
    }
  }
  // function updateFilter(originalSelection,currentSelection){
  //   let keys = Object.keys(originalSelection)
  //   for(let i = 0; i < keys.length; i++){

  //   }
  // }

  return (
    <Dropdown style={{display :'grid'}} autoClose='outside' id={props.dropdownType}>
      <Dropdown.Toggle variant={props.variantType} id='dropToggle' style={{display :'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {props.dropdownType}
      </Dropdown.Toggle>

      <Dropdown.Menu ref={formRef} style = {{width: '100%'}} id='dropMenu'>
        {props.dropdownOptions.map((option) =>(
            <Dropdown.Item href="#/action-1">
              <Form.Check
                    inline
                    label={option}
                    name="group1"
                    id={option}
                    onClick={(e) => {
                      if(!selection[option]){
                        selection[option] = true
                        setSelection(selection)
                      }else{
                        delete selection[option]
                        setSelection(selection)
                      }
                  }}
                />
            </Dropdown.Item>
            ))}
            {/* <Button variant="danger" style={{width:'50%'}} onClick = {() => clearFilter() }>Clear</Button> */}
      <Button variant="danger" style={{width:'50%'}} onClick = {() => setFilter() }>Apply</Button>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PrefilledSearch;