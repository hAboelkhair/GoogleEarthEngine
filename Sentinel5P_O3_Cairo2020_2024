// Define the region of interest: Cairo, Egypt (50 km buffer)
var cairo = ee.Geometry.Point(31.2357, 30.0444).buffer(50000);
Map.centerObject(cairo, 8);

// Load Sentinel-5P L3 O₃ dataset
var o3 = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_O3")
           .select('O3_column_number_density')
           .filterBounds(cairo)
           .filterDate('2020-01-01', '2024-12-31');

// Generate a list of monthly time intervals
var months = ee.List.sequence(0, 59); // 5 years × 12 months = 60 months

var monthlyCollection = ee.ImageCollection(
  months.map(function(m) {
    var start = ee.Date('2020-01-01').advance(m, 'month');
    var end = start.advance(1, 'month');
    var monthly = o3
      .filterDate(start, end)
      .mean()
      .set('system:time_start', start.millis())
      .set('label', start.format('YYYY-MM'));
    return monthly;
  })
);

// Create chart
var chart = ui.Chart.image.series({
  imageCollection: monthlyCollection,
  region: cairo,
  reducer: ee.Reducer.mean(),
  scale: 1000,
  xProperty: 'system:time_start'
})
.setChartType('LineChart')
.setOptions({
  title: 'Monthly O₃ Concentration over Cairo (2020–2024)',
  hAxis: {title: 'Date'},
  vAxis: {title: 'O₃ Column Density (mol/m²)', viewWindow: {min: 0.05, max: 0.35}},
  lineWidth: 2,
  pointSize: 3,
  colors: ['#1f77b4']
});

// Print chart to Console
print(chart);
