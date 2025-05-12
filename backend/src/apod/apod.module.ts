import { Module } from "@nestjs/common";
import { ApodController } from "./apod.controller";
import { ApodService } from "./apod.service";
import { HttpModule } from "@nestjs/axios";
@Module({
  imports: [HttpModule],
  controllers: [ApodController],
  providers: [ApodService],
})
export class ApodModule {}
