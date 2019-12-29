const geolib = require('geolib');

const getTotalDistance = (coords) => {

  const distances = [];
  for(let i = 0; i < coords.length; i++) {
    if(i < coords.length - 1) {
      distances.push(geolib.getDistance(coords[i], coords[i + 1]), 0.1);
    }
  }

  return distances.reduce((total, current, index) => {
    return total + current;
  }, 0);
};

module.exports = getTotalDistance;
