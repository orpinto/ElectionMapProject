import * as d3 from 'd3';
import abbreviations from '../static/abbreviations.json';


const blue = '#3480eb', red = '#eb4034';

//initate map 
const createMap = (indexState, handleBoardClick) => {

    const { width, height, scale, electionResult, usStates } = indexState;

    var projection = d3
      .geoAlbersUsa()
      .translate([width / 2, height / 2]) // translate to center of the screen
      .scale([scale]); //scale to show entire map

    var path = d3.geoPath().projection(projection);

    //draw state map with colors based on election results
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
        .attr('class', (d) => {
          return `${d.properties.NAME.replace(/\s+/g,'')}`;
        })
        .attr('d', path)
        .style('stroke', 'white')
        .style('stroke-width', '1')
        .style('fill', addStateColor)
        .on('click', handleBoardClick);

        function addStateColor(d, i) {  // This will change toggle between D and R once decided
            const { NAME } = d.properties;
            if (!electionResult[NAME]){
                return 'grey';
            } 
            if(electionResult[NAME].Trump > 0) {
                return red;
            }
            else return blue;
        }; 

        //adding state names to map
        d3.selectAll('.states')
          .selectAll('text')
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
          .attr('font-size','12px')
          .attr('font-family','arial'); 
    });

}

//update map for vote result changes
const updateMap = (indexState, stateToUpdate) => {
  const { width, height, scale, electionResult, usStates } = indexState;
  d3.select(`.${stateToUpdate.replace(/\s+/g,'')}`)
    .style('fill', () => {
      if (!electionResult[stateToUpdate]){
        return 'grey';
      } 
      if(electionResult[stateToUpdate].Trump > 0) {
          return red;
      }
      else {
        return blue;
    }});
}

export {createMap, updateMap};