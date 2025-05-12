import { Controller, Get, Query, Param } from "@nestjs/common";
import { ApodService } from "./apod.service";

@Controller("apod")
export class ApodController {
  constructor(private readonly apodService: ApodService) {}

  @Get("sync")
  async fetchAndStore() {
    return this.apodService.fetchAndSaveApod();
  }

  @Get()
  getAll(
    @Query('date') date?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.apodService.findAll(
      date,
      search,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 30
    );
  }

  @Get(":date")
  getByDate(@Param("date") date: string) {
    return this.apodService.findByDate(date);
  }

  @Get('sync-range')
  syncRange(
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.apodService.syncRange(start, end);
  }

  @Get('sync-all')
  async syncAll() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 90); // Sincroniza últimos 90 dias
    
    return this.apodService.syncRange(
      startDate.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }
}