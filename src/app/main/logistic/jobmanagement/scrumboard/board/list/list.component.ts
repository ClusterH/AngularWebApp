import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Card } from 'app/main/logistic/jobmanagement/scrumboard/card.model';
import { ScrumboardCardDialogComponent } from 'app/main/logistic/jobmanagement/scrumboard/board/dialogs/card/card.component';

@Component({
    selector: 'scrumboard-board-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardListComponent implements OnInit, OnDestroy {
    board: any;
    dialogRef: any;

    draggedCardId: string = '';
    destinationListId: string = '';

    @Input()
    list;

    @ViewChild(FusePerfectScrollbarDirective)
    listScroll: FusePerfectScrollbarDirective;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {ScrumboardService} _scrumboardService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _scrumboardService: ScrumboardService,
        private _matDialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(board => {

                this.board = board;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On list name changed
     *
     * @param newListName
     */
    onListNameChanged(newListName): void {
        this.list.name = newListName;
        this._scrumboardService.updateList(this.list, this.board.id);
    }

    /**
     * On card added
     *
     * @param newCardName
     */
    onCardAdd(newCardName): void {
        if (newCardName === '') {
            return;
        }

        let due = this.dateFormat(new Date());
        console.log(due);

        this._scrumboardService.addCard(this.board.id, this.list.id, new Card({ name: newCardName, due: due }));

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
     * Remove list
     *
     * @param listId
     */
    removeList(listId): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the list and it\'s all cards?';

        this.confirmDialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this._scrumboardService.removeList(listId);
            }
        });
    }

    /**
     * Open card dialog
     *
     * @param cardId
     */
    openCardDialog(cardId): void {
        this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
            panelClass: 'scrumboard-card-dialog',
            data: {
                cardId: cardId,
                listId: this.list.id
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    /**
     * On drop
     *
     * @param ev
     */
    // onDrop(ev, cardid, listid): void
    // {
    //     console.log("card: ", ev, cardid, listid);
    //     // this._scrumboardService.updateBoard(this.board);
    // }

    onDropCard(ev, list): void {
        console.log("drop card: ", ev, list.id);

        this.destinationListId = list.id;

        this._scrumboardService.draggedCardId
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(cardId => {

                this.draggedCardId = cardId;
            });

        console.log(this.draggedCardId, this.destinationListId);

        this._scrumboardService.cardMove(this.draggedCardId, this.destinationListId);
        // .subscribe((res: any) => {
        //     console.log(res);
        // });
        // this._scrumboardService.updateBoard(this.board);
    }

    onDragCard(ev, cardid, listid): void {
        console.log("drag card: ", ev, cardid, listid);

        this._scrumboardService.draggedCardId.next(cardid);

        // this._scrumboardService.updateBoard(this.board);
    }

    // onDrop(ev, list, cardid): void
    // {
    //     console.log("drag card: ", ev, list.id, cardid);
    //     // this._scrumboardService.updateBoard(this.board);
    // }
}
