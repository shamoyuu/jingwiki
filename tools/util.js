module.exports = {
    // 2018/1/28/
    getDatePath() {
        var result = "";
        var date = new Date();
        result += date.getFullYear() + "/";
        result += (date.getMonth() + 1) + "/";
        result += date.getDate() + "/";
        return result;
    },

    // 2018-01-28 23:59:59
    dateFormat(date) {
        var result = "";
        result += date.getFullYear() + "-";
        result += fill((date.getMonth() + 1), 2) + "-";
        result += fill(date.getDate(), 2) + " ";
        result += fill(date.getHours(), 2) + ":";
        result += fill(date.getMinutes(), 2) + ":";
        result += fill(date.getSeconds(), 2);
        return result;
    },

    // 补充数字位数 (0001)
    fill(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
};