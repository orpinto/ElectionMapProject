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
      usStates: [collection.features]
    };
  }
  
  //handle map and board clicks
  handleMapClick = usState => {
    const usStateName = usState.properties.NAME;
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

  handleBoardClick = usState => {
    const usStateName = usState.StateName;
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
    createMap(this.state, this.handleMapClick);
    createBoard(this.state, this.handleBoardClick);
  }

  handleReset = () => createMap(this.state);


  render() {
    return (
      <div className="App">
        <div className='roadto270-game'>
          <div id='header-svg'></div>
          <header id='roadto270-header'>
            <h1 id='title' style={{fontFamily: 'arial'}}>2020 Election</h1>
            <div style={{fontFamily: 'arial'}}>ICONS</div>
          </header>
          <div className="svg-container">
            <text className='reset' style={{fontFamily: 'arial'}} onClick={this.handleReset}>reset</text>
          </div>
          <div className='svg-board'></div>
          <style jsx>{`
            .roadto270-game {
              display: flex;
              border: solid red 2px;
              flex-direction: column;
              width: 100%;
            }
            #roadto270-header {
              display: flex;
              position: sticky;
              flex-direction: column;
              justify-content: center;
              border: solid pink 2px;
              width: 100%;
              padding-top: 20px;
              padding-bottom: 10px;
              background-color: rgb(220, 220, 220);
            }
            #title {
              align-self: left;
              text-align: left;
              color: black;
              top: 0;
              margin: 0px;
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
         }
          `}</style>
        </div>
      </div>
    );
  }
}
export default App;







