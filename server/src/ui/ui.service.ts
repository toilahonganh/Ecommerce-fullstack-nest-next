import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { UI } from './schemas/ui.schema';
import { Model } from 'mongoose';

@Injectable()
export class UiService {
    constructor(
        @InjectModel(UI.name)
        private uiModel: Model<UI>, 
    ) {}

    /**
     * @param banners 
     * @returns 
     */
    async addingBanner(banners: string[]): Promise<UI[]> {
        const response = await this.uiModel.create(banners); 
        return response;
    }

    /**
     * 
     */
   async changeBanner(id: string, updateData: Partial<UI>): Promise<UI> {
        const response = await this.uiModel.findByIdAndUpdate(id, updateData, { new: true });
        return response;
   }
}
