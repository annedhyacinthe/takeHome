import React, { useContext, useState, useEffect } from 'react';
import { FilterContext } from '../FilterContext';
import data from '../data/props.json';
import alternateData from '../data/alternates.json';

function Table() {
  const {
    players, positions, statType, status,
  } = useContext(FilterContext);

  const [playersBeingShowed, setPlayersBeingShowed] = useState({});

  function getPlayersToBeShowed() {
    const holder = {};
    for (let i = 0; i < players.length; i++) {
      const currentPlayer = players[i];

      //Check Position
      if (!isPositionSelected(currentPlayer)) {
        continue;
      }

      const currPlayerPropFirstIndex = findFirstIndex(currentPlayer, 'data');

      // check stat type selected
      const playerHolder = checkStatType(currPlayerPropFirstIndex, currentPlayer);
      const currPlayerAlternateFirstIndex = findFirstIndex(currentPlayer, 'alternate');

      // check if suspended
      for (let i = 0; i < playerHolder.length; i++) {
        const currSuspendedStatus = checkIfSuspended(playerHolder[i], currPlayerAlternateFirstIndex);
        playerHolder[i].high = currSuspendedStatus.high;
        playerHolder[i].low = currSuspendedStatus.low;

        if (playerHolder[i].marketSuspended === 1 || currSuspendedStatus.isSuspended) {
          playerHolder[i].isSuspended = true;
          playerHolder[i].shownAsSuspended = true;
        } else {
          playerHolder[i].isSuspended = false;
          playerHolder[i].shownAsSuspended = false;
        }
      }
      //Checks if item should show depending on suspension status selected
      holder[currentPlayer.playerName] = playerHolder.filter((stat) => checkSelectedStatus(stat));

      if (holder[currentPlayer.playerName].length === 0) {
        delete holder[currentPlayer.playerName];
      }
    }
    setPlayersBeingShowed(holder);
  }

  function isPositionSelected(currentPlayer) {
    return !(Object.keys(positions).length && !positions[currentPlayer.position]);
  }

  function checkSelectedStatus(stat) {
    if (status['Not Suspended'] || status.Suspended) {
      return status.Suspended && stat.isSuspended || status['Not Suspended'] && !stat.isSuspended;
    }
    return true;
  }

  function checkIfSuspended(player, currIndex) {
    let marketLineExist = false;
    let highProbabilityExist = false;
    let reachedSpecificStat = false;
    let high = -Infinity;
    let low = Infinity;
    for (let i = currIndex; i < alternateData.length; i++) {
      if (alternateData[i].playerName !== player.playerName) {
        break;
      }
      if (alternateData[i].statType !== player.statType && reachedSpecificStat) {
        break;
      }
      if (alternateData[i].statType === player.statType) {
        if (!reachedSpecificStat) {
          reachedSpecificStat = true;
        }
        high = Math.max(high, alternateData[i].line);
        low = Math.min(low, alternateData[i].line);
        if (alternateData[i].line === player.line) {
          marketLineExist = true;
          const altData = alternateData[i];
          if (altData.underOdds >= 0.4 || altData.overOdds >= 0.4 || altData.pushOdds >= 0.4) {
            highProbabilityExist = true;
          }
        }
      }
    }
    return { high: high === -Infinity ? '' : high, low: low === Infinity ? '' : low, isSuspended: !marketLineExist || !highProbabilityExist };
  }

  function findFirstIndex(currentPlayer, dataFile) {
    let currPlayerFirstIndex;
    if (dataFile === 'data') {
      currPlayerFirstIndex = data.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName);
    } else {
      currPlayerFirstIndex = alternateData.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName);
    }
    return currPlayerFirstIndex;
  }

  function checkStatType(currIndex, currentPlayer) {
    const holderArr = [];
    const types = Object.keys(statType);
    if (!types.length) {
      return [data[currIndex]];
    }
    for (let i = 0; i < types.length; i++) {
      for (let c = currIndex; c <= data.length; c++) {
        if (data[c] && currentPlayer.playerName === data[c].playerName && types[i].toLowerCase() === data[c].statType) {
          holderArr.push(data[c]);
        }
        if (data[c] && currentPlayer.playerName !== data[c].playerName) {
          break;
        }
      }
    }
    return holderArr;
  }

  const toggleSuspension = (player, index) => {
    const playersCopy = { ...playersBeingShowed };
    playersCopy[player][index].shownAsSuspended = !playersCopy[player][index].shownAsSuspended;
    setPlayersBeingShowed(playersCopy);
  };

  useEffect(() => {
    getPlayersToBeShowed();
  }, [players, positions, statType, status]);

  function renderMessage() {
    if (players.length === 0) {
      return <div style={{ marginTop: '200px', fontSize: 'large', textAlign: 'center' }}>Choose a Player or Team</div>;
    }
    if (Object.keys(playersBeingShowed).length === 0) {
      return <div style={{ marginTop: '200px', fontSize: 'large', textAlign: 'center' }}>Check Filters</div>;
    }
  }

  return (
    <div style={{ height: '500px', overflowY: 'scroll' }}>
      <table style={{ width: '100%' }}>
        <thead style={{ position: 'sticky', top: '0', backgroundColor: 'antiquewhite' }}>
          <tr>
            <th>Team</th>
            <th>Player</th>
            <th>Position</th>
            <th>Type</th>
            <th>Line</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          { Object.keys(playersBeingShowed).length > 0
      && Object.keys(playersBeingShowed).map((playerArrKey) => playersBeingShowed[playerArrKey].map((playerCurrentStat, index) => (
        <tr
          className={`Row-style ${playerCurrentStat.shownAsSuspended && 'Suspended'}`}
          onClick={() => {
            toggleSuspension(playerArrKey, index);
          }}
        >
          <td>{playerCurrentStat.teamNickname}</td>
          <td>{playerCurrentStat.playerName}</td>
          <td>{playerCurrentStat.position}</td>
          <td>{playerCurrentStat.statType}</td>
          <td>{playerCurrentStat.line}</td>
          <td>{playerCurrentStat.high}</td>
          <td>{playerCurrentStat.low}</td>
        </tr>
      )))}
        </tbody>
      </table>
      {Object.keys(playersBeingShowed).length === 0 && renderMessage()}
    </div>
  );
}

export default Table;
