import * as d3 from 'd3';

const blue = '#3480eb', red = '#eb4034';
const svgRectHeight = 55, svgRectWidth = 195, svgPadding = 12;

//initiate board 
const createBoard = (indexState, handleBoardClick) => {

    const { width, height, scale, electionResult, usStates } = indexState;
    const statesList = Object.keys(electionResult);
    const svgHeight = statesList.length * svgRectHeight;
    

    const svgBoard = d3.select('.svg-board')
    .append('svg')
    .attr('class', 'board-content')
    .attr('width', '100%')
    .attr('height', '200%')
    .attr('preserveAspectRatio','xMinYMin meet')
    .attr('viewBox', `0 0 ${width} ${svgHeight}`)

    for(let i = 0; i < statesList.length; i++) {  
        let stateResult = electionResult[statesList[i]];
        
        svgBoard
            .append('line')
            .attr('x1', .125 * width)
            .attr('x2', .875 * width)
            .attr('transform', `translate(0, ${svgHeight / statesList.length * i + (svgRectHeight - svgPadding) / 2})`);
        svgBoard
            .append('circle')
            .attr('r', 8)
            .attr('transform', `translate(${.125 * width}, ${svgHeight / statesList.length * i + (svgRectHeight - svgPadding) / 2})`)
            .attr('class', 'leftCircle');
        svgBoard
            .append('circle')
            .attr('r', 8)
            .attr('transform', `translate(${.875 * width}, ${svgHeight / statesList.length * i + (svgRectHeight - svgPadding) / 2})`)
            .attr('class', 'rightCircle');
        svgBoard
            .append('g')    
            .append('rect')
            .attr('class',`rect${statesList[i].replace(/\s+/g,'')}`)
            .attr('height', (svgRectHeight - svgPadding))
            .attr('width', svgRectWidth)
            .attr('transform', () => {
                if(stateResult.Trump > 0) return `translate(25, ${i * svgRectHeight})`;
                if(stateResult.Clinton > 0) return `translate(${width - svgRectWidth - 25}, ${i * svgRectHeight})`;
                if(stateResult.Trump == '-' && stateResult.Clinton == '-') {
                    return `translate(${(width / 2 - svgRectWidth / 2)}, ${i * svgRectHeight})`;
                } 
            })
            .attr('fill', () => {
                return stateResult.Trump > 0 ? red : blue;
            })
            .attr('rx', 10)
            .on('click', () => handleBoardClick('', stateResult));
        svgBoard
            .append('text')
            .attr('class',`text${statesList[i].replace(/\s+/g,'')}`)
            .text(() => {
               return statesList[i]; 
            })
            .attr("y", () => svgHeight / statesList.length * i + (svgRectHeight - svgPadding) / 1.65)
            .attr("x", () => width / 2)
            .attr('transform', () => {
                if(stateResult.Trump > 0) return `translate(-${width / 2 - svgRectWidth + 72}, 0)`;
                if(stateResult.Clinton > 0) return `translate(+${width / 2 - svgRectWidth + 72}, 0)`;
            })
            .attr("text-anchor","middle") 
            .attr("font-weight", "bold") 
            .attr('fill', 'white')
            .attr('font-size','20px')
            .attr('font-family', 'arial');
        }


    //add/change attributes for lines
    svgBoard.selectAll('line').attr('stroke', 'grey')
        .attr('stroke-width', '2');

    //add/change attributes for circles
    svgBoard.selectAll('circle').attr('fill', 'grey');
}

//update the board to respond to election result changes
const updateBoard = (indexState, stateToUpdate, previousResult) => {
    const { width, height, scale, electionResult, usStates } = indexState;
    const statesList = Object.keys(electionResult);

    //handle position change, color change, and text position change
    d3.select(`.rect${stateToUpdate.replace(/\s+/g,'')}`)
    .attr('transform', () => {
        if(previousResult.Clinton > 0){
            return `translate(${width - svgRectWidth - 25}, ${statesList.indexOf(stateToUpdate) * svgRectHeight})`
        }
        else return `translate(25, ${statesList.indexOf(stateToUpdate) * svgRectHeight})`
    })
    .attr('fill', () => electionResult[stateToUpdate].Trump > 0 ? red : blue)

    d3.select(`.text${stateToUpdate.replace(/\s+/g,'')}`)
        .attr('transform', () => {
            if(electionResult[stateToUpdate].Trump > 0) return `translate(-${width / 2 - svgRectWidth + 72}, 0)`;
            if(electionResult[stateToUpdate].Clinton > 0) return `translate(+${width / 2 - svgRectWidth + 72}, 0)`;
        })
}

export { createBoard, updateBoard };