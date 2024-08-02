import React, { createContext, useState } from 'react';

export const FilterContext = createContext()
export const FilterProvider = ({ children }) => {
    const [positions, setPositions] = useState({});
    const [statType, setStatType] = useState({});
    const [status, setStatus] = useState({});
    const [team, setTeam] = useState({});
    const [players, setPlayers] = useState([]);

    return(
        <FilterContext.Provider value={{positions, setPositions, status, setStatus, team, setTeam, players, setPlayers, statType, setStatType}}>
            {children}
        </FilterContext.Provider>
    )
  }