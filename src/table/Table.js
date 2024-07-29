// import './Table.css';
import { FilterContext } from '../FilterContext'
import React, { useContext } from 'react';

function Table() {
  const { position } = useContext(FilterContext)
  return (
      <table style = {{width: '100%'}}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Position</th>
            <th>Line</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>

          <tr className="Row-style">
              <td >Table cell 1</td>
              <td >Table cell 2</td>
              <td >Table cell 3</td>
              <td >Table cell 4</td>
              <td >Table cell 5</td>
              <td >Table cell 6</td>
            {/* ))} */}
          </tr>
        </tbody>
      </table>

  );
}

export default Table;