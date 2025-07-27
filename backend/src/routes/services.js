import express from 'express';
import { query } from 'express-validator';
import Service from '../models/Service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();


router.get('/', [
  query('category')
    .optional()
    .isIn(['exterior', 'interior', 'performance', 'audio', 'lighting', 'wheels', 'other'])
    .withMessage('Invalid category'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  query('available')
    .optional()
    .isBoolean()
    .withMessage('Available must be true or false'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    available,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  // Build filter object
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (available !== undefined) {
    filter.isAvailable = available === 'true';
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Build sort object
  const sort = {};
  const validSortFields = ['name', 'price', 'duration', 'category', 'createdAt'];
  const validSortOrders = ['asc', 'desc'];

  if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.name = 1; // Default sort
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const services = await Service.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Service.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    }
  });
}));


router.get('/:id', asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  res.json({
    success: true,
    data: {
      service
    }
  });
}));


router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const validCategories = ['exterior', 'interior', 'performance', 'audio', 'lighting', 'wheels', 'other'];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category'
    });
  }

  const services = await Service.find({ 
    category, 
    isAvailable: true 
  }).sort({ name: 1 });

  res.json({
    success: true,
    data: {
      services,
      category
    }
  });
}));

export default router; 