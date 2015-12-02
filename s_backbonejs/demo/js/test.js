$(function() {
//监听事件
    var M = Backbone.Model.extend({
        defaults: {
            name : 'hello'
        }
    });

    var V = Backbone.View.extend({
        initialize: function() {
            console.log(this);
            this.listenTo(this.model, 'change', this.show);
        },
        show: function(model) {
//            $('body').append('<div>'+ model.get('name') +'</div>')
            var tmlStr = this.template;
            $('body').html(tmlStr(model.toJSON()));
        },
        template: _.template($('#template').html())
    });

    var m = new M;
    var v = new V({
        model: m
    });
    m.set('name', 'hi');

    //保存
//    Backbone.sync = function(method, model) {
//        alert(method + ":" + JSON.stringify(model));
//        model.id = 1;
//    };
//
//    var M = Backbone.Model.extend({
//        defaults: {
//            name: 'hello'
//        },
//        url : 'date/user'
//    });
//
//    var m = new M;
//    m.save();
//    m.save({name: 'hi'});

    //数据请求
//    var C = Backbone.Collection.extend({
//        initialize: function() {
//            this.on.('reset', function() {
//                alert(123);
//            })
//        },
//        url: '/users'
//    });
//
//    var models = new C;
//    models.fetch();

    //路由
//    var Workspace = Backbone.Router.extend({
//        routes: {
//            'help':'help',
//            'search/:query':'search',
//            'search/:query/p:page': 'search'
//        } ,
//
//        help: function() {
//            alert(1);
//        },
//        search: function(query, page) {
//            alert(2);
//        }
//    });
//    var w = new Workspace;
//    Backbone.history.start();

    //事件委托
//    var V = Backbone.View.extend({
//        el : $('body'),
//        events: {
//            'click input'   :'aaa',
//            'mouseover li'   :'bbb'
//        },
//        aaa: function() {
//            alert(123);
//        },
//        bbb: function() {
//            alert(456);
//        }
//    });
//    var v = new V;
});