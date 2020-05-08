import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { PendingsService } from 'app/main/logistic/maintenance/pendings/services/pendings.service';
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
        console.log(this.attend);
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

        console.log(date);
  
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

        console.log(performdate, hour);

        this.flag.next(true);
    }

    paramDateFormat(date: any) {
        let str = '';
        if (date != '') {
          str = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
        }

        console.log(str);
    
        return str;
    }
    
    paramTimeFormat(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
        console.log(time);
        if (time.length > 1) { // If time format correct
          time = time.slice(1); // Remove full string match value
          console.log(time);

          time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
          time[0] = +(time[0] % 12) < 10 ? '0' +  time[0] % 12 : time[0] % 12 || 12; // Adjust hours
        }
        console.log(time);

        return time.join(''); // return adjusted time or original string
    }

    dateFormat(date: any) {
        let str = new Date(date).toISOString().substring(0, 10);
        console.log(str);
        return str;
    }

    timeFormat(time: any) {
        let str = '';
    
        if (time != '') {
          str = 
           ("00" + time.getHours()).slice(-2) + ":" 
            + ("00" + time.getMinutes()).slice(-2) 
        }

        console.log(str);

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

                    this.reloadComponent();

                } else {
                    alert("Failed save!")
                }
            });
        };

        this.flag.next(false);

        this.matDialogRef.close();
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['logistic/pendings/pendings']);
    }

}
