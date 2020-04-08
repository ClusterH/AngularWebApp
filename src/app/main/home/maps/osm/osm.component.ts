import { Component } from '@angular/core';

@Component({
    selector   : 'docs-components-third-party-google-maps',
    templateUrl: './osm.component.html',
    styleUrls  : ['./osm.component.scss']
})
export class OpenStreetMapComponent
{
    lat: number;
    lng: number;

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.lat = 25.7959;
        this.lng = -80.2871;
    }
}
