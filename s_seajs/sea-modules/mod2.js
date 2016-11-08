// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');

    // 通过 exports 对外提供接口
    exports.doSomething = function() {
        console.log($);
        return 2;
    };



});