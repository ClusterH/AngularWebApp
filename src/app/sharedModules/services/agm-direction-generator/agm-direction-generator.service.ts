import { Injectable } from '@angular/core';

@Injectable()
export class AgmDirectionGeneratorService {
  map: any;
  directionDisplayer: any;
  directionsService: any;

  newRouteLocations: Array<Location> = [];
  newRouteOrigin: Location;
  newRouteDestination: Location;
  newRouteStops: any = [];
  newRouteStopsTemp: any = [];
  newRoutePath: any = [];
  isGenerateRoute: boolean = false;
  isImportStopsFromFile: boolean = false;
  isAddStopsOnMap: boolean = false;
  waypointDistance: Array<any> = [];
  countDisRequest: number = 0;

  constructor() { }

  addRouteLocations(event: any, map: any) {
    this.map = map;
    if (this.newRouteLocations.length === 2) {
      if (this.isAddStopsOnMap) {
        let tempStops = [...this.newRouteStops];
        tempStops = [...tempStops, ...[{ location: event.coords, stopover: false }]];
        this.generateWayPointList(tempStops).then(res => {
          this.drawRouthPath(res);
        });
      } else { return false; }
    } else {
      this.newRouteLocations.push(event.coords);
      if (this.newRouteLocations.length === 2) {
        this.isGenerateRoute = true;
        this.newRouteOrigin = this.newRouteLocations[0];
        this.newRouteDestination = this.newRouteLocations[1];
        this.drawRouthPath([]);
      } else {
        this.isGenerateRoute = false;
      }
    }
  }

  drawRouthPath(waypoints): void {
    this.directionDisplayer.setMap(this.map);
    this.directionsService.route({
      origin: this.newRouteOrigin,
      destination: this.newRouteDestination,
      waypoints: waypoints,
      provideRouteAlternatives: true,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        this.directionDisplayer.setDirections(response);
        this.newRouteStops = [...waypoints];
        google.maps.event.addListener(this.directionDisplayer, 'directions_changed', () => {
          this.onChangeRouteByDragging(this.directionDisplayer.directions);
        });
      } else {
        alert('Distance request failed due to ' + status);
      }
    });
  }

  async generateWayPointList(dest: any[]): Promise<any> {
    const origin = this.newRouteOrigin;
    return await new Promise((resolve, reject) => {
      this.waypointDistance = [];
      if (dest.length > 1) {
        for (let i = 0; i < dest.length; i++) {
          this.getDistance(origin, { lat: dest[i].location.lat, lng: dest[i].location.lng }).then(distance => {
            this.waypointDistance.push({ location: { lat: dest[i].location.lat, lng: dest[i].location.lng }, stopover: false, distance: distance });
            if (i == dest.length - 1) {
              setTimeout(() => {
                this.waypointDistance.sort((a, b) => this.sortByDistance(a, b));
                this.waypointDistance = this.waypointDistance.map(item => { delete item.distance; return item });
                resolve(this.waypointDistance);
              }, 250);
            }
          });
        };
      } else {
        resolve(dest);
      }
    })
  }

  getDistance(origin: any, destination: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService;
      let distance = 0;
      this.countDisRequest += 1;
      if (this.countDisRequest == 10) {
        setTimeout(() => {
          directionsService.route({
            origin,
            destination,
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
          }, (response, status) => {
            if (status == 'OK') {
              distance = response.routes[0].legs[0].distance.value;
              this.countDisRequest = 0;
              resolve(distance);
            } else {
              alert('Distance request failed due to ' + status);
            }
          });
        }, 1000)
      } else {
        directionsService.route({
          origin,
          destination,
          waypoints: [],
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        }, (response, status) => {
          if (status == 'OK') {
            distance = response.routes[0].legs[0].distance.value;
            resolve(distance);
          } else {
            alert('Distance request failed due to ' + status);
          }
        });
      }
    })
  }

  sortByDistance(a, b): number {
    if (a.distance > b.distance) return 1;
    else if (a.distance < b.distance) return -1;
    else return 0;
  }

  onChangeRouteByDragging(event: any) {
    let tempWaypoints = [];
    for (let waypoint of event.routes[0].legs[0].via_waypoints) {
      tempWaypoints.push({ location: { lat: waypoint.lat(), lng: waypoint.lng() }, stopover: false });
      if (tempWaypoints.length === event.routes[0].legs[0].via_waypoints.length) {
        this.newRouteStops = [...tempWaypoints];
      }
    }
  }

  addRoute(): void {
    const directionsService = new google.maps.DirectionsService;

    directionsService.route({
      origin: this.newRouteOrigin,
      destination: this.newRouteDestination,
      waypoints: this.newRouteStops,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, (response, status) => {
      if (status == 'OK') {
        const tempPath = response.routes[0].legs[0].steps;
        for (let i = 0; i < tempPath.length; i++) {
          if (i === tempPath.length - 1) {
            this.newRoutePath.push({ latitude: tempPath[i].start_location.lat(), longitude: tempPath[i].start_location.lng() })
          } else {
            this.newRoutePath.push({ latitude: tempPath[i].end_location.lat(), longitude: tempPath[i].end_location.lng() })
          }
        }
      } else {
        alert('Distance request failed due to ' + status);
      }
    });
  }

  resetRoutes(): void {
    this.directionDisplayer?.setMap(null);
    this.newRouteLocations = [...[]];
    this.newRouteStops = [...[]];
    this.newRouteOrigin = undefined;
    this.newRouteDestination = undefined;
    this.isGenerateRoute = false;
    this.isAddStopsOnMap = false;
  }
}

export interface Location {
  lat: number;
  lng: number;
}
