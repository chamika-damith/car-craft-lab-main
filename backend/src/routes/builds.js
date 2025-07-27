import express from 'express';
import { body, param, validationResult } from 'express-validator';
import Build from '../models/Build.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/', protect, [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Build name must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('carModel')
    .isLength({ min: 1, max: 100 })
    .withMessage('Car model must be between 1 and 100 characters')
    .trim(),
  body('carYear')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Car year must be between 1900 and next year'),
  body('carMake')
    .isLength({ min: 1, max: 50 })
    .withMessage('Car make must be between 1 and 50 characters')
    .trim(),
  body('selectedServices')
    .isArray({ min: 1 })
    .withMessage('At least one service must be selected'),
  body('selectedServices.*.service')
    .isMongoId()
    .withMessage('Invalid service ID'),
  body('selectedServices.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('selectedServices.*.customNotes')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Custom notes cannot exceed 200 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Tag cannot exceed 30 characters')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    name,
    description,
    carModel,
    carYear,
    carMake,
    selectedServices,
    isPublic = false,
    tags = [],
    images = []
  } = req.body;

  // Verify all services exist and are available
  const serviceIds = selectedServices.map(item => item.service);
  const services = await Service.find({
    _id: { $in: serviceIds },
    isAvailable: true
  });

  if (services.length !== serviceIds.length) {
    return res.status(400).json({
      success: false,
      message: 'One or more selected services are not available'
    });
  }

  // Calculate totals manually to ensure they're set
  let totalPrice = 0;
  let estimatedDuration = 0;
  
  for (const selectedService of selectedServices) {
    const service = services.find(s => s._id.toString() === selectedService.service);
    if (service) {
      totalPrice += service.price * (selectedService.quantity || 1);
      estimatedDuration += service.duration * (selectedService.quantity || 1);
    }
  }

  console.log('Creating build with calculated totals - totalPrice:', totalPrice, 'estimatedDuration:', estimatedDuration);

  // Create build data with calculated totals
  const buildData = {
    user: req.user._id,
    name,
    description,
    carModel,
    carYear,
    carMake,
    selectedServices,
    totalPrice, // Explicitly set calculated value
    estimatedDuration, // Explicitly set calculated value
    isPublic,
    tags,
    images
  };

  console.log('Creating build with data:', buildData);

  const build = await Build.create(buildData);

  console.log('Build created successfully:', build._id);

  // Populate service details
  await build.populate({
    path: 'selectedServices.service',
    select: 'name description price duration category'
  });

  res.status(201).json({
    success: true,
    message: 'Build created successfully',
    data: {
      build
    }
  });
}));

// Get builds by user ID
router.get('/:userId', [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
], asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status, public: publicOnly } = req.query;

  // Build filter
  const filter = { user: userId };

  if (status) {
    filter.status = status;
  }

  // If requesting user's own builds, show all
  // If requesting other user's builds, only show public ones
  if (req.user && req.user._id.toString() === userId) {
    // User requesting their own builds
  } else {
    // User requesting someone else's builds - only show public ones
    filter.isPublic = true;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const builds = await Build.find(filter)
    .populate({
      path: 'selectedServices.service',
      select: 'name description price duration category'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Build.countDocuments(filter);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;
  const hasPrevPage = parseInt(page) > 1;

  res.json({
    success: true,
    data: {
      builds,
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

router.get('/build/:id', [
  param('id')
    .isMongoId()
    .withMessage('Invalid build ID')
], asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id)
    .populate({
      path: 'selectedServices.service',
      select: 'name description price duration category features requirements'
    })
    .populate('user', 'username firstName lastName avatar');

  if (!build) {
    return res.status(404).json({
      success: false,
      message: 'Build not found'
    });
  }

  // Check if user can access this build
  if (!build.isPublic && (!req.user || req.user._id.toString() !== build.user._id.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: {
      build
    }
  });
}));

router.put('/:id', protect, [
  param('id')
    .isMongoId()
    .withMessage('Invalid build ID'),
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Build name must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'saved', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const build = await Build.findById(req.params.id);

  if (!build) {
    return res.status(404).json({
      success: false,
      message: 'Build not found'
    });
  }

  // Check ownership
  if (build.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this build'
    });
  }

  // Update build
  const updatedBuild = await Build.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate({
    path: 'selectedServices.service',
    select: 'name description price duration category'
  });

  res.json({
    success: true,
    message: 'Build updated successfully',
    data: {
      build: updatedBuild
    }
  });
}));

router.delete('/:id', protect, [
  param('id')
    .isMongoId()
    .withMessage('Invalid build ID')
], asyncHandler(async (req, res) => {
  const build = await Build.findById(req.params.id);

  if (!build) {
    return res.status(404).json({
      success: false,
      message: 'Build not found'
    });
  }

  // Check ownership
  if (build.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this build'
    });
  }

  await Build.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Build deleted successfully'
  });
}));

export default router;