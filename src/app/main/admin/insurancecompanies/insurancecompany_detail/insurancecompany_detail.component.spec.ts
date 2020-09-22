import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InsurancecompanyDetailComponent } from './insurancecompany_detail.component';

describe('insurancecompanyDetailComponent', () => {
    let component: InsurancecompanyDetailComponent;
    let fixture: ComponentFixture<InsurancecompanyDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InsurancecompanyDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InsurancecompanyDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
