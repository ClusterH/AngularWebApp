import { Directive, Input, OnChanges, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { StopcomplianceComponent } from '../components/stopcompliance/stopcompliance.component';
import { StopcomplianceSMComponent } from '../components/stopcompliancesm/stopcompliancesm.component';
import { MileageComponent } from '../components/mileage/mileage.component';
import { NumberOfVehiclesComponent } from '../components/numberofvehicles/numberofvehicles.component';
import { NumberOfUsersComponent } from '../components/numberofusers/numberofusers.component';

const components = {
    StopCompliance: StopcomplianceComponent,
    StopComplianceSM: StopcomplianceSMComponent,
    Mileage: MileageComponent,
    NumberOfVehicles: NumberOfVehiclesComponent,
    NumberOfUsers: NumberOfUsersComponent,
};

@Directive({
    selector: '[appLayoutItem]'
})
export class LayoutItemDirective implements OnChanges {

    @Input() componentRef: string;

    component: ComponentRef<any>;

    constructor(
        private container: ViewContainerRef,
        private resolver: ComponentFactoryResolver
    ) { }

    ngOnChanges(): void {

        const component = components[this.componentRef];

        if (component) {
            const factory = this.resolver.resolveComponentFactory<any>(component);
            this.component = this.container.createComponent(factory);
        }

    }

}
