const fs = require('fs');
const mockFs = require('mock-fs');
const { uploadPricingCSV } = require('../src/controllers/pricing.controller');
const Pricing = require('../src/models/pricing.model');

// Mock Pricing.bulkWrite
jest.mock('../src/models/pricing.model', () => ({
  bulkWrite: jest.fn(),
}));

describe('uploadPricingCSV', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should insert new pricing records successfully', async () => {
  const csvContent = `Store ID,SKU,Product Name,Price,effectiveDate
S001,SKU001,Shirt,199.99,2026-02-11
S002,SKU002,Trousers,299.99,2026-02-12
S003,SKU003,Trousers,299.99,2026-02-12`;

  mockFs({
    'uploads/pricing.csv': csvContent
  });

  const req = { file: { path: 'uploads/pricing.csv' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  Pricing.bulkWrite.mockResolvedValue({ insertedCount: 3 });

  await new Promise((resolve) => {
    uploadPricingCSV(req, {
      status: res.status,
      json: (data) => {
        res.json(data);
        resolve();
      },
    });
  });

  expect(Pricing.bulkWrite).toHaveBeenCalledTimes(1);
  const bulkOps = Pricing.bulkWrite.mock.calls[0][0];
  expect(bulkOps.length).toBe(3);
  expect(bulkOps[0].updateOne.filter).toEqual({ storeId: 'S001', sku: 'SKU001' });
  expect(bulkOps[1].updateOne.filter).toEqual({ storeId: 'S002', sku: 'SKU002' });
  expect(bulkOps[2].updateOne.filter).toEqual({ storeId: 'S003', sku: 'SKU003' });

  expect(res.json).toHaveBeenCalledWith({
    success: true,
    message: '3 pricing records uploaded successfully',
  });

  expect(fs.existsSync('uploads/pricing.csv')).toBe(false);
});


  it('should return 400 if no file uploaded', async () => {
    const req = { file: null };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await uploadPricingCSV(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No file uploaded' });
  });

  it('should return 400 if no valid data in CSV', async () => {
    mockFs({
  'uploads/pricing.csv': `Store ID,SKU,Product Name,Price,effectiveDate
,, , , `
});

    const req = { file: { path: 'uploads/pricing.csv' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await new Promise((resolve) => {
      uploadPricingCSV(req, {
        status: res.status,
        json: (data) => {
          res.json(data);
          resolve();
        },
      });
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No valid data found in CSV' });
    expect(fs.existsSync('uploads/pricing.csv')).toBe(false);
  });
});
