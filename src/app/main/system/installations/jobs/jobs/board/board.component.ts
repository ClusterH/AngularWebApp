import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { List } from 'app/main/system/installations/jobs/model/list.model';
import { InstallationService } from '../../services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as reportFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as reportPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as reportSpanish } from 'app/main/system/installations/jobs/i18n/sp';

@Component({
    selector: 'installation-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InstallationBoardComponent implements OnInit, OnDestroy {
    board: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _installationService: InstallationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
    }

    ngOnInit(): void {
        this._installationService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(board => {
                this.board = board;
                this._installationService.getBoardMembers().then((res: any) => {

                    this.board.members = res.TrackingXLAPI.DATA;
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On list add
     *
     * @param newListName
     */
    onListAdd(newListName): void {
        if (newListName === '') { return; }
        this._installationService.addList(new List({ name: newListName }), this.board.id);
    }

    /**
     * On board name changed
     *
     * @param newName
     */
    onBoardNameChanged(newName): void {
        this._installationService.updateBoard(this.board);
        this._location.go('logistic/installation/boards/' + this.board.id + '/' + this.board.uri);
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void {
    }
}