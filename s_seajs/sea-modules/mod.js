// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    var mod2 = require('mod2');

    // 通过 exports 对外提供接口
    exports.doSomething = function() {
        var number = 1;
        console.log(number + mod2.doSomething());
    };
});