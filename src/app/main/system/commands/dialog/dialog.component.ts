import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { CommandsService } from 'app/main/system/commands/services/commands.service';
import { locale as commandsEnglish } from 'app/main/system/commands/i18n/en';
import { locale as commandsSpanish } from 'app/main/system/commands/i18n/sp';
import { locale as commandsFrench } from 'app/main/system/commands/i18n/fr';
import { locale as commandsPortuguese } from 'app/main/system/commands/i18n/pt';

@Component({
    selector: 'command-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

   command: any;
   flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private commandsService: CommandsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) {command, flag} 
    ) {
        this._fuseTranslationLoaderService.loadTranslations(commandsEnglish, commandsSpanish, commandsFrench, commandsPortuguese);

        this.command = command;
        this.flag = flag;
    }

    ngOnInit() {
    }

    save() {
        if(this.flag == "duplicate") {
        
            this.command.id = 0;
            this.command.name = '';
            this.command.createdwhen = '';
            this.command.createdbyname = '';
            this.command.lastmodifieddate = '';
            this.command.lastmodifiedbyname = '';
    
            localStorage.setItem("command_detail", JSON.stringify(this.command));
    
            console.log("localstorage:", JSON.parse(localStorage.getItem("command_detail")));
    
            this.router.navigate(['system/commands/command_detail']);
        } else if( this.flag == "delete") {
            this.commandsService.deleteCommand(this.command.id)
            .subscribe((result: any) => {
                if ((result.responseCode == 200)||(result.responseCode == 100)) {
                    this.reloadComponent();
                }
            });
        }

        this.dialogRef.close();
    }

    close() {
        localStorage.removeItem("command_detail");
        this.dialogRef.close();
    }

    goback() {
        this.dialogRef.close();
        localStorage.removeItem("command_detail");

        this.router.navigate(['system/commands/commands']);
    }

    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['system/commands/commands']);
    }

}
