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
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const dropdownRef = useRef(null);
    const { setPlayers } = useContext(FilterContext)
    function helper(curr){
        console.log('Hit',curr)
        setCurrName(curr)
        debounceFilter(curr)
    }
    // console.log('SELECTED1',selectedPlayers)
    const debounceFilter = useCallback (
        debounce((val) => {fetchNames(val)
        },50),
        []
    )
    function fetchNames(name){
        // useEffect(() => {
        console.log('FETCH',name)
        let namesSeen = new Set()
        console.log('SELECTED',selectedPlayers)
        for(let i = 0; i < selectedPlayers.length; i++){
            namesSeen.add(selectedPlayers[i].playerName.toLowerCase())
        }
        console.log('NAMES SEEN',namesSeen)
        const filteredData = data.filter((person) => {
            if(person.playerName.toLowerCase().includes(name.toLowerCase())){
                if(!namesSeen.has(person.playerName)){
                    namesSeen.add(person.playerName)
                    return person
                }
            }
            })
            console.log('FILTERED',filteredData)
        setFilteredPlayers(filteredData)
    }
    
    function handleCheck (list,player){
        let index = list === 'filtered' ? filteredPlayers.findIndex((curr) => curr.playerId === player.playerId) :
         selectedPlayers.findIndex((curr) => curr.playerId === player.playerId)
        if(-1 < index){
            if (list === 'filtered'){
                let holder = filteredPlayers
                // console.log('SEL',selectedPlayers)
                holder.splice(index,1)
                setFilteredPlayers([...holder])
                setSelectedPlayers([...selectedPlayers,player])
            } else {
                let holder = selectedPlayers
                console.log('SEL',selectedPlayers)
                holder.splice(index,1)
                setSelectedPlayers([...holder])
                setFilteredPlayers([...filteredPlayers,player])
            }
        }
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
                helper(e.target.value)
                console.log('Selected',selectedPlayers)
                }
            }
            onClick={(e) => {
                if (dropdownRef.current.classList.contains("show")){
                    e.stopPropagation()
                }
            }}
            />
      </Dropdown.Toggle>

      <Dropdown.Menu style = {{width: '100%'}} autoClose="outside" >
      {selectedPlayers.map((person) =>(
            <Dropdown.Item href="#/action-1" onClick = {() => handleCheck('selected',person) }>
                {person.playerName}
        </Dropdown.Item>
            ))}
        <Dropdown.Divider />
        {filteredPlayers.map((person) =>(
            <Dropdown.Item href="#/action-1" key={person.playerId} onClick = {() => handleCheck('filtered',person) }>
                {person.playerName}
        </Dropdown.Item>
            ))}
      </Dropdown.Menu>
    </Dropdown>
    <Button variant="danger" style={{width:'15%'}} onClick = {() => setSelectedPlayers([]) }>Clear</Button>
    <Button variant="danger" style={{width:'15%'}} onClick = {() => setPlayers(selectedPlayers) }>Search</Button>
    </div>
  );
}

export default NameSearch;
