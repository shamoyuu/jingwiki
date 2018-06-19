let router = require('express').Router();
let fs = require('fs');
let path = require('path');
let request = require('request');

let client = require("../tools/bos-client");
let upload = require("../tools/fileuploads");
let textList = require("../tools/text-list");
let util = require("../tools/util");


/**
 * 新增文件
 */
router.post('/add-file', function (req, res, next) {
    let param = req.body;
    textList.getTextList();
    let maxid = 0;
    textList.list.forEach(function (element) {
        if (element.id > maxid) maxid = element.id;
    })
    textList.list.push({
        id: maxid + 1,
        pId: +param.parentid,
        name: param.name,
        isParent: false
    });
    textList.save();
    res.send({
        code: 101,
        data: maxid + 1
    });
});

/**
 * 新增文件夹
 */
router.post('/add-floder', function (req, res, next) {
    let param = req.body;
    textList.getTextList();
    let maxid = 0;
    textList.list.forEach(function (element) {
        if (element.id > maxid) maxid = element.id;
    })
    textList.list.push({
        id: maxid + 1,
        pId: +param.parentid,
        name: param.name,
        isParent: true
    });
    textList.save();
    res.send({
        code: 101,
        data: maxid + 1
    });
});

/**
 * 文件列表
 */
router.get('/list', function (req, res, next) {
    if (textList.list.length == 0) textList.getTextList();
    res.send(textList.list);
});

/**
 * 保存
 */
router.post('/save', function (req, res, next) {
    let text = req.body;
    let textInfo = JSON.parse(req.body.text.split("\n")[0]);
    let arr = textInfo.path.split("/");
    let path = "data/";
    for (let i = 0; i < arr.length; i++) {
        if (i < arr.length - 1) {
            path += arr[i] + "/";
            if (fs.existsSync(path) == false) {
                fs.mkdirSync(path);
            }
        }
    }
    fs.writeFile('data/' + textInfo.path, req.body.text, function (err) {
        if (err) {
            res.send({
                code: 102,
                message: "文件写入失败"
            });
        } else {
            client.putObjectFromString("jingwiki", 'data/' + textInfo.path, req.body.text)
                .then(function () {
                    res.send({
                        code: 101,
                        message: "上传成功"
                    });
                })
                .catch(function () {
                    res.send({
                        code: 102,
                        message: "上传失败"
                    });
                });
        }
    });
});

router.get('/--list', function (req, res, next) {
    client.listObjects("jingwiki")
        .then(function (response) {
            let contents = response.body.contents;
            for (let i = 0, l = contents.length; i < l; i++) {
                console.log(contents[i].key);
            }
            console.info(contents.length);
        })
        .catch(function (error) {
            // 查询失败
        });

    res.render('index');
});

/**
 * 文件上传
 */
router.post('/upload', upload.single('editormd-image-file'), function (req, res, next) {
    if (req.file) {
        let upFileName = "resource/" + util.getDatePath() + Date.now() + path.extname(req.file.path);
        //以文件形式上传
        client.putObjectFromFile("jingwiki", upFileName, req.file.path)
            .then(function () {
                fs.unlink(req.file.path, function () { });
                request("http://api.t.sina.com.cn/short_url/shorten.json?source=2815391962&url_long=" + encodeURIComponent("http://jingwiki.bj.bcebos.com/" + upFileName), function (error, response, data) {
                    if (!error && response.statusCode == 200) {
                        data = JSON.parse(data);
                        res.send({
                            success: 1,
                            url: data[0]["url_short"]
                        });
                    } else {
                        res.send({
                            success: 0,
                            message: "上传失败"
                        });
                    }
                });
            })
            .catch(function () {
                fs.unlink(req.file.path, function () { });
                res.send({
                    success: 0,
                    message: "上传失败"
                });
            })
    }
    else {
        res.send({
            code: 3,
            message: "上传失败"
        });
    }
});
/**
 * base64文件上传
 */
router.post('/upload-base64', function (req, res, next) {
    if (req.body.img) {
        let path = 'temp/' + Date.now() + '.png';
        let base64 = req.body.img.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64, 'base64');
        fs.writeFile(path, dataBuffer, function (err) {
            if (err) {
                res.send({
                    success: 0,
                    message: "上传失败"
                });
            } else {
                //以文件形式上传
                let upFileName = "resource/" + util.getDatePath() + Date.now() + ".jpg";
                client.putObjectFromFile("jingwiki", upFileName, path)
                    .then(function () {
                        fs.unlink(path, function () { });
                        request("http://api.t.sina.com.cn/short_url/shorten.json?source=2815391962&url_long=" + encodeURIComponent("http://jingwiki.bj.bcebos.com/" + upFileName), function (error, response, data) {
                            if (!error && response.statusCode == 200) {
                                data = JSON.parse(data);
                                res.send({
                                    success: 1,
                                    url: data[0]["url_short"]
                                });
                            } else {
                                res.send({
                                    success: 0,
                                    message: "上传失败"
                                });
                            }
                        })
                    })
                    .catch(function () {
                        fs.unlink(path, function () { });
                        res.send({
                            success: 0,
                            message: "上传失败"
                        });
                    });
            }
        })
    }
    else {
        res.send({
            code: 3,
            message: "上传失败"
        });
    }
});

module.exports = router;
