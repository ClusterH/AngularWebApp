import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { UnitInfoService } from 'app/main/home/maps/services/unitInfo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'unitInfo-panel',
    templateUrl  : './unitInfo-panel.component.html',
    styleUrls    : ['./unitInfo-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UnitInfoPanelComponent implements OnInit, OnDestroy
{
    date: Date;
    events: any[];
    notes: any[];
    settings: any;
    clickedMarkerInfo: any;

    private _unsubscribeAll: Subject<any>;


    /**
     * Constructor
     */
    constructor(
        public unitInfoService: UnitInfoService
    )
    {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true,
            showVehicles: true
        };
    }

    ngOnInit(): void
    {
        // this.unitInfoService.onVehMarkerClickChanged
            // .pipe(takeUntil(this._unsubscribeAll))
            // .subscribe((res: any) => {
            //     this.clickedMarkerInfo = res;

            //     // this._adminVehMarkersService.getBoardMembers()
            //     // .then((res: any) => {
            //     //     console.log(res);
            //     //     this.board.members = res.TrackingXLAPI.DATA;

            //     // });

            //     console.log(this.clickedMarkerInfo);
                
            // });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next();
        // this._unsubscribeAll.complete();
    }
}
