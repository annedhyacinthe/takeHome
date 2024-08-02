// import './prefilledSearch.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FilterContext } from '../FilterContext'
import React, { useContext, useRef, useState } from 'react';

function PrefilledSearch(props) {
    const { positions, setPositions, status, setStatus, statType, setStatType } = useContext(FilterContext)
    const formRef = useRef([]);
    let selection = {}

  function setFilter(){
    console.log('hit')
    switch(props.dropdownType){
      case 'statType':
        setStatType(selection)
        console.log('done')
        break
      case 'positions':
        console.log('done 1')
        setPositions(selection)
        console.log('done 2')
        break
      case 'status':
        setStatus(selection)
        break
    }
  }
    
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
                      }else{
                        delete selection[option]
                      }
                      console.log(selection)
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