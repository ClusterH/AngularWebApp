import { Component, OnInit, ViewChild, NgZone, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as jobsEnglish } from '../../i18n/en';
import { locale as jobsFrench } from '../../i18n/fr';
import { locale as jobsPortuguese } from '../../i18n/pt';
import { locale as jobsSpanish } from '../../i18n/sp';
import { JobList, UserPOIs } from '../../model';
import { merge, Subject, Observable, of } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { isEmpty, isEqual } from 'lodash';
import { JobListDialogComponent } from '../../dialog/joblist-dialog/dialog.component';
import { RoutePlanningDriverService, RoutePlanningJobService } from '../../services';

@Component({
    selector: 'app-joblist-detail',
    templateUrl: './joblist-detail.component.html',
    styleUrls: ['./joblist-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class JoblistDetailComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    job: JobList;
    jobDetail: any = {};
    job_detail: JobList;
    pageType: string;
    jobForm: FormGroup;
    addressType: string = 'Google Address';
    latitude: number;
    longitude: number;
    destPlace: string = '';
    userPOIs$: Observable<UserPOIs[]>;
    userPOIs: UserPOIs[];
    selectedPOI: UserPOIs;

    @ViewChild('search') search: any;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private activatedroute: ActivatedRoute,
        public _matDialog: MatDialog,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private routeplanningJobService: RoutePlanningJobService,
        private routeplanningDriverService: RoutePlanningDriverService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(jobsEnglish, jobsSpanish, jobsFrench, jobsPortuguese);
        this.activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(data => {
            this.job = data;
            this.job_detail = data;

        });

        if (isEmpty(this.job)) {
            this.pageType = 'new';
        } else {
            this.pageType = 'edit';
        }
    }

    ngOnInit(): void {
        this.jobForm = this._formBuilder.group({
            stopname: [null, Validators.required],
            google_autocomplete: [null],
            poi: [null],
            pointradio: [null],
            latitude: [null],
            longitude: [null],
            schedtime: [null],
            earlytolerancemin: [null],
            latetolerancemin: [null],
            description: [null],
        });

        this.routeplanningDriverService.getUserPOIs().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {

            this.userPOIs = res.TrackingXLAPI.DATA;
            this.userPOIs$ = of(this.userPOIs);
        });

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.search.nativeElement);

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.jobForm.get('latitude').setValue(Number(this.latitude));
                    this.jobForm.get('longitude').setValue(Number(this.longitude));
                    this.destPlace = place.formatted_address;
                });
            });
        });
        if (this.pageType == 'edit') {
            this.setValues();
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    setValues(): void {
        this.jobForm.get('stopname').setValue(this.job.stopname);
        this.jobForm.get('schedtime').setValue(new Date(this.job.schedtime));
        this.jobForm.get('google_autocomplete').setValue(this.job.address);
        this.jobForm.get('poi').setValue(this.job.point);
        this.jobForm.get('latitude').setValue(Number(this.job.latitude));
        this.jobForm.get('longitude').setValue(Number(this.job.longitude));
        this.jobForm.get('pointradio').setValue(Number(this.job.pointradio));
        this.jobForm.get('earlytolerancemin').setValue(Number(this.job.earlytolerancemin));
        this.jobForm.get('latetolerancemin').setValue(Number(this.job.latetolerancemin));
        this.jobForm.get('description').setValue(this.job.description);

        this.job_detail = this.jobForm.value;
    }

    getValues(): void {

        this.jobDetail.id = this.job.id || 0;
        this.jobDetail.stopname = this.jobForm.get('stopname').value || '';
        this.jobDetail.latitude = this.jobForm.get('latitude').value || 0;
        this.jobDetail.longitude = this.jobForm.get('longitude').value || 0;
        this.jobDetail.pointradio = this.jobForm.get('pointradio').value || 0;
        this.jobDetail.earlytolerancemin = this.jobForm.get('earlytolerancemin').value || '';
        this.jobDetail.latetolerancemin = this.jobForm.get('latetolerancemin').value || '';
        this.jobDetail.description = this.jobForm.get('description').value || '';
        this.jobDetail.jsondata = this.job.jsondata || '';
        this.jobDetail.pointid = this.addressType == 'Google Address' ? this.job.pointid : this.userPOIs.filter(item => item.name == this.jobForm.get('poi').value)[0].id;
        this.jobDetail.address = this.addressType == 'Google Address' ? this.destPlace : this.job.address || '';
        this.jobDetail.schedtime = this.dateFormat(new Date(this.jobForm.get('schedtime').value)) || '';

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

    searchFromPOIList(e: any) {

        const filterString = e.target.value;
        const tempPOIs = this.userPOIs.filter(item => item.name.toLowerCase().includes(filterString.toLowerCase()));
        this.userPOIs$ = of(tempPOIs);
    }

    selectionChange(e: any) {

        this.jobForm.get('latitude').setValue(Number(this.userPOIs.filter(item => item.name == e.source.value)[0].latitude));
        this.jobForm.get('longitude').setValue(Number(this.userPOIs.filter(item => item.name == e.source.value)[0].longitude));
    }

    goBackUnit() {
        const currentState = this.jobForm.value;
        if (isEqual(this.job_detail, currentState)) {
            this.router.navigate(['logistic/routeplanning/routeplanning']);
        } else {
            const dialogConfig = new MatDialogConfig();
            let flag = 'goback';
            dialogConfig.disableClose = true;
            dialogConfig.data = { job: "", flag: flag };
            dialogConfig.disableClose = false;
            const dialogRef = this._matDialog.open(JobListDialogComponent, dialogConfig);
            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result == 'goback') {
                    this.router.navigate(['logistic/routeplanning/routeplanning']);
                }
            });
        }
    }

    saveJob(): void {
        if (isEmpty(this.jobForm.get('stopname').value)) {
            alert('Please put Stop Name');
            return;
        }

        this.getValues();
        this.routeplanningJobService.saveJob(this.jobDetail)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {
                if ((result.responseCode == 200) || (result.responseCode == 100)) {
                    alert("Success!");
                    this.router.navigate(['logistic/routeplanning/routeplanning']);
                }
            });
    }
}