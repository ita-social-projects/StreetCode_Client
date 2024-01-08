import { ApiExceptionFilter } from './api-exeption.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError, AxiosResponse } from 'axios';

describe('ApiExceptionFilter', () => {
  let apiExceptionFilter: ApiExceptionFilter;
  let mockResponse: Response;

  beforeEach(() => {
    apiExceptionFilter = new ApiExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should handle HttpException and rethrow', () => {
    const httpException = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    expect(() => apiExceptionFilter.catch(httpException, mockHost)).toThrow(
      httpException,
    );
  });

  it('should handle AxiosError and respond with transformed data', () => {
    const axiosError: AxiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: { message: 'Internal Server Error' },
      } as AxiosResponse,
    } as AxiosError;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    apiExceptionFilter.catch(axiosError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      axiosError.response.status,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      Object.assign({}, axiosError.response.data, { isFromFilter: true }),
    );
  });

  it('should handle other errors and respond with generic 500 Internal Server Error', () => {
    const genericError = new Error('Some generic error');
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    apiExceptionFilter.catch(genericError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Internal Server Error: ${genericError.message}`,
    });
  });
});
