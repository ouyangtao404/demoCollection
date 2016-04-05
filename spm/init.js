define(function(require, exports, module) {
    alert('init');

    var $ = require('./jquery');

    var data = require('./data');

    var css = require('./style.css');



    $('.author').html(data.author);

    $('.blog').attr('href', data.blog);

});
