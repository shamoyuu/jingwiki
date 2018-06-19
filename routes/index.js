let router = require('express').Router();


/**
 * 首页
 */
router.get('/', function (req, res, next) {
    res.redirect('/view/0');
});

/**
 * 阅读页
 */
router.get('/view/:id', function (req, res, next) {
    console.info(req.params.id);
    res.render('index');
});

/**
 * 文章页
 */
router.get('/text', function (req, res, next) {
    res.render('view');
});

/**
 * 编辑页
 */
router.get('/edit', function (req, res, next) {
    console.info(req.params.id);
    res.render('edit');
});

/**
 * 新增页
 */
router.get('/new', function (req, res, next) {
    console.info(req.params.id);
    res.render('new');
});


module.exports = router;
