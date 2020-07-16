# Raleigh Housing Map
Project Team:  Tania Allen, Darrien Bailey, Webb Hinton, Sara Queen

## About
An interactive web-map made with [Leaflet](https://leafletjs.com/) housing and history in Raleigh's neighborhoods. Check out a live demo [here](https://demomap-ecb3b.firebaseapp.com/). 

![Demo1](/Images/mapOverview.png)

This repository consists of two parts, the .js/.css/.html files used to render the interactive map, and the python used to format, sort, and filter .csv sheets derived from shapefiles. The property shapefiles used to generate the input data can be found at [Wake County's GIS data hub](http://www.wakegov.com/gis/services/Pages/data.aspx). Once these data sets are processed with the python script, they are joined with the neighborhood's shapefile, which is then exported as geoJSON. GeoJSON files were converted to topoJSON to maximize performance. Included are our final output data sets. We hope it may be a useful reference or source for your own mapping project. 

## Features

* Modular code design allows for quick customization, easily swap out data sets, change legend colors, and edit layout
* Interactive legend for displaying different data sets and changing data year
* Ability to download active data as .geojson
* Ability to switch between two sets of geoJSON features

*Pop-up with neighborhood stat sheet and line graph*

![Demo1](/Images/PopUpDemo.png)

*Interactive legend for switching data-sets**

![Demo1](/Images/menuGif.gif)

*View images and historical research in Neighborhood Histories mode*

![Demo1](/Images/viewHistoryDemo.png)

