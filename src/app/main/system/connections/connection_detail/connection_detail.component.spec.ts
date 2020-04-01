import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionDetailComponent } from './connection_detail.component';

describe('ConnectionDetailComponent', () => {
  let component: ConnectionDetailComponent;
  let fixture: ComponentFixture<ConnectionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
