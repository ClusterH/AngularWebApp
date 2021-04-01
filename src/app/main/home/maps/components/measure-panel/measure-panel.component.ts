import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RoutesService } from '../../services';

@Component({
  selector: 'app-measure-panel',
  templateUrl: './measure-panel.component.html',
  styleUrls: ['./measure-panel.component.scss']
})
export class MeasurePanelComponent implements OnInit {
  @Output() finishMeasurementEmitter = new EventEmitter();

  constructor(public routesService: RoutesService) { }

  ngOnInit(): void {
  }

  confirmMeasure(confirm: boolean): void {
    if (confirm) {
      this.finishMeasurementEmitter.emit(true);
      this.routesService.resetMeasurement();
      this.routesService.showDialog = false;
    } else {
      this.routesService.resetMeasurement();
    }
  }
}
