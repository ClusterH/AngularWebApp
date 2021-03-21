import { Component, OnInit, OnChanges, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as routesEnglish } from 'app/main/admin/routes/i18n/en';
import { locale as routesFrench } from 'app/main/admin/routes/i18n/fr';
import { locale as routesPortuguese } from 'app/main/admin/routes/i18n/pt';
import { locale as routesSpanish } from 'app/main/admin/routes/i18n/sp';
import { RouteDetail } from 'app/main/admin/routes/model/route.model';
import { RouteDetailService } from 'app/main/admin/routes/services/route_detail.service';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
import { CourseDialogComponent } from "../dialog/dialog.component";
import { merge, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { isEmpty, isEqual } from 'lodash';
import { AgmMap, LatLngBounds } from '@agm/core';

declare const google: any;

@Component({
    selector: 'app-route-detail',
    templateUrl: './route_detail.component.html',
    styleUrls: ['./route_detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RouteDetailComponent implements OnInit, OnDestroy {
    route_detail: any;
    public route: any;
    routeMapData: any;
    pageType: string;
    routeForm: FormGroup;
    routeDetail: RouteDetail = {};
    displayedColumns: string[] = ['name'];
    filter_string: string = '';
    method_string: string = '';
    activatedTabIndex: number = 0;
    private _unsubscribeAll: Subject<any>;

    map: any;
    lat: number = 25.7959;
    lng: number = -80.2871;
    zoom: number = 12;
    bounds: any;
    isLoadedRouteMap: boolean = false;
    isRemoveRouteDialog: boolean = false;
    isRemoveStopDialog: boolean = false;
    currentStopIndex: number;

    public renderOptions = {
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#1A73E8',
            strokeWeight: 7,
            strokeOpacity: 0.7
        },
        draggable: true
    };

    public markerOptions = {
        origin: {
            draggable: true
        },
        destination: {
            draggable: true
        },
    };

    @ViewChild('AgmMap') agmMap: AgmMap;

    constructor(
        public routeDetailService: RouteDetailService,
        public agmDirectionGeneratorService: AgmDirectionGeneratorService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        private router: Router,
        private activatedroute: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(routesEnglish, routesSpanish, routesFrench, routesPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.route = data;
        });

        this.agmDirectionGeneratorService.newRouteLocations = [];
        this.agmDirectionGeneratorService.newRouteOrigin = undefined;
        this.agmDirectionGeneratorService.newRouteDestination = undefined;
        this.agmDirectionGeneratorService.newRouteStops = [];
        this.agmDirectionGeneratorService.newRouteStopsTemp = [];
        this.agmDirectionGeneratorService.newRoutePath = [];
        this.agmDirectionGeneratorService.isGenerateRoute = false;
        this.agmDirectionGeneratorService.isImportStopsFromFile = false;
        this.agmDirectionGeneratorService.isAddStopsOnMap = false;
        this.agmDirectionGeneratorService.waypointDistance = [];
        this.agmDirectionGeneratorService.countDisRequest = 0;

        if (isEmpty(this.route)) {
            this.pageType = 'new';

        } else {
            this.pageType = 'edit';
        }
        this.filter_string = '';
    }

    ngOnInit(): void {
        this.routeForm = this._formBuilder.group({
            name: [null, Validators.required],
            created: [{ value: '', disabled: true }],
            createdbyname: [{ value: '', disabled: true }],
            lastmodifieddate: [{ value: '', disabled: true }],
            lastmodifiedbyname: [{ value: '', disabled: true }],
        });

        this.setValues();
        this.route_detail = this.routeForm.value;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues() {
        this.routeForm.get('name').setValue(this.route.name);
        let created = this.route.created ? new Date(`${this.route.created}`) : '';
        let lastmodifieddate = this.route.lastmodifieddate ? new Date(`${this.route.lastmodifieddate}`) : '';
        this.routeForm.get('created').setValue(this.dateFormat(created));
        this.routeForm.get('createdbyname').setValue(this.route.createdbyname);
        this.routeForm.get('lastmodifieddate').setValue(this.dateFormat(lastmodifieddate));
        this.routeForm.get('lastmodifiedbyname').setValue(this.route.lastmodifiedbyname);
    }

    getValues(dateTime: any, mode: string) {
        const userID: number = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA[0].id;
        this.routeDetail.name = this.routeForm.get('name').value || '';
        this.routeDetail.isactive = this.route.isactive || true;

        if (mode == "save") {
            this.routeDetail.id = this.route.id;
            this.routeDetail.created = this.route.created;
            this.routeDetail.createdby = this.route.createdby;
            this.routeDetail.lastmodifieddate = dateTime;
            this.routeDetail.lastmodifiedby = userID;
        } else if (mode == "add") {
            this.routeDetail.id = 0;
            this.routeDetail.created = dateTime;
            this.routeDetail.createdby = userID;
            this.routeDetail.lastmodifieddate = dateTime;
            this.routeDetail.lastmodifiedby = userID;
        }
    }

    getRoute(): void {
        this.routeDetailService.getRoute(this.route.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.routeMapData = JSON.parse("[" + res.TrackingXLAPI.DATA[0].paths + "]")[0];
            console.log(this.routeMapData);
        })
    }

    tabChanged(): void {
        if (this.activatedTabIndex === 1 && this.routeMapData !== undefined && this.routeMapData?.length > 0) {
            this.isLoadedRouteMap = true;

            const bounds: LatLngBounds = new google.maps.LatLngBounds();
            for (let mm of this.routeMapData) {
                bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
            }
            setTimeout(() => {
                this.map.fitBounds(bounds);
            }, 500)
        }
    }

    onMapReady(map: any) {
        this.map = map;
        if (this.pageType === 'edit') {
            this.getRoute();
        } else {
            this.agmDirectionGeneratorService.directionsService = new google.maps.DirectionsService();
            this.agmDirectionGeneratorService.directionDisplayer = new google.maps.DirectionsRenderer({
                draggable: true,
                map: this.map
            });

            google.maps.event.addListener(this.agmDirectionGeneratorService.directionDisplayer, 'directions_changed', () => {
                this.agmDirectionGeneratorService.onChangeRouteByDragging(this.agmDirectionGeneratorService.directionDisplayer.directions);
            });
        }
    }

    addRouteLocations(event: any) {
        if (this.pageType === 'edit') {
            return false;
        }

        this.agmDirectionGeneratorService.addRouteLocations(event, this.map);
    }

    markerDragEnd(event: any, index: number): void {
        this.agmDirectionGeneratorService.newRouteLocations[index] = { ...event.coords };
    }

    closeDialog(isConfirm): void {
        this.agmDirectionGeneratorService.isImportStopsFromFile = false;

        if (isConfirm) {
            this.agmDirectionGeneratorService.generateWayPointList(this.agmDirectionGeneratorService.newRouteStopsTemp).then(res => {
                this.agmDirectionGeneratorService.newRouteStops = [...res];
                this.agmDirectionGeneratorService.drawRouthPath(this.agmDirectionGeneratorService.newRouteStops);
            })
        }
    }

    closeConfirmDialog(isConfirm): void {
        this.isRemoveRouteDialog = false;

        if (isConfirm) {
            this.agmDirectionGeneratorService.newRouteStops = [...[]];
            this.agmDirectionGeneratorService.newRouteLocations = [];
            this.agmDirectionGeneratorService.isGenerateRoute = false;
            this.agmDirectionGeneratorService.directionDisplayer.setMap(null);

            this.lat = 25.7959;
            this.lng = -80.2871;
            this.zoom = 12;
            const bounds: LatLngBounds = new google.maps.LatLngBounds();
            bounds.extend(new google.maps.LatLng(this.lat, this.lng));
            this.map.fitBounds(bounds);
            let zoomChangeBoundsListener = google.maps.event.addListenerOnce(this.map, 'bounds_changed', function (event) {
                if (this.getZoom()) {
                    this.setZoom(12);
                }
            });
            setTimeout(() => { google.maps.event.removeListener(zoomChangeBoundsListener) }, 2000);
        } else {
            return;
        }
    }

    closeRMStopDialog(isConfirm): void {
        this.isRemoveStopDialog = false;
        let tempStops = [...this.agmDirectionGeneratorService.newRouteStops];
        if (isConfirm) {
            tempStops.splice(this.currentStopIndex, 1);
            this.agmDirectionGeneratorService.newRouteStops = [...tempStops];
        } else {
            return;
        }
    }

    getCSVFileData(event): void {
        console.log(event);
        this.agmDirectionGeneratorService.newRouteStopsTemp = [...event];
        // for (let waypoint of event) {
        //     this.agmDirectionGeneratorService.newRouteStopsTemp = [...this.agmDirectionGeneratorService.newRouteStopsTemp, ...[waypoint]];
        // }
    }

    addStopsOnMap(): void {
        this.agmDirectionGeneratorService.isAddStopsOnMap = !this.agmDirectionGeneratorService.isAddStopsOnMap;
        if (this.agmDirectionGeneratorService.isAddStopsOnMap) {
            this.agmDirectionGeneratorService.newRouteStops = [];
        }
    }

    removeRoute(): void {
        if (this.agmDirectionGeneratorService.newRouteLocations.length > 1) {
            this.isRemoveRouteDialog = true;
        } else {
            return;
        }
    }

    saveRoute(): void {
        let today = new Date().toISOString();
        this.getValues(today, "save");
        if (this.routeDetail.name == '') {
            alert('Please enter Detail Name');
        } else {
            this.routeDetailService.saveRouteDetail(this.routeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        alert("Success!");
                        this.router.navigate(['admin/routes/routes']);
                    }
                });
        }
    }

    addRoute(): void {
        this.agmDirectionGeneratorService.addRoute();

        let today = new Date().toISOString();
        this.getValues(today, "add");
        if (this.routeDetail.name == '') {
            alert('Please enter Detail Name');
        } else {
            this.routeDetailService.saveRouteDetail(this.routeDetail).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.agmDirectionGeneratorService.newRoutePath.map(path => {
                            path.routeid = result.TrackingXLAPI.DATA[0].id;
                            return path;
                        });

                        setTimeout(() => {
                            this.routeDetailService.setRoutePath(this.agmDirectionGeneratorService.newRoutePath).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
                                if (res.responseCode === 100) {
                                    alert("Success!");
                                    this.router.navigate(['admin/routes/routes']);
                                } else {
                                    alert("Failed to save path");
                                }
                            })
                        }, 500);
                    } else {
                        alert('Failed to save route');
                    }
                });
        }
    }

    goBackUnit() {
        const currentState = this.routeForm.value;

        if (isEqual(this.route_detail, currentState)) {
            this.router.navigate(['admin/routes/routes']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { route: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(CourseDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['admin/routes/routes']);
                }
            });
        }
    }

    dateFormat(date: any) {
        let str = '';
        if (date != '') {
            str =
                ("00" + (date.getMonth() + 1)).slice(-2)
                + "/" + ("00" + date.getDate()).slice(-2)
                + "/" + date.getFullYear() + " "
                + ("00" + date.getHours()).slice(-2) + ":"
                + ("00" + date.getMinutes()).slice(-2)
                + ":" + ("00" + date.getSeconds()).slice(-2);
        }
        return str;
    }
}

export interface Location {
    lat: number;
    lng: number;
}