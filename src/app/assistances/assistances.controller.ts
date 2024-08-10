import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AssistanceService } from './assistances.service';
import { IAssistance } from 'src/models/assistance.model';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('assistance')
export class assistanceController{
  constructor(private readonly assistanceService: AssistanceService) {}

  // @UseGuards(JwtGuard)
  @Get()
  async findAll() {
      return await this.assistanceService.findAll()
  }

  @UseGuards(JwtGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.assistanceService.findById(id);
  }

  // @UseGuards(JwtGuard)
  @Post("/add")
  async add(@Body()body: Omit<IAssistance, "id" | "createdAt" | "updatedAt">) {
    return await this.assistanceService.addAssistances(body);
  }

  @UseGuards(JwtGuard)
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: Partial<IAssistance>
  ) {
    return await this.assistanceService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.assistanceService.removeAssistance(id);
  }
}