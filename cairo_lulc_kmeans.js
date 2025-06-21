// 1. Load Cairo shapefile
var cairo = ee.FeatureCollection("projects/propane-bebop-462221-e2/assets/Cairo_shapefile");

// 2. Load Sentinel-2 SR imagery
var s2 = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(cairo)
  .filterDate('2024-06-01', '2024-09-30')  // dry season
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))  // increase to 30 for better availability
  .select(['B2', 'B3', 'B4', 'B8']);  // Blue, Green, Red, NIR

// Check availability
print('Number of images:', s2.size());
Map.centerObject(cairo, 10);

// 3. Median composite and clip
var image = s2.median().clip(cairo);
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True Color Composite');

// 4. Sample training pixels
var training = image.sample({
  region: cairo,
  scale: 10,
  numPixels: 5000,
  seed: 1
});

// 5. Apply unsupervised KMeans (5 classes)
var clusterer = ee.Clusterer.wekaKMeans(5).train(training);
var classified = image.cluster(clusterer);

// 6. Display LULC clusters
var palette = ['blue', 'green', 'yellow', 'orange', 'purple'];
Map.addLayer(classified, {min: 0, max: 4, palette: palette}, 'Cairo LULC Clusters');

// 7. Display boundary
Map.addLayer(cairo.style({color: 'white', fillColor: '00000000'}), {}, 'Cairo Boundary');

// 8. Add Legend
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px 15px'}});
legend.add(ui.Label({value: '🗺️ LULC Legend (class labels)', style: {fontWeight: 'bold', fontSize: '14px'}}));
var names = ['Water', 'Vegetation', 'Built-up', 'Barren', 'Snow/Ice'];
for (var i = 0; i < 5; i++) {
  var colorBox = ui.Label('', {
    backgroundColor: palette[i],
    padding: '8px',
    margin: '0 4px 0 0'
  });
  var label = ui.Label(names[i], {margin: '0 0 4px 0'});
  var row = ui.Panel([colorBox, label], ui.Panel.Layout.Flow('horizontal'));
  legend.add(row);
}
Map.add(legend);

