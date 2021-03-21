import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
// import { InstallationCardDialogComponent } from 'app/main/system/installations/jobs/jobs/board/dialogs/card/card.component';
import { JobCardDialogComponent } from 'app/main/system/installations/jobs/jobs/board/dialogs/job/dialog.component';
import { CardDnDConfirmDialogComponent } from 'app/main/system/installations/jobs/confirmDialog/cardDnDConfirmDialog.component';
import { Card } from 'app/main/system/installations/jobs/model/card.model';
import { InstallationService } from '../../../services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as reportEnglish } from 'app/main/system/installations/jobs/i18n/en';
import { locale as reportFrench } from 'app/main/system/installations/jobs/i18n/fr';
import { locale as reportPortuguese } from 'app/main/system/installations/jobs/i18n/pt';
import { locale as reportSpanish } from 'app/main/system/installations/jobs/i18n/sp';
import { DroppableDirective } from '@swimlane/ngx-dnd';

@Component({
    selector: 'installation-board-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallationBoardListComponent implements OnInit, OnDestroy {
    board: any;
    dialogRef: any;
    draggedCardId: string = '';
    destinationListId: string = '';
    @Input() list;
    @ViewChild(FusePerfectScrollbarDirective)
    listScroll: FusePerfectScrollbarDirective;
    @ViewChild(DroppableDirective)
    dnd: DroppableDirective;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private _installationService: InstallationService,
        private _matDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this._unsubscribeAll = new Subject();
        this._fuseTranslationLoaderService.loadTranslations(reportEnglish, reportSpanish, reportFrench, reportPortuguese);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._installationService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(board => { this.board = board; });
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
     * On card added
     *
     * @param newCardName
     */
    onCardAdd(newCard): void {
        if (newCard === '') { return; }
        let due = this.dateFormat(new Date());

        this._installationService.addCard(this.board.id, this.list.id, new Card(newCard));
        setTimeout(() => {
            this.listScroll.scrollToBottom(0, 400);
        });
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
        }
        return str;
    }

    /**
     * Open card dialog
     *
     * @param cardId
     */
    openCardDialog(cardId): void {
        this._installationService.getInstallationDetail(cardId).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res.responseCode == 100) {
                this.dialogRef = this._matDialog.open(JobCardDialogComponent, {
                    panelClass: 'job-dialog',
                    disableClose: true,
                    data: {
                        cardId: cardId,
                        installerName: { name: this.board.name, id: this.board.id },
                        serviceDetail: res.TrackingXLAPI.DATA[0],
                        flag: 'edit'
                    }
                });
                this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => { });
            }
        })
    }

    /**
     * On drop
     *
     * @param ev
     */
    // onDrop(ev, cardid, listid): void
    // {
    //
    //     // this._installationService.updateBoard(this.board);
    // }

    onDropCard(ev, list): void {

        this.openConfirmDndDialog(list);
    }

    onDragCard(ev, cardid, listid): void {
        this._installationService.draggedCardId.next(cardid);
    }

    openConfirmDndDialog(list) {
        this.dialogRef = this._matDialog.open(CardDnDConfirmDialogComponent, {
            panelClass: 'confirm-dnd-dialog',
            disableClose: true,
        });

        this.dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res === 'move') {
                this.destinationListId = list.id;
                this._installationService.draggedCardId
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe(cardId => {
                        this.draggedCardId = cardId;
                    });

                this._installationService.cardMove(this.draggedCardId, this.destinationListId);
            } else {
                window.location.reload();
                // const currentRoute = this.router.url;

                // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                //     this.router.navigate([currentRoute]); // navigate to same route
                // });
            }
        })
    }

    test(event) {

    }
}