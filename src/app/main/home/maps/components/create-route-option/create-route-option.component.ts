import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AgmDirectionGeneratorService } from 'app/sharedModules/services';
import { SaveRouteDialogComponent } from '../dialog/dialog.component';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-route-option',
  templateUrl: './create-route-option.component.html',
  styleUrls: ['./create-route-option.component.scss']
})
export class CreateRouteOptionComponent implements OnInit, OnDestroy {
  isRemoveRouteDialog: boolean = false;
  isCancelRouteDialog: boolean = false;
  private _unsubscribeAll: Subject<any>;

  @Output() removeRouteEmitter = new EventEmitter();
  @Output() cancelRouteEmitter = new EventEmitter();
  @Output() saveRouteEmitter = new EventEmitter();

  constructor(
    public _matDialog: MatDialog,
    public agmDirectionGeneratorService: AgmDirectionGeneratorService,
  ) {
    this._unsubscribeAll = new Subject();

    this.agmDirectionGeneratorService.newRouteLocations = [];
    this.agmDirectionGeneratorService.newRouteOrigin = undefined;
    this.agmDirectionGeneratorService.newRouteDestination = undefined;
    this.agmDirectionGeneratorService.newRouteStops = [];
    this.agmDirectionGeneratorService.newRouteStopsTemp = [];
    this.agmDirectionGeneratorService.newRoutePath = [];
    this.agmDirectionGeneratorService.isGenerateRoute = false;
    this.agmDirectionGeneratorService.isImportStopsFromFile = false;
    this.agmDirectionGeneratorService.isAddStopsOnMap = true;
    this.agmDirectionGeneratorService.waypointDistance = [];
    this.agmDirectionGeneratorService.countDisRequest = 0;
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  closeDialog(isConfirm): void {
    this.agmDirectionGeneratorService.isImportStopsFromFile = false;

    if (isConfirm) {
      this.agmDirectionGeneratorService.generateWayPointList(this.agmDirectionGeneratorService.newRouteStopsTemp).then(res => {
        this.agmDirectionGeneratorService.newRouteStops = [...this.agmDirectionGeneratorService.newRouteStops, ...res];
        this.agmDirectionGeneratorService.drawRouthPath(this.agmDirectionGeneratorService.newRouteStops);
      })
    }
  }

  closeConfirmDialog(isConfirm): void {
    this.isRemoveRouteDialog = false;

    if (isConfirm) {
      // this.agmDirectionGeneratorService.newRouteStops = [...[]];
      // this.agmDirectionGeneratorService.newRouteLocations = [];
      // this.agmDirectionGeneratorService.isGenerateRoute = false;
      this.agmDirectionGeneratorService.resetRoutes();

      this.removeRouteEmitter.emit();
    } else {
      return;
    }
  }

  closeCancelConfirmDialog(isConfirm): void {
    this.isCancelRouteDialog = false;

    if (isConfirm) {
      // this.agmDirectionGeneratorService.newRouteStops = [...[]];
      // this.agmDirectionGeneratorService.newRouteLocations = [];
      // this.agmDirectionGeneratorService.isGenerateRoute = false;
      this.agmDirectionGeneratorService.resetRoutes();
      this.cancelRouteEmitter.emit();
    } else {
      return;
    }
  }

  getCSVFileData(event): void {
    console.log(event);
    console.log(this.agmDirectionGeneratorService.newRouteOrigin);
    if (!this.agmDirectionGeneratorService.newRouteOrigin) {
      this.agmDirectionGeneratorService.newRouteOrigin = event[0].location;
      this.agmDirectionGeneratorService.newRouteDestination = event[event.length - 1].location;
      this.agmDirectionGeneratorService.newRouteLocations = [
        ...this.agmDirectionGeneratorService.newRouteLocations,
        this.agmDirectionGeneratorService.newRouteOrigin,
        this.agmDirectionGeneratorService.newRouteDestination
      ];

      this.agmDirectionGeneratorService.newRouteStopsTemp = event.slice(1, event.length - 1);
    } else if (!this.agmDirectionGeneratorService.newRouteDestination) {
      this.agmDirectionGeneratorService.newRouteDestination = event[event.length - 1].location;
      this.agmDirectionGeneratorService.newRouteStopsTemp = event.slice(0, event.length - 1);
    } else {
      this.agmDirectionGeneratorService.newRouteStopsTemp = [...event];
    }
  }

  addStopsOnMap(): void {
    this.agmDirectionGeneratorService.isAddStopsOnMap = !this.agmDirectionGeneratorService.isAddStopsOnMap;
    if (this.agmDirectionGeneratorService.isAddStopsOnMap) {
      this.agmDirectionGeneratorService.newRouteStops = [];
    }
  }

  cancelRoute(): void {
    this.isCancelRouteDialog = true;
  }

  removeRoute(): void {
    if (this.agmDirectionGeneratorService.newRouteLocations.length > 1) {
      this.isRemoveRouteDialog = true;
    } else {
      return;
    }
  }

  saveRoute(): void {
    if (this.agmDirectionGeneratorService.newRouteLocations.length < 2) {
      alert('Please generate route first');
      return
    } else {
      this.agmDirectionGeneratorService.addRoute();

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.panelClass = 'save-route-dialog'
      const dialogRef = this._matDialog.open(SaveRouteDialogComponent, dialogConfig);
      dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
        this.saveRouteEmitter.emit(result);
      });
    }
  }
}
