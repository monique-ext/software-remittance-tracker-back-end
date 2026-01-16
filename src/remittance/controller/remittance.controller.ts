import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RemittanceService } from "../service/remittance.service";

@Controller('/remittance')
export class RemittanceController {
  constructor(
    private readonly remittanceService: RemittanceService
  ) { }

  @Post("/store")
  async store(@Body() body) {
    return await this.remittanceService.store(body)
  }

  @Post('index')
  async index(@Body() filters: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.remittanceService.index({ ...filters, page: Number(page), limit: Number(limit) });
  }
}