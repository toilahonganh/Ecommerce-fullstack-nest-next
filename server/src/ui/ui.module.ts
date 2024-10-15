import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UiService } from './ui.service';
import { UiController } from './ui.controller';
import { UISchema, UI } from './schemas/ui.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UI.name, schema: UISchema }]), // Register the model
  ],
  providers: [UiService],
  controllers: [UiController],
})
export class UiModule {}
