const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|index(.html)?', (req, res) => {
    res.render('index', { title: 'SubDir Index', message: 'Welcome to SubDirectory Index' });

})
router.get('/test(.html)?', (req, res) => {
    res.render('test', { title: 'SubDir Test', message: 'Welcome to SubDirectory Test...' });
})


module.exports = router