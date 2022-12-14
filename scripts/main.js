// Our bundler automatically creates styling when imported in the main JS file!
import CONFIG from '../scripts/config.js';
import request from '../scripts/request.js';

/* IMPORTS */ 
import '../styles/style.scss'
import '../styles/popup.scss'
import '../styles/starrynight.scss'

/* IMPORT */ 
import '../scripts/cursorTracker.js'
import '../scripts/popUp.js'

// We can use node_modules directely in the browser!
import * as d3 from 'd3';

async function start() {
  const data = await request(CONFIG.url);
 
/* 
  First we select what we would like to return in the table alongside a filter, because we do not want to show everything. I filtered on i.bodytype, because i wanted to be able to filter on the planets inside our solar system without selecting the moons and dwarfplanets. 
*/

  const allPlanetsTable = data.bodies.map(i => {
    return {
        id: i.id,
        englishName: i.englishName,
        bodyType: i.bodyType,
        gravity: i.gravity, 
        radius: i.equaRadius
    }
      
  }).filter (i => {
      return i.id; // because i want to return all id's within the API. 
    })
    
/* 
    We generate to generate the table, and we start with selecting the table properties. 
*/

  function generateTable(t) {
    let tHeading = document.querySelector('thead tr'); 
    let tBody = document.querySelector('tbody') 


     Object.keys(t[0]).forEach(i => {
        let newElement = document.createElement('th');
        newElement.textContent = i;
        tHeading.appendChild(newElement);

     })

     t.forEach(i => {
      let tr = document.createElement('tr');
      tBody.appendChild(tr);

      for (const [j, t] of Object.entries(i)) {
              let td = document.createElement('td');
              td.textContent = t; 
              tr.appendChild(td) 
      }
    })
}

generateTable(allPlanetsTable);

// this is the data I want to use within the tooltip, when hovering over a planet.

  const allPlanets = data.bodies.map(i => {
    return {
        englishName: i.englishName,
        bodyType: i.bodyType,
        gravity: i.gravity,
        radius: i.equaRadius,
        density: i.density,
        discoveryDate: i.discoveryDate,
        discoveredBy: i.discoveredBy
    }
  }).filter (i => {
    return i.bodyType === "Planet";
  })

function showCommon() {

//  there was no data for the distances in the API, so I found my own data to use.

const planetData = [{
  // Mercury
  "distance": "57.9"
  },
  {
    // Venus
    "distance": "108.2"
  },
                 {
    // Earth
    "distance": "149.6"
  },
                 {
    // Mars
    "distance": "227.9"
  },
                 {
    // jupiter
    "distance": "778.3"
  },
                 {
    // Saturn
    "distance": "1427"
  },
                 {
    // Uranus
    "distance": "2871"
  },
                 {
    // Neptune
    "distance": "4497.1"
  }]

  // 

 const height = 600;
 const width = 1500;

 // create an array for the radius
const radius = allPlanets.map(function(planet) {
  return planet.radius
})

// create an array for the distances
const distances = planetData.map(function(planet) {
  return planet.distance
})

// x axis for the linear radius in /km
const radiusAxis = d3.scaleLinear()
    .domain([Math.min.apply(Math, radius) - 9000, Math.max.apply(Math, radius)])
    .range([0, width*0.9]);

// y axis for the log distance in /million km
const distanceAxis = d3.scaleLog()
    .domain([Math.max.apply(Math, distances) + 1500, Math.min.apply(Math, distances)])
    .range([0, height*0.9]);

  const svg = d3.select(".planets")
  .attr("width", width)
  .attr("height", height)

  // using the planetData data to get the distances right

  svg.select("#groupPlanets").selectAll("circle")
  .data(planetData)
  .join("circle")
  .attr('cy', function(i) { return distanceAxis(i.distance)})
  .on("mouseover", (e, i) => d3.select("#tooltip")
  .html
  ("<h1>Planet Data </h1>" + "<p> English name: " + i.englishName + "</p>" + "<p> Bodytype: " + i.bodyType + "</p>" + "<p>Gravity: " + i.gravity + "</p>" + "<p>Density: " + i.density + "</p>" + "<p>Discovery date: " + i.discoveryDate + "</p>" + "<p>Discovered by: " + i.discoveredBy + "</p>" )
  .transition()
  .duration(175)
  .style("opacity", 1)
  .attr("transform", "translate(" + -22 + "," + -28.5 + ")")
)

/* When you move your mouse over <circle> we adjust the position of the tooltip. Because 
we want the tooltip to be next to the cursor, we add 15px. */ 

    .on("mousemove", (e) =>
      d3
        .select("#tooltip")
        .style("left", e.pageX + 15 + "px")
        .style("top", e.pageY + 15 + "px")
    )
  .on("mouseout", e => d3.select("#tooltip").style("opacity", 0) // hides tooltip when moving outside the selected area
);

  d3.select("body").on("touchend", e => d3.select("#tooltip").style("opacity", 0)); // hides tooltip on tap outside radius

  svg.select("#groupPlanets").selectAll("circle")
  .data(allPlanets)
  .attr('cx', function(i) { return radiusAxis(i.radius)})
  .attr('r', function(i) { return radiusAxis(i.radius)/6})

  // search for javascript switch code
  /* We defined images in the html with an ID, in the switch statement we connect the image to the fill */
  
  .attr("fill",  (i) => { 
    switch(i.englishName) {
      case "Venus":
      return "url(#Venus)";

      case "Earth":
      return "url(#Earth)";

      case "Saturn":
      return "url(#Saturn)";

      case "Mercury":
      return "url(#Mercury)";

      case "Mars":
      return "url(#Mars)";
  
      case "Jupiter":
      return "url(#Jupiter)";

      case "Neptune":
      return "url(#Neptune)";

      case "Uranus":
      return "url(#Uranus)";
    }
  })
}
showCommon();
  

  /* END OF */
}
start();
