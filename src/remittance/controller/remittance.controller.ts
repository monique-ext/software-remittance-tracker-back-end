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

    @Get("/index")
  async index(@Query() query: any) {
    return await this.remittanceService.index(query.role);
  }
}