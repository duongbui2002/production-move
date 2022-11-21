import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus, BadRequestException
} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";
import {JsonWebTokenError} from "jsonwebtoken";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const {httpAdapter} = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number;
    let message: string | object;

    if (process.env.NODE_ENV === "development") console.log(exception);

    if (exception instanceof JsonWebTokenError) {
      httpStatus = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    } else if (exception instanceof BadRequestException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = "An error was occurred";
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      message: message,
      stack: httpAdapter.getRequestUrl(ctx.getRequest())
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
