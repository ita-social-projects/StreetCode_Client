import {
  Injectable,
  HttpException,
  HttpStatus,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (error instanceof HttpException) {
      throw error;
    } else if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const axiosResponse = axiosError.response as AxiosResponse;
      console.log('ERROR FROM API', axiosError);
      response
        .status(axiosResponse.status)
        .json({ ...axiosResponse.data, isFromFilter: true });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Internal Server Error: ${error.message}`,
      });
    }
  }

  private isAxiosError(error: Error): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }
}
