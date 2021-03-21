import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { faBan, faThumbtack, faMapPin, faStopCircle } from '@fortawesome/free-solid-svg-icons';
declare const google: any;

@Component({
    selector: 'app-monitormap',
    templateUrl: './monitormap.component.html',
    styleUrls: ['./monitormap.component.scss']
})
export class MonitormapComponent implements OnInit {
    @Input() tripWatchData: any;
    testTripData = [
        { "latitude": 25.756645, "longitude": -80.297777 },
        { "latitude": 25.721642, "longitude": -80.285555 },
        { "latitude": 25.752643, "longitude": -80.273333 },
        { "latitude": 25.763675, "longitude": -80.261111 },
        { "latitude": 25.754654, "longitude": -80.259999 },
        { "latitude": 25.795675, "longitude": -80.247777 },
        { "latitude": 25.776618, "longitude": -80.235555 },
        { "latitude": 25.757648, "longitude": -80.223333 },
        { "latitude": 25.778684, "longitude": -80.211111 },
    ];
    map: any;
    lat: number;
    lng: number;
    zoom = 12;

    unit_icon_start = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_end = {
        url: 'assets/icons/googlemap/taxi-pattern2.png',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_routes = {
        url: 'assets/icons/googlemap/unit-marker.png',
        scaledSize: { width: 11, height: 15 },
    }

    faBan = faBan;
    faThumbtack = faThumbtack;
    faMapPin = faMapPin;
    faStopCircle = faStopCircle;

    @ViewChild('AgmMap') agmMap: AgmMap;

    constructor() {
        this.lat = 25.7959;
        this.lng = -80.2871;
    }

    ngOnInit(): void {

    }

    onMapReady(map: any) {
        this.map = map;
    }


    centerMapToStop(e) {
        this.lat = e.latitude + (0.0000000000100 * Math.random());
        this.lng = e.longitude + (0.0000000000100 * Math.random());
        this.zoom = 16;
        this.boundControl(this.zoom, this.lat, this.lng);
    }

    boundControl(zoom: number, lat: number, lng: number) {
        const bounds: LatLngBounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(lat, lng));

        this.map.fitBounds(bounds);

        let zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function (event) {
            if (this.getZoom()) {
                this.setZoom(zoom);
            }
        });
        setTimeout(() => { google.maps.event.removeListener(zoomChangeBoundsListener) }, 2000);
    }

    trackByFn(index, item) {
        return index;
    }

}
