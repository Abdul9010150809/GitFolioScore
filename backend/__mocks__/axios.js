// __mocks__/axios.js
const mockAxios = jest.createMockFromModule('axios');
mockAxios.create = () => mockAxios;
mockAxios.get = jest.fn(() => Promise.resolve({ data: {} }));
mockAxios.post = jest.fn(() => Promise.resolve({ data: {} }));
module.exports = mockAxios;
