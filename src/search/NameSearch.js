import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import React, {
  useContext, useState, useEffect, useCallback, useRef,
} from 'react';
import debounce from 'lodash.debounce';
import { FilterContext } from '../FilterContext';
import data from '../data/props.json';

function NameSearch() {
  const [currName, setCurrName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [filteredPlayers, setFilteredPlayers] = useState({});
  const [selectedTeams, setSelectedTeams] = useState({});
  const [filteredTeams, setFilteredTeams] = useState({});
  const [teams, setTeams] = useState({ Lakers: {}, Warriors: {} });
  const selectedPlayersRef = useRef({});
  const selectedTeamsRef = useRef({});
  const { setPlayers } = useContext(FilterContext);

  function addPlayersToTeams(player) {
    if (!teams[player.teamNickname][player.playerName]) {
      teams[player.teamNickname][player.playerName] = player;
      setTeams({ ...teams });
    }
  }

  function fetchNames(name) {
    const namesSeen = new Set();

    Object.keys(selectedPlayersRef.current).forEach((player) => {
      namesSeen.add(player);
    });

    Object.keys(selectedTeamsRef.current).forEach((team) => {
      namesSeen.add(team);
    });

    const filteredTeamData = {};
    Object.keys(teams).forEach((teamName) => {
      if (teamName.toLowerCase().includes(name.toLowerCase())) {
        if (!namesSeen.has(teamName)) {
          filteredTeamData[teamName] = true;
        }
      }
    });
    setFilteredTeams(filteredTeamData);
    const filteredPlayerData = {};
    for (let i = 0; i < data.length; i++) {
      const person = data[i];
      if (person.playerName.toLowerCase().includes(name.toLowerCase())) {
        if (!namesSeen.has(person.playerName)) {
          addPlayersToTeams(person);
          filteredPlayerData[person.playerName] = person;
        }
      }
    }
    setFilteredPlayers(filteredPlayerData);
  }

  const debounceFilter = useCallback(
    debounce((val) => {
      fetchNames(val);
    }, 50),
    [],
  );

  function helper(curr) {
    setCurrName(curr);
    debounceFilter(curr);
  }

  function deleteAll(holder, team) {
    Object.values(team).forEach((player) => {
      delete holder[player.playerName];
    });
    return holder;
  }

  function selectAll(action, team) {
    if (action === 'add') {
      if (teams[team]) {
        setSelectedPlayers({ ...selectedPlayers, ...teams[team] });
        setFilteredPlayers(deleteAll(filteredPlayers, teams[team]));
        setSelectedTeams({ ...selectedTeams, [team]: true });
        delete filteredTeams[team];
        setFilteredTeams({ ...filteredTeams });
      } else { //Select All
        setSelectedPlayers({ ...selectedPlayers, ...filteredPlayers });
        setFilteredPlayers({});
        setSelectedTeams({ ...selectedTeams, ...filteredTeams });
        setFilteredTeams({});
      }
    } else if (teams[team]) {
      setSelectedPlayers(deleteAll(selectedPlayers, teams[team]));
      setFilteredPlayers({ ...filteredPlayers, ...teams[team] });
      delete selectedTeams[team];
      setSelectedTeams({ ...selectedTeams });
      setFilteredTeams({ ...filteredTeams, [team]: true });
    } else {
      setSelectedPlayers({});
      setFilteredPlayers({ ...selectedPlayers, ...filteredPlayers });
      setSelectedTeams({});
      setFilteredTeams({ ...filteredTeams, ...selectedTeams });
    }
  }

  function renderPlaceHolder() {
    const playerArr = Object.keys(selectedPlayers);
    if (selectedPlayers && playerArr.length > 0) {
      return playerArr.length > 1 ? `${playerArr[0]},${playerArr[1]}` : `${playerArr[0]}`;
    }
    return 'Player or Team Name';
  }

  useEffect(() => {
    fetchNames(currName);
  }, []);

  useEffect(() => {
    //Needed inorder to keep data persisting when component is reloaded
    selectedPlayersRef.current = selectedPlayers;
    selectedTeamsRef.current = selectedTeams;
  }, [selectedPlayers, selectedTeams]);

  function handleCheck(action, player) {
    if (action === 'add') {
      delete filteredPlayers[player.playerName];
      setFilteredPlayers({ ...filteredPlayers });
      setSelectedPlayers({ ...selectedPlayers, [player.playerName]: player });
    } else {
      delete selectedPlayers[player.playerName];
      setSelectedPlayers({ ...selectedPlayers });
      setFilteredPlayers({ ...filteredPlayers, [player.playerName]: player });
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Dropdown style={{ display: 'grid', width: '67%' }} autoClose="outside">
        <Dropdown.Toggle style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0px 12px', border: '0px',
        }}
        >
          <Form.Control
            type="search"
            placeholder={renderPlaceHolder()}
            className="me-2"
            aria-label="Search"
            value={currName}
            style={{ boxShadow: 'none', borderColor: 'transparent' }}
            onChange={(e) => {
              helper(e.target.value);
            }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: '100%', height: '300px' }} autoClose="outside">
          <div style={{ height: '250px', overflow: 'scroll' }}>
            {(selectedPlayers && Object.keys(selectedPlayers).length > 0) || (selectedTeams && Object.keys(selectedTeams).length > 0) ? (
              <>
                <text style={{ fontSize: '80%', color: 'gray', marginLeft: '5px' }}>Selected</text>
                {Object.keys(selectedTeams).map((team) => (
                  <Dropdown.Item onClick={() => selectAll('delete', team)}>
                    {team}
                  </Dropdown.Item>
                ))}
                {Object.keys(selectedPlayers).map((person) => (
                  <Dropdown.Item onClick={() => handleCheck('delete', selectedPlayers[person])} key={selectedPlayers[person].playerId}>
                    {selectedPlayers[person].playerName}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider style={{ marginBottom: '0px' }} />
              </>
            ) : null}
            {(filteredPlayers && Object.keys(filteredPlayers).length > 0) || (filteredTeams && Object.keys(filteredTeams).length > 0) ? (
              <>
                <text style={{ fontSize: '80%', color: 'gray', marginLeft: '5px' }}>Unselected</text>
                {Object.keys(filteredTeams).map((team) => (
                  <Dropdown.Item onClick={() => selectAll('add', team)}>
                    {team}
                  </Dropdown.Item>
                ))}
                {Object.keys(filteredPlayers).map((person) => (
                  <Dropdown.Item key={filteredPlayers[person].playerId} onClick={() => handleCheck('add', filteredPlayers[person])}>
                    {filteredPlayers[person].playerName}
                  </Dropdown.Item>
                ))}
              </>
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button style={{ width: '48%' }} onClick={() => selectAll('add', 'everyone')} variant="danger">Select All</Button>
            <Button style={{ width: '48%' }} onClick={() => selectAll('delete', 'everyone')} variant="danger">Unselect All</Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <Button variant="danger" style={{ width: '30%' }} onClick={() => setPlayers(Object.values(selectedPlayers))}>Search</Button>
    </div>
  );
}

export default NameSearch;
