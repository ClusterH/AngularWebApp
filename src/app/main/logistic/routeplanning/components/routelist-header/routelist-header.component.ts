import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-routelist-header',
    templateUrl: './routelist-header.component.html',
    styleUrls: ['./routelist-header.component.scss']
})
export class RoutelistHeaderComponent implements OnInit {
    @Input() routeCount: number = 0;
    routeDistance: number = 0;
    routeTimeCount: number = 0;
    routeTime: string = '--:-- - --:--';
    @Output() moveToGenerateBoardEmitter = new EventEmitter();
    constructor() { }

    ngOnInit(): void {
    }

    moveToGenerateBoard(): void {
        this.moveToGenerateBoardEmitter.emit('generate');
    }

}
