const chalk = require('chalk');
const fs = require('fs');
const geolib = require('geolib');
const neatCsv = require('neat-csv');
const StaticMaps = require('staticmaps');

const getTotalDistance = require('./getTotalDistance');

const generateRouteImage = async (datafilePath, outputImageName) => {

  console.log(chalk.grey('----------------------------------------------'));
  console.log(chalk.grey(''));
  console.log(chalk.underline.bold(`GENERATING ROUTE MAP FOR ${datafilePath}`));
  console.log(chalk.grey(''));


  // READ CSV ================================================================
  console.log(chalk.red.bold('READING CSV FILE'));
  const data = await fs.readFileSync(datafilePath);

  console.log(chalk.green.inverse('CSV FILE READ SUCCESSFULLY'));
  console.log(chalk.red.bold('PARSING CSV FILE'));
  const jsonData = await neatCsv(data);
  console.log(chalk.green.inverse('PARSED SUCCESSFULLY'));

  // EXTRACT COORDINATES =======================================================
  console.log(chalk.red.bold('EXTRACTING COORDINATES FROM DATA'));
  const coords = jsonData.map((item) => {
    return [
      item.Longitude,
      item.Latitude,
    ]
  });

  console.log(chalk.green(`SUCCESSFULLY EXTRACTED ${chalk.magenta(coords.length)} COORDINATES`));
  // CREATE MAP ================================================================
  const options = {
    width: 800,
    height: 600
  };

  console.log(chalk.red.bold('GENERATING MAP OBJECT'));
  const map = new StaticMaps(options);

  console.log(chalk.red.bold('ADDING LINE FROM COORDINATES'));
  const line = {
    coords,
    color: 'rgba(230,0,255,0.73)',
    width: 3
  };

  map.addLine(line);

  console.log(chalk.red.bold('ADDING START AND END TEXT'));
  const startText = {
    coord: coords[0],
    text: "Start",
    size: 18,
    width: 0,
    fill: "#00f900",
    color: "#000",
    font: "Helvetica",
    anchor: "start"
  };

  map.addText(startText);

  const endText = {
    coord: coords[coords.length - 1],
    text: "End",
    size: 18,
    width: 0,
    fill: "#990000",
    color: "#000",
    font: "Helvetica",
    anchor: "start"
  };

  map.addText(endText);

  console.log(chalk.red.bold('CALCULATING MAP CENTER WITH GEO-LIB'));
  const zoom = 17;
  const center = geolib.getCenter(coords);
  console.log(chalk.green('CALCULATED A MAP CENTER COORDINATE OF: ' + chalk.magenta(JSON.stringify(center)) ));

  console.log(chalk.red.bold('RENDERING MAP'));
  await map.render(center, zoom);

  console.log(chalk.blue.bold('SAVING MAP IMAGE...'));
  await map.image.save(`outputImages/${outputImageName}.png`);

  console.log(chalk.green.inverse('IMAGE SAVED SUCCESSFULLY'));

  console.log(chalk.grey(''));

  console.log(chalk.green(`TOTAL ROUTE DISTANCE OF: ${chalk.magenta(getTotalDistance(coords).toFixed(2))} METERS`));

  console.log(chalk.grey(''));
  console.log(chalk.grey('----------------------------------------------'));
  console.log(chalk.grey(''));
};

module.exports = generateRouteImage;
