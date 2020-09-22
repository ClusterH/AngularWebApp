import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { CommandsService } from 'app/main/system/commands/services/commands.service';
import { locale as commandsEnglish } from 'app/main/system/commands/i18n/en';
import { locale as commandsSpanish } from 'app/main/system/commands/i18n/sp';
import { locale as commandsFrench } from 'app/main/system/commands/i18n/fr';
import { locale as commandsPortuguese } from 'app/main/system/commands/i18n/pt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'command-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class CourseDialogComponent implements OnDestroy {
    private _unsubscribeAll: Subject<any>;
    command: any;
    flag: any;

    constructor(
        private router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private commandsService: CommandsService,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) { command, flag }
    ) {
        this._fuseTranslationLoaderService.loadTranslations(commandsEnglish, commandsSpanish, commandsFrench, commandsPortuguese);
        this._unsubscribeAll = new Subject();
        this.command = command;
        this.flag = flag;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    save() {
        if (this.flag == "duplicate") {
            this.command.id = 0;
            this.command.name = '';
            this.command.createdwhen = '';
            this.command.createdbyname = '';
            this.command.lastmodifieddate = '';
            this.command.lastmodifiedbyname = '';
            this.dialogRef.close(this.command);
        } else if (this.flag == "delete") {
            console.log(this.flag, this.command.id);
            this.commandsService.deleteCommand(this.command.id).pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    if ((result.responseCode == 200) || (result.responseCode == 100)) {
                        this.dialogRef.close(result);
                    }
                });
        }
    }

    close() { this.dialogRef.close(); }
    goback() { this.dialogRef.close('goback'); }
}