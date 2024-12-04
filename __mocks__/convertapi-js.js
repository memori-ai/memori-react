const ConvertApi = {
    auth: jest.fn(() => ({
      createParams: jest.fn(() => ({
        add: jest.fn()
      })),
      convert: jest.fn(() => Promise.resolve({
        files: [{ Url: 'mock-url' }]
      }))
    }))
  };
  
  export default ConvertApi;