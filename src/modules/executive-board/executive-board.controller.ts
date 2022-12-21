import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ExecutiveBoardService} from "@modules/executive-board/executive-board.service";
import {CreateExecutiveBoardDto} from "@modules/executive-board/dto/create-executive-board.dto";
import {AccountsService} from "@modules/account/accounts.service";

@Controller('executive-board')
export class ExecutiveBoardController {
  constructor(private readonly executiveBoardService: ExecutiveBoardService, private readonly accountService: AccountsService) {
  }

  @Post()
  async create(@Body() createExecutiveBoardDto: CreateExecutiveBoardDto) {
    const newExecutive = await this.executiveBoardService.create(createExecutiveBoardDto);

    return {
      data: newExecutive,
      success: true
    }
  }

}
