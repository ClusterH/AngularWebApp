import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Vehicle
{
    id: string;
    name: string;
    company: string;
    group: string;
    subgroup: string;
    operator: string;
    unittype: string;
    serviceplan: string;
    producttype: string;
    make: string;
    model: string;
    isactive: string;
    timezone: string;
    
    /**
     * Constructor
     *
     * @param vehicle
     */
    constructor(vehicle?)
    {
        vehicle = vehicle || {};
        this.id = vehicle.id || FuseUtils.generateGUID();
        this.name = vehicle.name || '';
        this.company = vehicle.company || '';
        this.group = vehicle.group || '';
        this.subgroup = vehicle.subgroup || '';
        this.operator = vehicle.operator || '';
        this.unittype = vehicle.unittype || '';
        this.serviceplan = vehicle.serviceplan || '';
        this.producttype = vehicle.producttype || '';
        this.make = vehicle.make || '';
        this.model = vehicle.model || '';
        this.isactive = vehicle.isactive || '';
        this.timezone = vehicle.timezone || '';
    }
}
