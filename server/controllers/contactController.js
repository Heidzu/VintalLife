const ContactRequest = require('../models/ContactRequest');
const asyncHandler = require('../utils/asyncHandler');

const createContactRequest = asyncHandler(async (req, res) => {
    const contactRequest = await ContactRequest.create({
        name: req.body.name,
        phone: req.body.phone,
        source: req.body.source || 'other',
        message: req.body.message || '',
        ipAddress: req.ip,
        userAgent: req.get('user-agent') || ''
    });

    res.status(201).json({
        success: true,
        message: 'Contact request created successfully.',
        data: contactRequest
    });
});

const getContactRequests = asyncHandler(async (_req, res) => {
    const contactRequests = await ContactRequest.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
        success: true,
        count: contactRequests.length,
        data: contactRequests
    });
});

module.exports = {
    createContactRequest,
    getContactRequests
};