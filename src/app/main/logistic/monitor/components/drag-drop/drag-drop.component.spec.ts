import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorFileDragDropComponent } from './drag-drop.component';

describe('MonitorFileDragDropComponent', () => {
  let component: MonitorFileDragDropComponent;
  let fixture: ComponentFixture<MonitorFileDragDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonitorFileDragDropComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorFileDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
