import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { VehiclesService } from 'app/main/admin/vehicles/services/vehicles.service';


@Component({
    selector: 'vehicle-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   vehicle: any;
   flag: any;

    constructor(
        private fb: FormBuilder,
        private _adminVehiclesService: VehiclesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {vehicle, flag} ) {

        // this.vehicle = vehicle;
        this.vehicle = vehicle;
        this.flag = flag;
    }

    ngOnInit() {
        // console.log(this.position);
        // console.log( `${this.position.PosTop}px`);

        // this.dialogRef.updatePosition({top: `${this.position.PosTop}px`, left: `${this.position.Posleft}px`});
        // // this.dialogRef.updatePosition({top: '201.20000px', left: '24px'});

    }


    save() {
        // if(this.flag == "duplicate") {
        //     this._adminVehiclesService.duplicateVehicle(this.vehicle);
        // } else if( this.flag == "delete") {
        //     this._adminVehiclesService.deleteVehicle(this.vehicle);
        // }

        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}
