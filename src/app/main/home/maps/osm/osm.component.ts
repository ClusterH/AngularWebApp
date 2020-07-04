import { Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

@Component({
    selector   : 'docs-components-third-party-google-maps',
    templateUrl: './osm.component.html',
    styleUrls  : ['./osm.component.scss']
})

export class OpenStreetMapComponent
{
    lat: number;
    lng: number;

    map: Map;

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.lat = 25.7959;
        this.lng = -80.2871;
    }

    ngOnInit(){
        this.map = new Map({
          target: 'osm_map',
          layers: [
            new TileLayer({
              source: new OSM()
            })
          ],
          view: new View({
            center: olProj.fromLonLat([-80.2871, 25.7959]),
            zoom: 12
          })
        });
      }
}
