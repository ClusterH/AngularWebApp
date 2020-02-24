import { FuseUtils } from '@fuse/utils';

export class Vehicle
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;

    /**
     * Constructor
     *
     * @param vehicle
     */
    constructor(vehicle)
    {
        {
            this.id = vehicle.id || FuseUtils.generateGUID();
            this.name = vehicle.name || '';
            this.lastName = vehicle.lastName || '';
            this.avatar = vehicle.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = vehicle.nickname || '';
            this.company = vehicle.company || '';
            this.jobTitle = vehicle.jobTitle || '';
            this.email = vehicle.email || '';
            this.phone = vehicle.phone || '';
            this.address = vehicle.address || '';
            this.birthday = vehicle.birthday || '';
            this.notes = vehicle.notes || '';
        }
    }
}
