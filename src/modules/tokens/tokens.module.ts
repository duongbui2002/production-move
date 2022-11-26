import { Global, Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { DatabaseModule } from "@common/database/database.module";

@Global()
@Module({
  providers: [TokensService],
  exports: [TokensService],
  imports: [DatabaseModule]
})
export class TokensModule {
}
