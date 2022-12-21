import {Global, Module} from '@nestjs/common';
import {CustomerController} from './customer.controller';
import {CustomerService} from "@modules/customer/customer.service";


@Global()
@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {
}
