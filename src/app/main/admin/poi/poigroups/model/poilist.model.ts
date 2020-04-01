export class POIList
{
    id: string;
    name: string;
   
    constructor(contact)
    {
        {
            this.id = contact.id || 0;
            this.name = contact.name || '';
            
        }
    }
}
