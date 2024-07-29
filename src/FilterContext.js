import React, { createContext, useState } from 'react';

export const FilterContext = createContext()
export const FilterProvider = ({ children }) => {
    const [position, setPosition] = useState([]);
    const [statType, setStatType] = useState([]);
    const [status, setStatus] = useState([]);
    const [team, setTeam] = useState([]);
    const [players, setPlayers] = useState([]);

    return(
        <FilterContext.Provider value={{position, setPosition, status, setStatus, team, setTeam, players, setPlayers, statType, setStatType}}>
            {children}
        </FilterContext.Provider>
    )
  }