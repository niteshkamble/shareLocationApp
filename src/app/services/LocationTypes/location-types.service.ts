import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

interface LocationTypes {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationTypesService {
  constructor() {}

  async generateUniqueCode(): Promise<string> {
    return uuidv4().split('-')[0].toUpperCase();
  }

  async getLocationTypes(): Promise<LocationTypes[]> {
    return [
      {
        id: await this.generateUniqueCode(),
        name: 'Personal Location',
        description:
          'People with above code or with the link can see your location.',
      },
    ];
  }
}
