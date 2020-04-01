import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimcardDetailComponent } from './simcard_detail.component';

describe('SimcardDetailComponent', () => {
  let component: SimcardDetailComponent;
  let fixture: ComponentFixture<SimcardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimcardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimcardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
