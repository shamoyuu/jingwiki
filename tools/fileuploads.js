var multer = require("multer");

var storage = multer.diskStorage({
    destination: process.cwd() + "/temp",
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + "." + fileFormat[fileFormat.length - 1]);
    }
});

var upload = multer({
    storage: storage
});


module.exports = upload;