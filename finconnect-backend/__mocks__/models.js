// Generic mock factory for Sequelize models
function createMockModel(customMethods = {}) {
  const baseMock = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    ...customMethods,
  };
  return baseMock;
}

// Export all model mocks here
module.exports = {
  User: createMockModel(),
  Subscription: createMockModel(),
  Transaction: createMockModel(),
  Payment: createMockModel(),
  Limit: createMockModel(),
};