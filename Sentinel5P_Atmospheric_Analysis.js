/******************************
 Atmospheric Analysis using Sentinel-5P
 Location: Latitude 40.374, Longitude -125.022
 Date Range: November 1, 2021 – December 31, 2021
******************************/

// 1. Define location (California coast)
var point = ee.Geometry.Point([-125.022, 40.374]);
Map.centerObject(point, 7);
Map.addLayer(point, {color: 'red'}, 'Observation Point');

// 2. Define time window
var start = '2021-11-01';
var end = '2021-12-31';

// 3. Load Sentinel-5P atmospheric datasets

// Carbon Monoxide (CO)
var co = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_CO")
  .select("CO_column_number_density")
  .filterDate(start, end)
  .filterBounds(point);

// Nitrogen Dioxide (NO2)
var no2 = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
  .select("NO2_column_number_density")
  .filterDate(start, end)
  .filterBounds(point);

// Sulfur Dioxide (SO2)
var so2 = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_SO2")
  .select("SO2_column_number_density")
  .filterDate(start, end)
  .filterBounds(point);

// Ozone (O3)
var o3 = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_O3")
  .select("O3_column_number_density")
  .filterDate(start, end)
  .filterBounds(point);

// Aerosol Absorbing Index (AAI)
var aai = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_AER_AI")
  .select("absorbing_aerosol_index")
  .filterDate(start, end)
  .filterBounds(point);

// Methane (CH4) — may have sparse data
var ch4 = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_CH4")
  .select("CH4_column_volume_mixing_ratio_dry_air")
  .filterDate(start, end)
  .filterBounds(point);

// 4. Function to generate time series charts
function makeChart(collection, title, ytitle, color) {
  return ui.Chart.image.series(collection, point, ee.Reducer.mean(), 10000, 'system:time_start')
    .setOptions({
      title: title,
      vAxis: {title: ytitle},
      hAxis: {title: 'Date'},
      lineWidth: 2,
      pointSize: 4,
      series: {0: {color: color}}
    });
}

// 5. Generate and display charts
print(makeChart(co, 'Carbon Monoxide (CO)', 'mol/m²', 'red'));
print(makeChart(no2, 'Nitrogen Dioxide (NO₂)', 'mol/m²', 'blue'));
print(makeChart(so2, 'Sulfur Dioxide (SO₂)', 'mol/m²', 'orange'));
print(makeChart(o3, 'Ozone (O₃)', 'Dobson Units', 'green'));
print(makeChart(aai, 'Aerosol Index (AAI)', 'Index', 'black'));
print(makeChart(ch4, 'Methane (CH₄)', 'mol/m²', 'purple'));

// 6. Optional map visualization of mean values
Map.addLayer(co.mean(), {min: 0.01, max: 0.05, palette: ['green', 'yellow', 'red']}, 'CO Mean');
Map.addLayer(no2.mean(), {min: 0.00005, max: 0.0006, palette: ['blue', 'purple', 'red']}, 'NO2 Mean');
Map.addLayer(o3.mean(), {min: 0.1, max: 0.2, palette: ['blue', 'green', 'yellow']}, 'O3 Mean');
Map.addLayer(aai.mean(), {min: -1, max: 2, palette: ['white', 'orange', 'black']}, 'AAI Mean');
