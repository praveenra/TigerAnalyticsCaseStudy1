import { addOrUpdatePricing, listPricing, editPricing } from '../services/pricing.service.js';
import { Parser } from 'json2csv';
import fs from 'fs';
import { parse } from 'csv-parse';
import Pricing from '../models/pricing.model.js';

export const health = async (req, res) => {
    res.status(200).json({
    status: "UP",
    message: "Pricing Server is healthy",
    timestamp: new Date()
  });
};

export const addPricing = async (req, res) => {
  try {
    const pricings = await addOrUpdatePricing(req.body);
    res.status(201).json({ success: true, data: pricings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPricing = async (req, res) => {
  try {
    const result = await listPricing(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePricing = async (req, res) => {
  try {
    const updated = await editPricing(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const exportPricing = async (req, res) => {
  try {
    const result = await listPricing(req.query); // Your DB query

    // Convert Mongoose docs to plain objects and pick fields you need
    const data = result.data.map(item => ({
      storeId: item.storeId,
      sku: item.sku,
      productName: item.productName,
      price: item.price,
      effectiveDate: formatDate(item.effectiveDate),
      isActive: item.isActive,
    //   version: item.version,
    //   createdAt: item.createdAt,
    //   updatedAt: item.updatedAt,
    }));

    // Define fields for CSV
    const fields = ['storeId', 'sku', 'productName', 'price', 'effectiveDate', 'isActive']; //, 'version', 'createdAt', 'updatedAt'
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Send CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pricing.csv"');
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');       // DD
  const month = String(d.getMonth() + 1).padStart(2, '0'); // MM (months are 0-indexed)
  const year = d.getFullYear();                           // YYYY
//   return `${day}-${month}-${year}`;
  return `${year}-${month}-${day}`;
};

export const uploadPricingCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const filePath = req.file.path;
  const results = [];
  const errorsRows = [];
  let rowNumber = 1;

  fs.createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true }))
    .on('data', async (row) => {
      const currentRow = ++rowNumber;
      const item = {
        storeId: (row['Store ID'] || row['storeId'] || '').trim(),
        sku: (row['SKU'] || row['sku'] || '').trim(),
        productName: (row['Product Name'] || row['productName'] || '').trim(),
        price: parseFloat((row['Price'] || row['price'] || '').trim()),
        effectiveDate: parseDate(row['effectiveDate'] || row['effectiveDate']), // ✅ now valid
        isActive: true,
    };
      if (item.storeId && item.sku && !isNaN(item.price) && item.effectiveDate) {
        results.push(item);
      }else{
        errorsRows.push(currentRow);
      }
    })
    .on('end', async () => {
      if (results.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ success: false, message: 'No valid data found in CSV' });
      }
    //   await Pricing.insertMany(results);

        const bulkOps = results
        .filter(item => item.storeId && item.sku) // only valid items
        .map(item => ({
            updateOne: {
            filter: { storeId: item.storeId, sku: item.sku },
            update: { $set: item },
            upsert: true,
            }
        }));

        await Pricing.bulkWrite(bulkOps);
      fs.unlinkSync(filePath);
      res.json({ success: true, message: `${results.length} pricing records uploaded successfully, Error Row No: ${errorsRows.join(', ')}` });
    })
    .on('error', (err) => {
      fs.unlinkSync(filePath);
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to parse CSV' });
    });
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;

  dateStr = dateStr.trim().replace(/\r/g, '');
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return null;

  return date;
};
