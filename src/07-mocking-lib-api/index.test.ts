import axios from 'axios';
import { throttledGetDataFromApi } from './index';
import { mockResponse } from '../../__mocks__/axios';

jest.mock('lodash', () => ({
  __esModule: true,
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const axiosSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('');
    expect(axiosSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/users';
    const axiosSpy = jest.spyOn(axios, 'get');
    await throttledGetDataFromApi(relativePath);
    expect(axiosSpy).toBeCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('');
    expect(result).toBe(mockResponse);
  });
});
