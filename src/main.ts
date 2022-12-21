import {NestFactory} from '@nestjs/core';

import {ValidationPipe} from "@nestjs/common";
import {AppModule} from "@src/app.module";
import * as process from "process";

require("module-alias/register");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    disableErrorMessages: false
  }));

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  })

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
