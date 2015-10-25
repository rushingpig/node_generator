/**
 * @des    : 通过渲染模板生成相应模板的主文件
 * @author : pigo.can
 * @date   : 15/10/23 下午4:29
 * @email  : rushingpig@163.com
 * @version: v1.0
 */
"use strict";

var fs = require('fs'),
    BufferHelper = require('bufferhelper'),
    handlebars = require('handlebars'),
    path = require('path');

function Generate(hb) {
    this.hb = hb || handlebars;
    this.defaultTlFilePath = path.join('..', '..', 'tpl');
    this.defaultTarFilePath = path.join('..', '..', 'target');
}

function customerLog(msg) {
    console.dir(msg || '[Nothing to log]');
}
/**
 * 渲染模板,填充数据
 * @param tlFilePath
 * @param tarFilePath
 * @param dataObj
 */
Generate.prototype.render_tl = function (tlFilePath, tarFilePath, dataObj, cb) {
    this.render_ntl_helper(tlFilePath, tarFilePath, dataObj, cb);

};
/**
 * 利用handlebars进行模板渲染
 * @param tlFilePath
 * @param tarFilePath
 * @param dataObj
 * @param cb
 */
Generate.prototype.render_ntl_helper = function (tlFilePath, tarFilePath, dataObj, cb) {
    tlFilePath = tlFilePath || this.defaultTlFilePath;
    tarFilePath = tarFilePath || this.defaultTarFilePath;
    dataObj = dataObj;
    let hb = this.hb;
    var bufferHelper = new BufferHelper();
    if (typeof dataObj !== 'object' || dataObj == null || dataObj == undefined) {
        dataObj = {};
        console.error('the data to render the template must be an object ,but has been set to default object {}...');
    }
    let rs = fs.createReadStream(tlFilePath, {
        encoding: 'utf-8',
        autoClose: true,
        flags: 'r',
        mode: '0o666',
        fd: null
    });
    rs.on('data', function (chunk) {
        bufferHelper.concat(chunk);
    });
    rs.on('end', function () {
        let source = bufferHelper.buffers.toString();
        let template = hb.compile(source);
        //  将生成的模板内容日志输出
        customerLog(template);
        let content = template(dataObj);
        fs.writeFile(tarFilePath, content, function (err) {
            if (err) {
                throw err;
            }
            customerLog('The tempalte files has been saved...');
        });
    });

};
module.exports = new Generate();
module.exports.Generate = Generate;