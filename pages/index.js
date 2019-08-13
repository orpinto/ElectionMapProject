import React, { Component } from 'react';
import { createMap, updateMap } from '../components/map.js';
import electionResults from '../static/election-results.json';
import { createBoard, updateBoard } from '../components/board.js';
import collection from '../static/us-states.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width : 900,
      height: 600,
      scale: 1000,
      // Below maps array into object for easier lookup
      electionResult: electionResults.reduce((results, usState) => {
        results[usState.StateName] = usState;
        return results;
      }, {}),
      usStates: [collection.features],
    };
  }
  
  //handle board and map clicks
  handleBoardClick = (usState, usState2) => {
    const usStateName = usState? usState.properties.NAME : usState2.StateName;
    const previousResult = this.state.electionResult[usStateName];
    const newElectionResult = { ...this.state.electionResult};
    const { StateVotes, Trump } = newElectionResult[usStateName];
    if (Trump > 0) {
      newElectionResult[usStateName].Trump = '-';
      newElectionResult[usStateName].Clinton = StateVotes;
    } else {
      newElectionResult[usStateName].Trump = StateVotes;
      newElectionResult[usStateName].Clinton = '-';
    }
    this.setState({ electionResult: newElectionResult });
    updateMap(this.state, usStateName);
    updateBoard(this.state, usStateName, previousResult);
  }

  componentDidMount() {
    createMap(this.state, this.handleBoardClick);
    createBoard(this.state, this.handleBoardClick);
  }

  //define
  handleReset = () => {}

  tallyCandidateVotes(candidate) {
   
    return electionResults.reduce((result, state) => {
      if (!isNaN(state[candidate])) {
        result = result + state[candidate];
      }
      return result;
    }, 0);
  }

  render() {
    const blue = '#3480eb', red = '#eb4034';

    return (
      <div className="App">
        <div className='roadto270-game'>
          <header id='roadto270-header'>
          <svg className='headerAccent' width="100%" height="10" >
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color={red} stop-opacity='1' />
                <stop offset="100%" stop-color={blue} stop-opacity='1' />
                </linearGradient>
            </defs>
            <rect width="100%"  fill="url(#grad1)" />
          </svg>
            <h1 id='title' style={{fontFamily: 'arial'}}>2020 Election</h1>
            <div id='icons' style={{fontFamily: 'arial'}}>ICONS</div>
          </header>
          <div className="svg-container">
            <text className='reset' style={{fontFamily: 'arial'}} onClick={this.handleReset}>reset</text>
          </div>
          <div className='svg-candidate'>
            <div style={{fontFamily: 'arial', color: red }}>
            {`Trump: ${this.tallyCandidateVotes('Trump')}`}
            </div>
            <div style={{fontFamily: 'arial', color: blue }}>
              {`Clinton: ${this.tallyCandidateVotes('Clinton')}`}
            </div>
          </div>
          <div className='svg-board'></div>
          <style jsx>{`
            .roadto270-game {
              display: flex;
              flex-direction: column;
              width: 100%;
            }
            #roadto270-header {
              display: flex;
              position: sticky;
              flex-direction: column;
              justify-content: center;
              width: 100%;
              padding-top: 0px;
              padding-bottom: 10px;
              background-color: rgb(220, 220, 220);
            }
            .headerAccent {
              width: 100%
            }
            #title {
              align-self: left;
              text-align: left;
              color: black;
              top: 0;
              margin-left: 5px;
            }
            #icons {
              margin-left: 5px;
            }
            .svg-container { 
              display: inline-block;
              position: relative;
              width: 100%;
              padding-bottom: 0%;
              vertical-align: top;
              overflow: hidden;
            }
            .svg-content { 
              display: inline-block;
              position: absolute;
              top: 0;
              left: 0;
            }
            .svg-candidate {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 100%
              margin: 0;
              padding-bottom: 25px;
              font-weight: bold;
              font-size: 25px;
            }
            .svg-board { 
              display: inline-block;
              position: relative;
              width: 100%;
              padding-bottom: 0%;
              vertical-align: top;
              overflow: hidden;
            }
            .board-content { 
              display: inline-block;
              position: absolute;
              top: 0;
              left: 0;
            }
            @media only screen and (min-width: 960px) {
              .roadto270-game{
                width: 960px;
              }
              #roadto270-header {
                width: 960px;
              }
              .headerAccent {
                width: 960px
              }
         }
          `}</style>
        </div>
      </div>
    );
  }
}
export default App;







