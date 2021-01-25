import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitormapComponent } from './monitormap.component';

describe('MonitormapComponent', () => {
  let component: MonitormapComponent;
  let fixture: ComponentFixture<MonitormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
