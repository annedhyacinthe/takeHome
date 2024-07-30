// import './Table.css';
import { FilterContext } from '../FilterContext'
import React, { useContext } from 'react';

function Table() {
  const { players } = useContext(FilterContext)
  return (
      <table style = {{width: '100%'}}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Position</th>
            <th>Type</th>
            <th>Line</th>
            {/* <th>High</th>
            <th>Low</th> */}
          </tr>
        </thead>
        <tbody>
        {players.map((person) =>(
            <tr className="Row-style">
                <td>{person.teamNickname}</td>
                <td>{person.playerName}</td>
                <td>{person.position}</td>
                <td>{person.statType}</td>
                <td>{person.line}</td>
                {/* <td>{person.}</td>
                <td>{person.}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

  );
}

export default Table;