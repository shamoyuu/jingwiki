var express = require('express');
var router = express.Router();

var schedule = require('node-schedule');
var request = require('request');


router.get('/', function (req, res, next) {
    res.render('index', {
        title: '我的第一个express项目'
    });
});

module.exports = router;
