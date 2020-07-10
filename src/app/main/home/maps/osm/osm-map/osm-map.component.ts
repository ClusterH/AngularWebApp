import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Map, Control, DomUtil, ZoomAnimEvent, Layer, MapOptions, tileLayer, latLng, Marker, icon, Polygon, Polyline } from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster'
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { VehMarkersService } from 'app/main/home/maps/services/vehmarkers.service';
import { RoutesService } from 'app/main/home/maps/services/routes.service';
import { ZonesService } from 'app/main/home/maps/services/zones.service';

import { FuseSidebarService } from 'app/main/home/maps/sidebar/sidebar.service';

@Component({
	selector: 'app-osm-map',
	templateUrl: './osm-map.component.html',
	styleUrls: ['./osm-map.component.scss',]
})
export class OsmMapComponent implements OnInit, OnDestroy {
	@Output() map$: EventEmitter<Map> = new EventEmitter;
	@Output() zoom$: EventEmitter<number> = new EventEmitter;
	@Input() options: MapOptions = {
		layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			opacity: 1,
			maxZoom: 19,
			tileSize: 512,
			zoomOffset: -1,
			detectRetina: true,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		})],
		zoom: 12,
		center: latLng(25.7959, -80.2871)
	};
	public map: Map;
	public zoom: number;

	vehmarkers: marker[];
	zones: marker[];
	routes: marker[];
	tmpZones: marker[];
	tmpRoutes: marker[];

	constructor(
		private _vehMarkersService: VehMarkersService,
		private _adminZonesService: ZonesService,
		private _adminRoutesService: RoutesService,

		private _fuseSidebarService: FuseSidebarService,
		private unitInfoService: UnitInfoService,
	) {
	}

	ngOnInit() {
		this._vehMarkersService.getVehMarkers("PolarixUSA", 2).subscribe(
			(data) => {
				this.vehmarkers = data.TrackingXLAPI.DATA;
				this.getMarkerCluster(this.vehmarkers);
				
			}
		);

		this._adminZonesService.getZones("PolarixUSA", 2).subscribe(
			(data) => {
				// 
				// 
				this.zones = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
				this.getPolygon(this.zones);
			}
		);

		this._adminRoutesService.getRoutes("PolarixUSA", 2).subscribe(
			(data) => {
				// 
				// 
				this.routes = JSON.parse("[" + data.TrackingXLAPI.DATA[0].paths + "]");
				this.getPolyline(this.routes);
			}
		);
	}

	getMarkerCluster(vehmarkers) {
		console.log(vehmarkers);
		let markers = new MarkerClusterGroup();

		for (let i = 0; i < vehmarkers.length; i++) {
			let m = new Marker(latLng(vehmarkers[i].lat, vehmarkers[i].lng), {
				draggable: vehmarkers[i].draggable,
				icon: icon({
					iconSize: [ 25, 41 ],
					iconAnchor: [ 13, 41 ],
					iconUrl: 'leaflet/marker-icon.png',
					shadowUrl: 'leaflet/marker-shadow.png'
				}),
				title: vehmarkers[i].label
			});
			// m.bindTooltip(vehmarkers[i].label).openTooltip();
			// m.bindPopup(vehmarkers[i].label).openPopup();
			markers.addLayer(m)
		}

		markers.on('click',  (a: any) => {
			console.log(a.layer.options.title);
			this.toggleSidebarOpen('unitInfoPanel', a.layer.options.title);
		});

		this.map.addLayer(markers);
	}

	getPolygon(zones: any) {
		let polygon = new Polygon(zones, {color: 'red', opacity: 0.3, fillColor: 'red', fillOpacity: 0.1}).addTo(this.map);
		// this.map.fitBounds(polygon.getBounds());

	}

	getPolyline(routes: any) {
		let polygon = new Polyline(routes, {color: 'blue', opacity: 1}).addTo(this.map);
		// this.map.fitBounds(polygon.getBounds());

	}


	toggleSidebarOpen(key, label): void {
		this._fuseSidebarService.getSidebar(key).toggleOpen();
		this.unitInfoService.onVehMarkerClickChanged = label;
	}

	ngOnDestroy() {
		this.map.clearAllEventListeners;
		this.map.remove();
	};

	onMapReady(map: Map) {
		this.map = map;
		this.map$.emit(map);
		this.zoom = map.getZoom();
		this.zoom$.emit(this.zoom);
	}

	onMapZoomEnd(e: ZoomAnimEvent) {
		this.zoom = e.target.getZoom();
		this.zoom$.emit(this.zoom);
	}
}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: string;
	visible: boolean;
}

