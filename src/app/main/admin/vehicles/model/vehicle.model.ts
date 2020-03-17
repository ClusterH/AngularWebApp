import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Vehicle
{
    id: number;
    name: string;
    companyid: number;
    company: string;
    groupid: number;
    group: string;
    subgroup: number;
    accountid: number;
    account: string;
    operatorid: number;
    operator: string;
    unittypeid: number;
    unittype: string;
    serviceplanid: number;
    serviceplan: string;
    producttypeid: number;
    producttype: string;
    makeid: number;
    make: string;
    modelid: number;
    model: string;
    isactive: boolean;
    timezoneid: number
    timezone: string;
    created: string;
    createdby: number;
    createdbyname: string;
    deletedwhen: string;
    deletedby: number;
    deletedbyname: string;
    lastmodifieddate: string;
    lastmodifiedby: number;
    lastmodifiedbyname: string

    constructor(vehicle?)
    {
        vehicle = vehicle || {};
        this.id = vehicle.id || 0;
        this.name = vehicle.name || '';
        this.companyid = vehicle.companyid || 0;
        this.company = vehicle.company || '';
        this.groupid = vehicle.groupid || 0;
        this.group = vehicle.group || '';
        this.subgroup = vehicle.subgroup || 0;
        this.accountid = vehicle.accountid || 0;
        this.account = vehicle.account || '';
        this.operatorid = vehicle.operatorid || 0;
        this.operator = vehicle.operator || '';
        this.unittypeid = vehicle.unittypeid || 0;
        this.unittype = vehicle.unittype || '';
        this.serviceplanid = vehicle.serviceplanid || 0;
        this.serviceplan = vehicle.serviceplan || '';
        this.producttypeid = vehicle.producttypeid || 0;
        this.producttype = vehicle.producttype || '';
        this.makeid = vehicle.makeid || 0;
        this.make = vehicle.make || '';
        this.modelid = vehicle.modelid || 0;
        this.model = vehicle.model || '';
        this.isactive = vehicle.isactive || true;
        this.timezoneid = vehicle.timezoneid || 0;
        this.timezone = vehicle.timezone || '';
        this.created = vehicle.created || '';
        this.createdby = vehicle.createdby || 0;
        this.createdbyname = vehicle.createdbyname || '';
        this.deletedwhen = vehicle.deletedwhen || '';
        this.deletedby = vehicle.deletedby || 0;
        this.deletedbyname = vehicle.deletedbyname || '';
        this.lastmodifieddate = vehicle.lastmodifieddate || '';
        this.lastmodifiedby = vehicle.lastmodifiedby || 0;
        this.lastmodifiedbyname = vehicle.lastmodifiedbyname || '';
    }
}
