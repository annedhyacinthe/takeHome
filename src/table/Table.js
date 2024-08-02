// import './Table.css';
import { FilterContext } from '../FilterContext'
import React, { useContext, useState } from 'react';
import data from '../data/props.json'
import alternateData from '../data/alternates.json'
function Table() {
  const { players, positions, statType, status, team } = useContext(FilterContext)
  console.log('position: ',positions,' stattype: ',statType,' status ',status,' players ',players)
  const [playersBeingShowed, setPlayersBeingShowed] = useState({});

  function getPlayersToBeShowed (){
    let holder = {}
    console.log(`getPlayersToBeShowed HIT`)
    for(let i = 0; i < players.length;i++){
      console.log('PLAYER',players[i])
      let currentPlayer = players[i]
      //check position
      console.log('POSITIONS',positions)
      if(!positions[currentPlayer.position]){
        console.log('FAILED')
        continue
      }
      let currPlayerFirstIndex = findFirstIndex(currentPlayer,'data')

      let playerHolder = checkStatType(currPlayerFirstIndex,currentPlayer)
      console.log('HOLDER',playerHolder)
      let currPlayerAlternateFirstIndex = findFirstIndex(currentPlayer,'alternate')
      console.log('NOT ALT',currPlayerFirstIndex,'ALT',currPlayerAlternateFirstIndex)
      for(let i = 0; i < playerHolder.length;i++){
        // if(playerHolder[i].marketSuspended === 1){
        //   playerHolder[i].isSuspended = true
        // }else{
          let currSuspendedStatus = checkIfSuspended(playerHolder[i], currPlayerAlternateFirstIndex)
          playerHolder[i]['high'] = currSuspendedStatus.high
          playerHolder[i]['low'] = currSuspendedStatus.low
          console.log(playerHolder[i].marketSuspended,currSuspendedStatus.isSuspended)
          if(playerHolder[i].marketSuspended === 1 || currSuspendedStatus.isSuspended){
            playerHolder[i]['isSuspended'] = true
          } else { playerHolder[i]['isSuspended'] = false}
      //   }
      }
      holder[currentPlayer.playerName] = playerHolder
      console.log(holder)
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
        console.log(alternateData[i].playerName)
      console.log(player.playerName)
        console.log('BROKE 1')
        break
      }
      if(alternateData[i].statType !== player.statType && reachedSpecificStat){
        console.log('BROKE 2')
        break
      }
      if(alternateData[i].statType === player.statType){
        if(!reachedSpecificStat){
          reachedSpecificStat = true
        }
        console.log('CHECKED',alternateData[i])
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
    console.log('DATAFILE',dataFile)
    let currPlayerFirstIndex
    if(dataFile === 'data'){
      console.log('data')
      currPlayerFirstIndex =  data.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName)
    } else {
      console.log('other')
      currPlayerFirstIndex =  alternateData.findIndex((playerInstance) => playerInstance.playerName === currentPlayer.playerName)
    }
    return currPlayerFirstIndex
  }
  function checkStatType(currIndex, currentPlayer){
    //need to make points default stattype
    console.log('stat hit')
    let holderArr = []
    let types = Object.keys(statType)
    for(let i = 0; i < types.length; i++ ){
      console.log('DATA TYPE',types,currIndex)
      console.log(data[32])
      
      console.log('CURRENT',currentPlayer,currIndex)
        for(let c = currIndex; c <= data.length;c++){
          console.log(data[c])
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

  getPlayersToBeShowed()
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