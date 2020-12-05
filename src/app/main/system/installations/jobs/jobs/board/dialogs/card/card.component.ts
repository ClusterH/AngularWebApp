import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { InstallationService } from '../../../../services'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'installation-board-card-dialog',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InstallationCardDialogComponent implements OnInit, OnDestroy {
    card: any;
    board: any;
    list: any;

    cardCommentForm: FormGroup;

    flagEditComment: boolean = false;
    currentCommentId: number = 0;
    addedChecklistId: string = '0';
    addedCheckItemId: string = '0';

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
     * @param {MatDialogRef<InstallationCardDialogComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     * @param {InstallationService} _installationService
     */
    constructor(
        public matDialogRef: MatDialogRef<InstallationCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _matDialog: MatDialog,
        private _installationService: InstallationService,
        private _formBuilder: FormBuilder,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        console.log(this._data);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._installationService.onBoardChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(board => {
                this.board = board;
                console.log(board);

                this.card = this.board.cards[0].find((_card) => {

                    return this._data.cardId == _card.id;
                });

                // this.dateConvert(this.card.due);
                console.log(this.card);

                this.list = this.board.lists.find((_list) => {
                    return this._data.listId == _list.id;
                });

                console.log(this.list);



                this._installationService.getBoardMembers()
                    .then((res: any) => {
                        this.board.members = res.TrackingXLAPI.DATA;

                    });
            });

        this.cardCommentForm = this._formBuilder.group({
            newComment: [null, Validators.required],
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
     * Remove due date
     */
    removeDueDate(): void {
        this.card.due = '';
        // this.updateCard();
    }

    /**
     * Toggle subscribe
     */
    toggleSubscribe(): void {
        this.card.subscribed = !this.card.subscribed;

        // this.updateCard();
    }

    /**
     * Toggle cover image
     *
     * @param attachmentId
     */
    toggleCoverImage(attachmentId): void {
        if (this.card.idattachmentcover === attachmentId) {
            this.card.idattachmentcover = '';
        }
        else {
            this.card.idattachmentcover = attachmentId;
        }

        // this.updateCard();
    }

    /**
     * Remove attachment
     *
     * @param attachment
     */
    removeAttachment(attachment): void {
        if (attachment.id === this.card.idattachmentcover) {
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
    removeChecklist(checklist): void {
        this._installationService.deleteBoardCardChecklist(checklist.id, this.card.id)
            .then(res => {

            });

        this.card.checklists.splice(this.card.checklists.indexOf(checklist), 1);

        // this.updateCard();
    }

    /**
     * Update checked count
     *
     * @param list
     */
    updateCheckedCount(list): void {
        const checkItems = list.checkitems;
        let checkedItems = 0;
        let allCheckedItems = 0;
        let allCheckItems = 0;

        for (const checkItem of checkItems) {


            if (checkItem.checked) {
                checkedItems++;
            }
        }

        list.checkitemschecked = checkedItems;

        for (const item of this.card.checklists) {
            allCheckItems += item.checkitems.length;
            allCheckedItems += item.checkitemschecked;
        }

        this.card.checkitems = allCheckItems;
        this.card.checkitemschecked = allCheckedItems;

        // this.updateCard();
    }

    saveCheckStatus(item, checklistid): void {
        let checkItem = {
            id: item.id,
            name: item.name,
            checked: item.checked,
            checklistid: checklistid
        }

        this._installationService.saveBoardCardCheckItem(checkItem)
            .then(res => {

                this.addedCheckItemId = res.TrackingXLAPI.DATA[0].id;

                // newCheckItem.id = this.addedCheckItemId;

                // checkList.checkitems.push(newCheckItem);

                // this.updateCheckedCount(checkList);

                // form.setValue({checkItem: ''});

            });
    }

    /**
     * Remove checklist item
     *
     * @param checkItem
     * @param checklist
     */
    removeChecklistItem(checkItem, checklist): void {
        this._installationService.deleteBoardCardCheckItem(checkItem.id, checklist.id, this.card.id)
            .then(res => {

            });

        checklist.checkitems.splice(checklist.checkitems.indexOf(checkItem), 1);

        this.updateCheckedCount(checklist);

        // this.updateCard();
    }

    /**
     * Add check item
     *
     * @param {NgForm} form
     * @param checkList
     */
    addCheckItem(form: NgForm, checkList): void {
        const checkItemVal = form.value.checkItem;

        if (!checkItemVal || checkItemVal === '') {
            return;
        }

        let newCheckItem = {
            id: '0',
            name: checkItemVal,
            checked: false,
            checklistid: checkList.id,
            cardid: this.card.id
        };

        this._installationService.saveBoardCardCheckItem(newCheckItem)
            .then(res => {

                this.addedCheckItemId = res.TrackingXLAPI.DATA[0].id;

                newCheckItem.id = this.addedCheckItemId;

                checkList.checkitems.push(newCheckItem);

                this.updateCheckedCount(checkList);

                form.setValue({ checkItem: '' });

            });
        // this.updateCard();
    }

    /**
     * Add checklist
     *
     * @param {NgForm} form
     */
    addChecklist(form: NgForm): void {
        const newCheckList = {
            id: '0',
            name: form.value.checklistTitle,
            checkitemschecked: 0,
            cardid: this.card.id
        }

        this._installationService.saveBoardCardChecklist(newCheckList)
            .then(res => {

                this.addedChecklistId = res.TrackingXLAPI.DATA[0].id;
            });

        this.card.checklists.push({
            id: this.addedChecklistId,
            name: form.value.checklistTitle,
            checkitemschecked: 0,
            checkitems: []
        });



        form.setValue({ checklistTitle: '' });
        form.resetForm();
        this.checklistMenu.closeMenu();
        // this.updateCard();
    }

    /**
     * On checklist menu open
     */
    onChecklistMenuOpen(): void {
        setTimeout(() => {
            this.newCheckListTitleField.nativeElement.focus();
        });
    }

    /**
     * Add new comment
     *
     * @param {NgForm} form
     */
    addNewComment(): void {
        //
        // const newCommentText = form.value.newComment;

        const newCommentText = this.cardCommentForm.get('newComment').value;


        const newComment = {
            idmember: '345',
            message: newCommentText,
            time: new Date().toISOString()
        };

        this._installationService.addNewComment('0', newComment, this.card.id)
            .then(res => {

            });



        this.card.comments.unshift(newComment);

        this.cardCommentForm.get('newComment').setValue('');
        this.flagEditComment = false;

        // this.updateCard();
    }

    // editComment(comment):void {
    //
    //     this.flagEditComment = true;
    //     this.currentCommentId = 21;
    //     this.cardCommentForm.get('newComment').setValue(comment.message);
    // }

    /**
     * Remove card
     */
    removeCard(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the card?';

        this.confirmDialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result) {
                this.matDialogRef.close();
                this._installationService.removeCard(this.card.id, this.list.id);
            }
        });
    }

    /**
     * Update card
     */
    updateCard(): void {
        this.matDialogRef.close()

        if (this.card.due != '') {
            this.card.due = this.dateFormat(new Date(this.card.due));
        }


        this._installationService.updateCard(this.card, this.list.id, this.board.id);
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

    onMemberCheckStatus(member) {
        if (this.card.idmembers.indexOf(member.id) == -1) {
            this._installationService.deleteCardUser(member.id, this.card.id)
                .then(res => {

                });
        } else {
            this._installationService.insertCardUser(member.id, this.card.id)
                .then(res => {

                });
        }
    }
}
