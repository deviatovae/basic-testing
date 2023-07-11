export const mockResponse = 'mocked data' ;

export default {
  get: jest.fn(),
  create() {
    return {
      get: this.get.mockResolvedValue({ data: mockResponse }),
    };
  },
};
