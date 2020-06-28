import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fuelregistriesEnglish } from 'app/main/fuelmanagement/fuelregistries/i18n/en';
import { locale as fuelregistriesFrench } from 'app/main/fuelmanagement/fuelregistries/i18n/fr';
import { locale as fuelregistriesPortuguese } from 'app/main/fuelmanagement/fuelregistries/i18n/pt';
import { locale as fuelregistriesSpanish } from 'app/main/fuelmanagement/fuelregistries/i18n/sp';
import { FuelregistriesDataSource } from "app/main/fuelmanagement/fuelregistries/services/fuelregistries.datasource";
import { FuelregistriesService } from 'app/main/fuelmanagement/fuelregistries/services/fuelregistries.service';

@Component({
    selector: 'fuelregistry-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   fuelregistry: any;
   flag: any;
   dataSource: FuelregistriesDataSource;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private fuelregistriesService: FuelregistriesService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {fuelregistry, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(fuelregistriesEnglish, fuelregistriesSpanish, fuelregistriesFrench, fuelregistriesPortuguese);

        this.fuelregistry = fuelregistry;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.fuelregistry.id = 0;
            this.fuelregistry.datentime = '';
    
            localStorage.setItem("fuelregistry_detail", JSON.stringify(this.fuelregistry));

            this.dialogRef.close();
    
            this.router.navigate(['fuelmanagement/fuelregistries/fuelregistry_detail']);
        } else if( this.flag == "delete") {
            // this.reloadComponent();

            this.fuelregistriesService.deleteFuelregistry(this.fuelregistry.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    console.log(result);
                    
                    this.dialogRef.close(result);
                }
            });
        }
    }

    close() {
        localStorage.removeItem("fuelregistry_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("fuelregistry_detail");

        this.router.navigate(['fuelmanagement/fuelregistries/fuelregistries']);
    }
}
