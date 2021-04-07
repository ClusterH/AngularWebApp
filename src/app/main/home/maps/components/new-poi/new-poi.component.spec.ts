import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPoiComponent } from './new-poi.component';

describe('NewPoiComponent', () => {
  let component: NewPoiComponent;
  let fixture: ComponentFixture<NewPoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPoiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
