import {Global, Module} from "@nestjs/common";
import {MailService} from "./mail.service";
import {ConfigModule} from "@nestjs/config";

@Global()
@Module({
  providers: [MailService],
  imports: [ConfigModule],
  exports: [MailService]
})
export class MailModule {
}
