import { Component } from '@angular/core';

@Component({
    selector   : 'docs-components-third-party-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls  : ['./google-maps.component.scss']
})
export class DocsComponentsThirdPartyGoogleMapsComponent
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
