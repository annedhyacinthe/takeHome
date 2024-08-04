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
    const selectedPlayersRef = useRef(selectedPlayers);
    const { setPlayers } = useContext(FilterContext)

    function helper(curr){
        setCurrName(curr)
        debounceFilter(curr)
    }

    const debounceFilter = useCallback (
        debounce((val) => {fetchNames(val)
        },50),
        []
    )

    function fetchNames(name){
        let namesSeen = new Set()
    
        selectedPlayersRef.current.forEach(player => {
        namesSeen.add(player.playerName);
        });
        
        const filteredData = data.filter((person) => {
            if(person.playerName.toLowerCase().includes(name.toLowerCase())){
                if(!namesSeen.has(person.playerName)){
                    namesSeen.add(person.playerName)
                    return person
                }
            }
            })
        setFilteredPlayers(filteredData)
    }
    
    useEffect(() => {
        selectedPlayersRef.current = selectedPlayers;
        fetchNames(currName);
      }, [selectedPlayers]);

    function handleCheck (list,player){
        let index = list === 'filtered' ? filteredPlayers.findIndex((curr) => curr.playerId === player.playerId) :
         selectedPlayers.findIndex((curr) => curr.playerId === player.playerId)
        if(-1 < index){
            if (list === 'filtered'){
                let holder = filteredPlayers
                holder.splice(index,1)
                setFilteredPlayers([...holder])
                setSelectedPlayers([...selectedPlayers,player])
            } else {
                let holder = selectedPlayers
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
                    }
                }
                onClick={(e) => {
                    if (dropdownRef.current.classList.contains("show")){
                        e.stopPropagation()
                    }
                }}
                />
            </Dropdown.Toggle>

            <Dropdown.Menu style = {{width: '100%',height:'300px'}} autoClose="outside" >
            <div style={{height:'250px',overflow: 'scroll'}}>
                {selectedPlayers && 0 < selectedPlayers.length && (
                    <>
                        <text style={{ fontSize: '80%', color: 'gray', marginLeft: '5px' }}>Selected</text>
                        {selectedPlayers.map((person) => (
                            <Dropdown.Item href="#/action-1" onClick={() => handleCheck('selected', person)} key={person.playerName}>
                                {person.playerName}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider style={{ marginBottom: '0px' }} />
                    </>
                )}
                {filteredPlayers && 0 < filteredPlayers.length && (
                    <>
                        <text style = {{fontSize: '80%', color: 'gray', marginLeft: '5px'}}>Unselected</text>
                        {filteredPlayers.map((person) =>(
                            <Dropdown.Item href="#/action-1" key={person.playerId} onClick = {() => handleCheck('filtered',person) }>
                                {person.playerName}
                        </Dropdown.Item>
                    ))}
                    </>
                )}
            </div>
            <div style={{display:'flex',justifyContent:'space-evenly'}}>
                <Button style={{width:'48%'}} variant="danger">Select All</Button>
                <Button style={{width:'48%'}} variant="danger">Unselect All</Button>
            </div>
            </Dropdown.Menu>
        </Dropdown>
        <Button variant="danger" style={{width:'15%'}} onClick = {() => setSelectedPlayers([]) }>Clear</Button>
        <Button variant="danger" style={{width:'15%'}} onClick = {() => setPlayers(selectedPlayers) }>Search</Button>
        </div>
    );
}

export default NameSearch;
