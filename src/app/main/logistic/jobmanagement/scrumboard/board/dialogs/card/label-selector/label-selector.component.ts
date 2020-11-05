import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { ScrumboardService } from 'app/main/logistic/jobmanagement/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'scrumboard-label-selector',
    templateUrl: './label-selector.component.html',
    styleUrls: ['./label-selector.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ScrumboardLabelSelectorComponent implements OnInit, OnDestroy {
    @Input('card')
    card: any;

    @Output()
    cardLabelsChanged: EventEmitter<any>;

    board: any;
    labelsMenuView: string;
    selectedLabel: any;
    newLabel: any;
    toggleInArray: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ScrumboardService} _scrumboardService
     */
    constructor(
        private _scrumboardService: ScrumboardService
    ) {
        // Set the defaults
        this.cardLabelsChanged = new EventEmitter();
        this.labelsMenuView = 'labels';
        this.newLabel = {
            id: '',
            name: '',
            color: 'blue-400'
        };
        this.toggleInArray = FuseUtils.toggleInArray;

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
     * Card labels changed
     */
    onCardLabelsChanged(label): void {


        if (this.card.idlabels.indexOf(label.id) == -1) {
            this._scrumboardService.removeCardLabel(label.id, this.card.id)
                .then(res => {

                });
        } else {
            this._scrumboardService.assignLabelToCard(label.id, this.card.id)
                .then(res => {

                });
        }



        this.cardLabelsChanged.next();
    }

    /**
     * On label change
     */
    onLabelChange(): void {
        // this._scrumboardService.updateBoard(this.board);
    }

    /**
     * Add new label
     */
    addNewLabel(): void {

        this._scrumboardService.saveBoardLabel(this.newLabel, this.board.id)
            .then(res => {

                this.newLabel.id = res.TrackingXLAPI.DATA[0].id;

                this._scrumboardService.assignLabelToCard(this.newLabel.id, this.card.id)
                    .then(res => {

                        if (res.responseCode == 100) {
                            this.board.labels.push(Object.assign({}, this.newLabel));
                            this.newLabel = {
                                id: '',
                                name: '',
                                color: 'blue-400'
                            };

                            this.labelsMenuView = 'labels';


                        }
                    });
            });
    }

    editLabel(label) {
        this._scrumboardService.saveBoardLabel(label, this.board.id)
            .then(res => {


                this._scrumboardService.assignLabelToCard(res.TrackingXLAPI.DATA[0].id, this.card.id)
                    .then(res => {

                    });
            });

        // this.board.labels.push(Object.assign({}, label));
        this.labelsMenuView = 'labels';
    }

    deleteLabel(selectedLabel) {

        this._scrumboardService.deleteBoardLabel(selectedLabel.id)
            .then(res => {


                for (let i = 0; i < this.board.labels.length; i++) {
                    if (this.board.labels[i].id == selectedLabel.id) {
                        this.board.labels.splice(i, 1);
                        return;
                    }
                };



                // this._scrumboardService.removeCardLabel(selectedLabel.id, this.card.id)
                // .then(res => {
                //
                // });
            });

    }
}
