import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UiService } from './ui.service';
import { CreateUIDto } from './dto/ui.dto';
import { UI } from './schemas/ui.schema';

@Controller('ui')
export class UiController {
    constructor(private uiService: UiService) {}

    @Post()
    async addingBanners(
        @Body() createBannerDto: CreateUIDto
    ): Promise<UI[]> {
        return this.uiService.addingBanner(createBannerDto.banners); 
    }
    
    @Put(':id')  // Add the 'id' parameter to the route
    async updateBanner(
        @Param('id') id: string,  // Specify that 'id' comes from the URL
        @Body() updateData: Partial<UI>
    ): Promise<UI> {
        return await this.uiService.changeBanner(id, updateData);
    }
}
