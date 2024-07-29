// import './prefilledSearch.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { FilterContext } from '../FilterContext'
import React, { useContext } from 'react';
function PrefilledSearch(props) {
    const { setPosition } = useContext(FilterContext)
    setTimeout(() => {
        setPosition(['anne'])
      }, "1000");
  return (
    <Dropdown style={{display :'grid'}}>
      <Dropdown.Toggle variant={props.variantType} style={{display :'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        {props.dropdownType}
      </Dropdown.Toggle>

      <Dropdown.Menu style = {{width: '100%'}}>
        {props.dropdownOptions.map((option) =>(
            <Dropdown.Item href="#/action-1">{option}</Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default PrefilledSearch;