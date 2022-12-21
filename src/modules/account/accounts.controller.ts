import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {AccountsService} from "@modules/account/accounts.service";
import {SetRolesDto} from "@modules/account/dto/set-role.dto";
import {AuthGuard} from "@common/guards/auth.guard";
import RoleGuard from "@common/guards/roles.guard";
import Role from "@common/enums/role.enum";
import {AccountDecorator} from "@common/decorators/account.decorator";
import {AccountDocument} from "@modules/account/schemas/account.schema";

@Controller('account')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {
  }

  @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.ExecutiveBoard))
  @Post('set-roles/:id')
  async setRoles(@Param('id') id: string, @Body() setRolesDto: SetRolesDto) {
    const account = await this.accountService.findOne({_id: id})

    const accountWithNewRoles = await this.accountService.update({_id: id}, setRolesDto, {new: true})

    return {
      data: accountWithNewRoles,
      success: true
    }
  }

  @UseGuards(AuthGuard)
  @Get('info')
  async getInfo(@AccountDecorator() account: AccountDocument) {
    return {
      success: true,
      data: account
    }

  }
}
