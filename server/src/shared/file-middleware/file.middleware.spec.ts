import { Test, TestingModule } from '@nestjs/testing';
import { FileMiddleware } from './file.middleware';
import { Request, Response } from 'express';
import * as fs from 'fs';

jest.mock('fs');

describe('FileMiddleware', () => {
  let fileMiddleware: FileMiddleware;
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileMiddleware],
    }).compile();

    fileMiddleware = module.get<FileMiddleware>(FileMiddleware);

    req = {
      path: '/path/to/file.jpg',
    } as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
      sendFile: jest.fn(),
    } as unknown as Response;

    next = jest.fn();
  });

  it('should serve the file if it exists', async () => {
    const mockFilePath = '/mock/file/path.jpg';

    jest.spyOn(fileMiddleware, 'getAssetPath').mockReturnValue(mockFilePath);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    await fileMiddleware.use(req, res, next);

    expect(fileMiddleware.getAssetPath).toHaveBeenCalledWith(
      '/path/to/file.jpg',
    );
    expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
    expect(res.sendFile).toHaveBeenCalledWith(
      mockFilePath,
      expect.any(Function),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle file not found', async () => {
    jest
      .spyOn(fileMiddleware, 'getAssetPath')
      .mockReturnValue('/nonexistent/file/path.jpg');
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await fileMiddleware.use(req, res, next);

    expect((fileMiddleware as any).getAssetPath).toHaveBeenCalledWith(
      '/path/to/file.jpg',
    );
    expect(fs.existsSync).toHaveBeenCalledWith('/nonexistent/file/path.jpg');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass to the next middleware if the path does not represent a file', async () => {
    req.path = '/api/some-endpoint';

    await fileMiddleware.use(req, res, next);

    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
