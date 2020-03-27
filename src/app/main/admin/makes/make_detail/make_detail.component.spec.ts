import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDetailComponent } from './make_detail.component';

describe('MakeDetailComponent', () => {
  let component: MakeDetailComponent;
  let fixture: ComponentFixture<MakeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
