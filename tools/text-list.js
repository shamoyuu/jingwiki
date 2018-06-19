let fs = require('fs');
let client = require("../tools/bos-client");
let util = require("../tools/util");

module.exports = {
    list: [],

    getTextList() {
        let data = fs.readFileSync('data/text-list.json', 'utf-8');
        this.list = eval("(" + data + ")");
        return this.list;
    },

    save() {
        let that = this;
        fs.writeFile('data/text-list.json', JSON.stringify(that.list), function (err) {
            if (err) {
                console.log('文件写入失败');
            } else {
                console.log('文件写入成功');
                let upFileName = "data/text-list/" + util.getDatePath() + "text-list.json";
                client.putObjectFromString("jingwiki", upFileName, JSON.stringify(that.list));
            }
        });
    }
};