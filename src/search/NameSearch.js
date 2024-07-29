// import './nameSearch.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { FilterContext } from '../FilterContext'
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce'
import data from '../data/props.json'
function NameSearch() {
    const [currName, setCurrName] = useState('');
    const [selectedNames, setSelectedNames] = useState([]);
    const [filteredNames, setFilteredNames] = useState([]);
    const dropdownRef = useRef(null);
    const { setplayerFirstIndex } = useContext(FilterContext)
    function helper(curr){
        console.log('Hit',curr)
        setCurrName(curr)
        debounceFilter(curr)
    }
    const debounceFilter = useCallback (
        debounce((val) => {fetchNames(val)
        },50),
        []
    )
    function fetchNames(name){
        console.log('FETCH',name)
        let namesSeen = new Set()
        const filteredData = data.filter((person) => {
            if(person.playerName.toLowerCase().includes(name.toLowerCase())){
                if(!namesSeen.has(person.playerName)){
                    namesSeen.add(person.playerName)
                    return person
                }
            }
            })
        setFilteredNames(filteredData)
    }
    function helperS (e,name){
        console.log(e)
        // e.stopPropagation()
        // if(currentNames.has(name)){
        //     currentNames.delete(name)
        // } else {
        //     currentNames.add(name)
        // }
        setSelectedNames([...selectedNames,name])
        console.log('selected',selectedNames)
        // console.log('a',currentNames.size)
    }
  return (
    <div style={{display :'flex', justifyContent:'space-between'}}>
        <Dropdown ref={dropdownRef} style={{display :'grid', width:'67%'}}  autoClose='outside'>
      <Dropdown.Toggle style={{display :'flex', alignItems: 'center', justifyContent: 'space-between', padding:'0px 12px', border:'0px'}}>
      <Form.Control
            type="search"
            placeholder="Player or Team Name"
            className="me-2"
            aria-label="Search"
            value = {currName}
            style = {{boxShadow: 'none', borderColor: 'transparent'}}
            onChange = {(e) => {
                // setName(e.target.value)
                helper(e.target.value)
                }
            }
            onClick={(e) => {
                if (dropdownRef.current.classList.contains("show")){
                    console.log(e)
                    console.log(dropdownRef.current.classList)
                    e.stopPropagation()
                }
            }}
            />
      </Dropdown.Toggle>

      <Dropdown.Menu style = {{width: '100%'}} autoClose="outside" >
      {selectedNames.map((person) =>(
            <Dropdown.Item href="#/action-1">
                <Form.Check
                    inline
                    label={person}
                    name="group1"
                    id={person.playerId}
                    onClick = {(e) => helperS(e,person) }
                />
        </Dropdown.Item>
            ))}
        <Dropdown.Divider />
        {filteredNames.map((person) =>(
            <Dropdown.Item href="#/action-1">
                <Form.Check
                    inline
                    label={person.playerName}
                    name="group1"
                    id={person.playerId}
                    onClick = {(e) => helperS(e,person.playerName) }
                />
        </Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
    <Button variant="danger" style={{width:'15%'}}>Clear</Button>
    <Button variant="danger" style={{width:'15%'}}>Search</Button>
    </div>
  );
}

export default NameSearch;
