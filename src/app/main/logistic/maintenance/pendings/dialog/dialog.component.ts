import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PendingsService } from 'app/main/logistic/maintenance/pendings/services/pendings.service';
import { PendingsDataSource } from "app/main/logistic/maintenance/pendings/services/pendings.datasource";

import { AttendDetail } from 'app/main/logistic/maintenance/pendings/model/pending.model';

import { locale as pendingsEnglish } from 'app/main/logistic/maintenance/pendings/i18n/en';
import { locale as pendingsSpanish } from 'app/main/logistic/maintenance/pendings/i18n/sp';
import { locale as pendingsFrench } from 'app/main/logistic/maintenance/pendings/i18n/fr';
import { locale as pendingsPortuguese } from 'app/main/logistic/maintenance/pendings/i18n/pt';

@Component({
    selector: 'attend-form-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AttendDialogComponent implements OnInit {

   attend: any;
   attendForm: FormGroup;
   attendDetail: AttendDetail = {};
   action: string;

   private flag = new BehaviorSubject<boolean>(false);

   dataSource: PendingsDataSource;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private pendingsService: PendingsService,
        public matDialogRef: MatDialogRef<AttendDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(pendingsEnglish, pendingsSpanish, pendingsFrench, pendingsPortuguese);

        this.attend = _data.attend;
        
    }

    ngOnInit() {
        this.attendForm = this._formBuilder.group({
            // id      : [this.attend.id],
            // action     : [null],
            cost       : [null],
            performdate: [null],
            hour       : [null],
        });

        this.setValue();
    }

    setValue() {
        this.action = this.attend.status;
        this.attendForm.get('cost').setValue(this.attend.cost);
  
        let date = this.attend.performdate? new Date(`${this.attend.performdate}`) : '';

        
  
        this.attendForm.get('performdate').setValue(this.dateFormat(date));
        this.attendForm.get('hour').setValue(this.timeFormat(date));
    }

    getValue() {
        this.attendDetail.id = this.attend.id;
        this.attendDetail.action = this.action;
        this.attendDetail.cost = this.attendForm.get('cost').value;

        let performdate = this.paramDateFormat(new Date(this.attendForm.get('performdate').value));
        let hour = this.paramTimeFormat(this.attendForm.get('hour').value);

        this.attendDetail.performdate = performdate + " " + hour;

        let currentPending =  this.pendingsService.maintPendingList.findIndex((pending: any) => pending.id == this.attend.id);
        

        this.pendingsService.maintPendingList[currentPending].id = this.attendDetail.id;
        this.pendingsService.maintPendingList[currentPending].status = this.attendDetail.action;
        this.pendingsService.maintPendingList[currentPending].cost = this.attendDetail.cost;
        this.pendingsService.maintPendingList[currentPending].performdate = this.attendDetail.performdate;
        // this.pendingsService.maintPendingList[currentPending].performdate = (new Date(this.attendForm.get('performdate').value)).toISOString();

        this.flag.next(true);
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
          str = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        }

        
    
        return str;
    }
    
    paramTimeFormat(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        
        if (time.length > 1) { // If time format correct
          time = time.slice(1); // Remove full string match value
          

          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +(time[0] % 12) < 10 ? '0' +  time[0] % 12 : time[0] % 12 || 12; // Adjust hours
        }
        

        return time.join(''); // return adjusted time or original string
    }

    dateFormat(date: any) {
        let str = new Date(date).toISOString().substring(0, 10);
        
        return str;
    }

    timeFormat(time: any) {
        let str = '';
    
        if (time != '') {
          str = 
           ("00" + time.getHours()).slice(-2) + ":" 
            + ("00" + time.getMinutes()).slice(-2) 
        }

        

        return str;
    }

    save() {
        let userConncode = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.conncode;
        let userID = JSON.parse(localStorage.getItem('user_info')).TrackingXLAPI.DATA.id;

        this.getValue();

        if ( this.flag ) {

            this.pendingsService.saveAttend(userConncode, userID, this.attendDetail)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    alert('Successfully saved');
                    this.dataSource = new PendingsDataSource(this.pendingsService);

                    this.dataSource.pendingsSubject.next(this.pendingsService.maintPendingList);

                    // this.reloadComponent();

                } else {
                    alert("Failed save!")
                }
            });
        };

        this.flag.next(false);

        this.matDialogRef.close();
    }
}
