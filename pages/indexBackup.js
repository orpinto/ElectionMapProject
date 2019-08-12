import React, { Component } from 'react';
import * as d3 from 'd3';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usStates: [{
        name: 'Alabama',
        winner: 'Trump',
        votes: 9,
      },
      {
        name: 'Alaska',
        winner: 'undecided',
        votes: 3,
      }],
      width : 900,
      height: 600,
      scale: 1000
    };
  }
  componentDidMount() {
    this.createMap();
    //this.createSwitchBoard();
  }

  createMap() {
    this.drawMap();
  }
  
  // createSwitchBoard() {
  //   this.drawSwitchBoard();
  // }

  handleButtonClick = () => this.drawMap();

  drawMap() {
    const { usStates, width, height, scale } = this.state;
    const red = '#3480eb', blue = '#eb4034';
    const abbreviations = {
      "Alabama": "AL",
      "Alaska": "AK",
      "American Samoa": "AS",
      "Arizona": "AZ",
      "Arkansas": "AR",
      "California": "CA",
      "Colorado": "CO",
      "Connecticut": "CT",
      "Delaware": "DE",
      "District Of Columbia": "DC",
      "Federated States Of Micronesia": "FM",
      "Florida": "FL",
      "Georgia": "GA",
      "Guam": "GU",
      "Hawaii": "HI",
      "Idaho": "ID",
      "Illinois": "IL",
      "Indiana": "IN",
      "Iowa": "IA",
      "Kansas": "KS",
      "Kentucky": "KY",
      "Louisiana": "LA",
      "Maine": "ME",
      "Marshall Islands": "MH",
      "Maryland": "MD",
      "Massachusetts": "MA",
      "Michigan": "MI",
      "Minnesota": "MN",
      "Mississippi": "MS",
      "Missouri": "MO",
      "Montana": "MT",
      "Nebraska": "NE",
      "Nevada": "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      "Northern Mariana Islands": "MP",
      "Ohio": "OH",
      "Oklahoma": "OK",
      "Oregon": "OR",
      "Palau": "PW",
      "Pennsylvania": "PA",
      "Puerto Rico": "PR",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      "Tennessee": "TN",
      "Texas": "TX",
      "Utah": "UT",
      "Vermont": "VT",
      "Virgin Islands": "VI",
      "Virginia": "VA",
      "Washington": "WA",
      "West Virginia": "WV",
      "Wisconsin": "WI",
      "Wyoming": "WY"
      }


    //D3 projection
    var projection = d3
      .geoAlbersUsa()
      .translate([width / 2, height / 2]) // translate to center of the screen
      .scale([scale]); //scale to show entire map

    var path = d3.geoPath().projection(projection);

    d3.json('static/us-states.json').then(function(json) {
      d3.select('.svg-content').remove();

      d3.select('.svg-container')//this is the div with child element svg
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('preserveAspectRatio','xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('class', 'svg-content')
        .append('g')
        .attr('class', 'states')
        .selectAll('path')
        .remove()
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke', 'white')
        .style('stroke-width', '1')
        .style('fill', function(d) {
          if(d.properties.party == undefined) return 'grey';
          var value = d.properties.party;
          if (value === 'R') {
            return red;
          } else {
            return blue;
          }
        })
        .on('click', handleClick);

        function handleClick(d) {  // This will change toggle between D and R once decided
          if(d.properties.party == 'R' || d.properties.party == undefined){
              d.properties.party = 'D';
              d3.select(this).style('fill', blue);
          }
          else if(d.properties.party == 'D'){
              d.properties.party = 'R';
              d3.select(this).style('fill', red);
          }  
        };

        //adding state names to map
        d3.selectAll('.states')
          .selectAll('text')
          .remove()
          .data(json.features)
          .enter()
          .append("text")
          .text((d) => {
            return abbreviations[d.properties.NAME];
          })
          .attr("x", (d) => path.centroid(d)[0])
          .attr("y", (d) => path.centroid(d)[1])
          .attr("text-anchor","middle") 
          .attr("font-weight", "bold") 
          .attr('fill', 'white')
          .attr('font-size','12px'); 
    });
  }


  handleVoteChange(i, winner) {
    const usStates = [...this.state.usStates];
    usStates[i].winner = winner;

    this.setState({usStates});
  }

  render() {
    return (
      <div className="App">
        <div className='roadto270-game'>
          <div id='header-svg'></div>
          <header id='roadto270-header'>
            <h1 id='title' style={{fontFamily: 'arial'}}>2020 Election</h1>
            <div>ICONS</div>
          </header>
          <div className="svg-container">
            <text className='reset' onClick={this.handleButtonClick}>reset</text>
          </div>
          {JSON.stringify(this.state)}
          {this.state.usStates.map((usState, index) => {
            return <div>
              <div onClick={() => {this.handleVoteChange(index, 'Trump')}}>trump</div>
              <div onClick={() => {this.handleVoteChange(index, "undecided")}}>undecided</div>
              <div onClick={() => {this.handleVoteChange(index,"Hillary")}}>hillary</div>
            </div>
          })}
          {/* <div className='switchBoard'></div> */}
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
            .switchBoard {
              width: 100%
              border: solid green 2px;
            }
            @media only screen and (min-width: 960px) {
              .roadto270-game{
                width: 960px;;
              }
              #roadto270-header {
                width: 960px;
              }
              .switchBoard{
                width: 960px;;
              }
         }
          
          `}</style>
        </div>
      </div>
    );
  }
}
export default App;