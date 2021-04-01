import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { merge, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { CreateZoneDialogComponent } from '../create-zone-dialog/dialog.component';
import { ZonesService } from '../../services';

@Component({
  selector: 'app-create-zone-option',
  templateUrl: './create-zone-option.component.html',
  styleUrls: ['./create-zone-option.component.scss']
})
export class CreateZoneOptionComponent implements OnInit, OnDestroy {
  isRemoveZoneDialog: boolean = false;
  private _unsubscribeAll: Subject<any>;

  @Output() removeZoneEmitter = new EventEmitter();
  @Output() saveZoneEmitter = new EventEmitter();

  constructor(
    public _matDialog: MatDialog,
    public zonesService: ZonesService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  closeConfirmDialog(isConfirm): void {
    this.isRemoveZoneDialog = false;

    if (isConfirm) {
      this.removeZoneEmitter.emit();
    } else {
      return;
    }
  }

  removeZone(): void {
    if (this.zonesService.zonePointsList.length > 2) {
      this.isRemoveZoneDialog = true;
    } else {
      return;
    }
  }

  saveZone(): void {
    if (this.zonesService.zonePointsList.length < 3) {
      alert('Please generate route first');
      return
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.panelClass = 'create-zone-dialog'
      const dialogRef = this._matDialog.open(CreateZoneDialogComponent, dialogConfig);
      dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(zoneId => {
        this.saveZoneEmitter.emit(zoneId);
      });
    }
  }
}
