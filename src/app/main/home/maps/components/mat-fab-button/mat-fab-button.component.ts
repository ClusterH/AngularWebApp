import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { matFabAnimations } from './mat-fab-animation';

@Component({
  selector: 'app-mat-fab-button',
  templateUrl: './mat-fab-button.component.html',
  styleUrls: ['./mat-fab-button.component.scss'],
  animations: matFabAnimations
})
export class MatFabButtonComponent implements OnInit {
  fabButtons = [
    {
      icon: 'timeline',
      label: 'Measure Distance',
      isActive: false
    },
    {
      icon: 'gesture',
      label: 'Create Route',
      isActive: false
    },
    {
      icon: 'center_focus_strong',
      label: 'Create Geofence',
      isActive: false
    },
    {
      icon: 'place',
      label: 'Create POI',
      isActive: false
    }
  ];
  buttons = [];
  fabTogglerState = 'inactive';
  @Output() createNewOptionEmitter = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  createNewOption(option: string): void {
    this.onToggleFab();
    this.fabButtons.map(item => {
      if (item.label !== option) {
        item.isActive = false;
      } else {
        item.isActive = !item.isActive;
        if (item.isActive) {
          this.createNewOptionEmitter.emit(item.label);
        } else {
          this.createNewOptionEmitter.emit('Anyone');
        }
      }
      return item
    });
  }
}
