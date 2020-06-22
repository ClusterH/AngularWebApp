import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';

import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'scrumboard-board-card-dialog',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ScrumboardCardDialogComponent implements OnInit, OnDestroy
{
    card: any;
    board: any;
    list: any;

    toggleInArray = FuseUtils.toggleInArray;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    @ViewChild('checklistMenuTrigger')
    checklistMenu: MatMenuTrigger;

    @ViewChild('newCheckListTitleField')
    newCheckListTitleField;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ScrumboardCardDialogComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        public matDialogRef: MatDialogRef<ScrumboardCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private _scrumboardService: ScrumboardService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this._scrumboardService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(board => {
                this.board = board;

                this.card = this.board.cards[0].find((_card) => {
                    
                    return this._data.cardId === _card.id;
                });

                this.dateConvert(this.card.due);

                this.list = this.board.lists.find((_list) => {
                    return this._data.listId === _list.id;
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Remove due date
     */
    removeDueDate(): void
    {
        this.card.due = '';
        // this.updateCard();
    }

    /**
     * Toggle subscribe
     */
    toggleSubscribe(): void
    {
        this.card.subscribed = !this.card.subscribed;

        // this.updateCard();
    }

    /**
     * Toggle cover image
     *
     * @param attachmentId
     */
    toggleCoverImage(attachmentId): void
    {
        if ( this.card.idattachmentcover === attachmentId )
        {
            this.card.idattachmentcover = '';
        }
        else
        {
            this.card.idattachmentcover = attachmentId;
        }

        // this.updateCard();
    }

    /**
     * Remove attachment
     *
     * @param attachment
     */
    removeAttachment(attachment): void
    {
        if ( attachment.id === this.card.idattachmentcover )
        {
            this.card.idattachmentcover = '';
        }

        this.card.attachments.splice(this.card.attachments.indexOf(attachment), 1);

        // this.updateCard();
    }

    /**
     * Remove checklist
     *
     * @param checklist
     */
    removeChecklist(checklist): void
    {
        this.card.checklists.splice(this.card.checklists.indexOf(checklist), 1);

        // this.updateCard();
    }

    /**
     * Update checked count
     *
     * @param list
     */
    updateCheckedCount(list): void
    {
        const checkItems = list.checkitems;
        let checkedItems = 0;
        let allCheckedItems = 0;
        let allCheckItems = 0;

        for ( const checkItem of checkItems )
        {
            if ( checkItem.checked )
            {
                checkedItems++;
            }
        }

        list.checkitemschecked = checkedItems;

        for ( const item of this.card.checklists )
        {
            allCheckItems += item.checkitems.length;
            allCheckedItems += item.checkitemchecked;
        }

        this.card.checkitems = allCheckItems;
        this.card.checkitemChecked = allCheckedItems;

        // this.updateCard();
    }

    /**
     * Remove checklist item
     *
     * @param checkItem
     * @param checklist
     */
    removeChecklistItem(checkItem, checklist): void
    {
        checklist.checkItems.splice(checklist.checkitems.indexOf(checkItem), 1);

        this.updateCheckedCount(checklist);

        // this.updateCard();
    }

    /**
     * Add check item
     *
     * @param {NgForm} form
     * @param checkList
     */
    addCheckItem(form: NgForm, checkList): void
    {
        const checkItemVal = form.value.checkItem;

        if ( !checkItemVal || checkItemVal === '' )
        {
            return;
        }

        const newCheckItem = {
            name   : checkItemVal,
            checked: false
        };

        checkList.checkItems.push(newCheckItem);

        this.updateCheckedCount(checkList);

        form.setValue({checkItem: ''});

        // this.updateCard();
    }

    /**
     * Add checklist
     *
     * @param {NgForm} form
     */
    addChecklist(form: NgForm): void
    {
        this.card.checklists.push({
            id               : FuseUtils.generateGUID(),
            name             : form.value.checklistTitle,
            checkitemchecked: 0,
            checkitems       : []
        });

        form.setValue({checklistTitle: ''});
        form.resetForm();
        this.checklistMenu.closeMenu();
        // this.updateCard();
    }

    /**
     * On checklist menu open
     */
    onChecklistMenuOpen(): void
    {
        setTimeout(() => {
            this.newCheckListTitleField.nativeElement.focus();
        });
    }

    /**
     * Add new comment
     *
     * @param {NgForm} form
     */
    addNewComment(form: NgForm): void
    {
        const newCommentText = form.value.newComment;

        const newComment = {
            idmember: '36027j1930450d8bf7b10158',
            message : newCommentText,
            time    : 'now'
        };

        this.card.comments.unshift(newComment);

        form.setValue({newComment: ''});

        this.updateCard();
    }

    /**
     * Remove card
     */
    removeCard(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the card?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.matDialogRef.close();
                this._scrumboardService.removeCard(this.card.id, this.list.id);
            }
        });
    }

    /**
     * Update card
     */
    updateCard(): void
    {
        console.log(this.card.due);
      
        this.card.due = this.dateFormat(new Date(this.card.due));
        console.log(this.card.due);

        this._scrumboardService.updateCard(this.card, this.list.id, this.board.id);
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

    dateConvert(date: string) {
        let month = date.split(' ')[0];
        let day = date.split(' ')[1];
        let year = date.split(' ')[2];
        let time = date.split("  ")[1];

        console.log(year, month, day, time);


    }

}
