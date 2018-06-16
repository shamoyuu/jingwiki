var BosClient = require("bce-sdk-js").BosClient;

const config = {
    endpoint: "https://bj.bcebos.com",          //传入Bucket所在区域域名
    credentials: {
        ak: "",         //您的AccessKey
        sk: ""  //您的SecretAccessKey
    }
};


module.exports = new BosClient(config);