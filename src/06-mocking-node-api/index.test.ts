import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';
import path from 'path';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.runAllTimers();
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setInterval');
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');
    await readFileAsynchronously('myFile.txt');

    expect(joinSpy).toHaveBeenCalledWith(__dirname, 'myFile.txt');
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'non-existent-path-to-file';
    jest.spyOn(path, 'join').mockReturnValue(pathToFile);
    const existsSyncMock = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously('myFile.txt');

    expect(result).toBe(null);
    expect(existsSyncMock).toHaveBeenCalledWith(pathToFile);
  });

  test('should return file content if file exists', async () => {
    const content = 'file-content';
    const pathToFile = 'existing-path-to-file';
    jest.spyOn(path, 'join').mockReturnValue(pathToFile);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const readFileMock = jest.spyOn(fs.promises, 'readFile');
    readFileMock.mockReturnValue(Promise.resolve(Buffer.from(content)));

    const result = await readFileAsynchronously('myFile.txt');

    expect(readFileMock).toHaveBeenCalledWith(pathToFile);
    expect(result).toBe(content);
  });
});
