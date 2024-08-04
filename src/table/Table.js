// import './Table.css';
import { FilterContext } from '../FilterContext'
import React, { useContext, useState, useEffect } from 'react';
import data from '../data/props.json'
import alternateData from '../data/alternates.json'
function Table() {
  const { players, positions, statType, status } = useContext(FilterContext)
  const [playersBeingShowed, setPlayersBeingShowed] = useState({});

  function getPlayersToBeShowed (){
    let holder = {}
    for(let i = 0; i < players.length;i++){
      let currentPlayer = players[i]

      //check positions selected
      if(Object.keys(positions).length && !positions[currentPlayer.position]){
        continue
      }
      
      let currPlayerPropFirstIndex = findFirstIndex(currentPlayer,'data')
      //check stat type selected
      let playerHolder = checkStatType(currPlayerPropFirstIndex,currentPlayer)
      let currPlayerAlternateFirstIndex = findFirstIndex(currentPlayer,'alternate')

      //check if suspended
      for(let i = 0; i < playerHolder.length;i++){
          let currSuspendedStatus = checkIfSuspended(playerHolder[i], currPlayerAlternateFirstIndex)
          playerHolder[i]['high'] = currSuspendedStatus.high
          playerHolder[i]['low'] = currSuspendedStatus.low

          if(playerHolder[i].marketSuspended === 1 || currSuspendedStatus.isSuspended){
            playerHolder[i]['isSuspended'] = true
          } else { playerHolder[i]['isSuspended'] = false}
      }
      // if(status['Suspended'] && !status['Not Suspended']){
      //   if(!playerHolder[i]['isSuspended']){
          
      //   }
      // }

      holder[currentPlayer.playerName] = playerHolder.filter((stat) => checkSelectedStatus(stat))
    }
    setPlayersBeingShowed(holder)
  }

  function checkSelectedStatus(stat){
    if(status['Not Suspended'] || status['Suspended']){
      return status['Suspended'] && stat.isSuspended || status['Not Suspended'] && !stat.isSuspended
    }else{
      return true
    }
  
  }

  function checkIfSuspended(player,currIndex){
    let marketLineExist = false
    let highProbabilityExist = false
    let reachedSpecificStat = false
    let high = -Infinity
    let low = Infinity
    for(let i = currIndex; i < alternateData.length;i++){
      if(alternateData[i].playerName !== player.playerName){
        break
      }
      if(alternateData[i].statType !== player.statType && reachedSpecificStat){
        break
      }
      if(alternateData[i].statType === player.statType){
        if(!reachedSpecificStat){
          reachedSpecificStat = true
        }
        high = Math.max(high,alternateData[i].line)
        low = Math.min(low,alternateData[i].line)
        if(alternateData[i].line === player.line){
          marketLineExist = true
          let altData = alternateData[i]
          if(.4 <= altData.underOdds || .4 <= altData.overOdds || .4 <= altData.pushOdds){
            highProbabilityExist = true
          }
        }
      }
    }
    console.log('prob',highProbabilityExist,'line',marketLineExist)
    return {'high':high,'low':low,'isSuspended': !marketLineExist || !highProbabilityExist }
  }

  function findFirstIndex (currentPlayer,dataFile){
    let currPlayerFirstIndex
    if(dataFile === 'data'){
      currPlayerFirstIndex =  data.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName)
    } else {
      currPlayerFirstIndex =  alternateData.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName)
    }
    return currPlayerFirstIndex
  }
  function checkStatType(currIndex, currentPlayer){
    //need to make points default stattype
    let holderArr = []
    let types = Object.keys(statType)
    if(!types.length){ 
      return [data[currIndex]]
     }
    for(let i = 0; i < types.length; i++ ){
        for(let c = currIndex; c <= data.length;c++){
          if(data[c] && currentPlayer.playerName === data[c].playerName && types[i].toLowerCase() === data[c].statType){
            holderArr.push(data[c])
          }
          if(data[c] && currentPlayer.playerName !== data[c].playerName){
            break
          }
        }
    }
    return holderArr
  }

  useEffect(() => {
    getPlayersToBeShowed()
  }, [players, positions, statType, status]);
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
        {
          Object.keys(playersBeingShowed).map((playerArrKey) => {
            return playersBeingShowed[playerArrKey].map((player) =>(
              <tr className="Row-style">
                  <td>{player.teamNickname}</td>
                  <td>{player.playerName}</td>
                  <td>{player.position}</td>
                  <td>{player.statType}</td>
                  <td>{player.line}</td>
              </tr>
            ))
          }) 
          }
        </tbody>
      </table>

  );
}

export default Table;

