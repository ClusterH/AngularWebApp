import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateZoneOptionComponent } from './create-zone-option.component';

describe('CreateRouteOptionComponent', () => {
  let component: CreateZoneOptionComponent;
  let fixture: ComponentFixture<CreateZoneOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateZoneOptionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateZoneOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
