const express = require('express');
const router = express.Router();
const { generateSuggestions } = require('../controllers/aiController');

router.post('/suggestions', generateSuggestions);

module.exports = router;
