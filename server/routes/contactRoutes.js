const express = require('express');

const { createContactRequest, getContactRequests } = require('../controllers/contactController');
const allowFields = require('../middlewares/allowFields');
const validateRequest = require('../middlewares/validateRequest');
const { createContactRequestRules } = require('../middlewares/validators/contactValidators');

const router = express.Router();

router
    .route('/')
    .post(
        allowFields(['name', 'phone', 'source', 'message']),
        createContactRequestRules,
        validateRequest,
        createContactRequest
    )
    .get(getContactRequests);

module.exports = router;