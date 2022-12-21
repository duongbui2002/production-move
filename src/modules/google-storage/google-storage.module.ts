import { Global, Module } from "@nestjs/common";
import { GoogleStorageService } from "./google-storage.service";

@Global()
@Module({
  imports: [
  ],
  exports: [GoogleStorageService],
  providers: [GoogleStorageService]
})
export class GoogleStorageModule {
}
