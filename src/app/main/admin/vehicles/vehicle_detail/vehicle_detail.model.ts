import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Vehicle
{
    id: string;
    name: string;
    company: string;
    group: string;
    subgroup: string;
    account: string;
    operator: string;
    unittype: string;
    serviceplan: string;
    producttype: string;
    make: string;
    model: string;
    isactive: string;
    timezone: string;
    created: string;
    createdbyname: string;
    deletedwhen: string;
    deletedbyname: string;
    lastmodifieddate: string;
    lastmodifiedbyname: string;
    
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
        this.account = vehicle.account || '';
        this.operator = vehicle.operator || '';
        this.unittype = vehicle.unittype || '';
        this.serviceplan = vehicle.serviceplan || '';
        this.producttype = vehicle.producttype || '';
        this.make = vehicle.make || '';
        this.model = vehicle.model || '';
        this.isactive = vehicle.isactive || '';
        this.timezone = vehicle.timezone || '';
        this.created = vehicle.created || '';
        this.createdbyname = vehicle.createdbyname || '';
        this.deletedwhen = vehicle.deletedbyname || '';
        this.lastmodifieddate = vehicle.lastmodifieddate || '';
        this.lastmodifiedbyname = vehicle.lastmodifiedbyname || '';
    }
}
