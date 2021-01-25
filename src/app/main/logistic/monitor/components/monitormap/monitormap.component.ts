import { Component, OnInit, ViewChild } from '@angular/core';
import { AgmMap, AgmMarker, LatLngBounds, MapsAPILoader, MouseEvent } from '@agm/core';
import { faBan, faThumbtack, faMapPin, faStopCircle } from '@fortawesome/free-solid-svg-icons';
declare const google: any;

@Component({
    selector: 'app-monitormap',
    templateUrl: './monitormap.component.html',
    styleUrls: ['./monitormap.component.scss']
})
export class MonitormapComponent implements OnInit {
    map: any;
    lat: number;
    lng: number;
    zoom = 12;

    unit_icon_start_green = {
        url: 'assets/icons/googlemap/play-green.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_start_red = {
        url: 'assets/icons/googlemap/play-red.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_end_green = {
        url: 'assets/icons/googlemap/stop-green.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_end_red = {
        url: 'assets/icons/googlemap/stop-red.svg',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_arrived = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_unarrived = {
        url: 'assets/icons/googlemap/red-marker.png',
        scaledSize: { width: 10, height: 10 },
    }
    unit_icon_unauth = {
        url: 'assets/icons/googlemap/green-marker.png',
        scaledSize: { width: 100, height: 100 },
    }

    faBan = faBan;
    faThumbtack = faThumbtack;
    faMapPin = faMapPin;
    faStopCircle = faStopCircle;

    color: any = {
        blue: "#0000ff",
        red: "#ff0000",
        indigo: "#4b0082",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgreen: "#006400",
        darkmagenta: "#8b008b",
        darkred: "#8b0000",
        darkviolet: "#9400d3",
        fuchsia: "#ff00ff",
        green: "#008000",
        lime: "#00ff00",
        magenta: "#ff00ff",
        yellow: "#ffff00"
    }

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

    random_rgba() {
        let result;
        let count = 0;
        for (let prop in this.color) {
            if (Math.random() < 1 / ++count) result = prop;
        }

        return this.color[result];
    }
    dynamicColor(color: string) {
        return color;
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

}
