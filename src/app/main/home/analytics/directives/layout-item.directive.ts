import { Directive, Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { StopcomplianceComponent } from '../components/stopcompliance/stopcompliance.component';
import { StopcomplianceSMComponent } from '../components/stopcompliancesm/stopcompliancesm.component';
import { MileageComponent } from '../components/mileage/mileage.component';
import { MpgComponent } from '../components/mpg/mpg.component';
import { NumberOfVehiclesComponent } from '../components/numberofvehicles/numberofvehicles.component';
import { NumberOfUsersComponent } from '../components/numberofusers/numberofusers.component';

const components = {
    StopCompliance: StopcomplianceComponent,
    StopComplianceSM: StopcomplianceSMComponent,
    Mileage: MileageComponent,
    MPG: MpgComponent,
    NumberOfVehicles: NumberOfVehiclesComponent,
    NumberOfUsers: NumberOfUsersComponent,
};

@Directive({
    selector: '[appLayoutItem]'
})
export class LayoutItemDirective implements OnChanges {
    @Input() componentRef: string;
    // @Input() selectedOption: any;

    component: ComponentRef<any>;

    constructor(
        private container: ViewContainerRef,
        private resolver: ComponentFactoryResolver
    ) { }

    ngOnChanges(): void {
        // console.log('directiveSelectedOption===>>>', this.selectedOption);
        const component = components[this.componentRef];
        if (component) {
            const factory = this.resolver.resolveComponentFactory<any>(component);
            this.component = null;
            this.component = this.container.createComponent(factory);
        }
    }
}