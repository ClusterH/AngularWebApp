import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faTools, faCogs, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-routelist-board',
    templateUrl: './routelist-board.component.html',
    styleUrls: ['./routelist-board.component.scss'],
    animations: fuseAnimations,
})
export class RoutelistBoardComponent implements OnInit {
    @Input() totalJobs: number;
    @Input() totalDrivers: number;
    @Output() boardClickEmitter = new EventEmitter();
    faTools = faTools;
    faCogs = faCogs;
    faDrivers = faUserCircle;
    constructor() { }

    ngOnInit(): void {
    }

    onClick(type) {
        // if (type == 'generate') {
        this.boardClickEmitter.emit(type);
        // } else if (type == 'jobs') {

        // } else if (type == 'drivers') {

        // }
    }

}
