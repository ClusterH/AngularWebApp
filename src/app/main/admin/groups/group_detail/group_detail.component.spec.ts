import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDetailComponent } from './group_detail.component';

describe('GroupDetailComponent', () => {
    let component: GroupDetailComponent;
    let fixture: ComponentFixture<GroupDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
