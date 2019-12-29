const path = require('path');
const generateRouteImage = require('./src/generateMapImage');

const generate = async () => {
  await generateRouteImage(path.join('.','data','EmergencyLog1.csv'), 'Log1Route');
  await generateRouteImage(path.join('.','data','EmergencyLog2.csv'), 'Log2Route');
};

generate();

