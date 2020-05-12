export class ServiceitemDetail
{
    id?: number;
    name?: string;
    isactive?: string;
    companyid?: string;
    company?: string;
    groupid?: string;
    group?: string;

    constructor(serviceDetail?) {
        serviceDetail = serviceDetail || {};
        this.id = serviceDetail.id || 0;
        this.name = serviceDetail.name || '';
        this.isactive = serviceDetail.isactive || 'false';
        this.companyid = serviceDetail.companyid || '';
        this.groupid = serviceDetail.groupid || '';
        this.companyid = serviceDetail.company || '';
        this.groupid = serviceDetail.group || '';
    }
}
