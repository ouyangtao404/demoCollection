$(function(){

    Backbone.sync2 = function(method, model) {
        alert(method + ": " + model.url);
        method = 'GET';
        console.log(888);
        console.log(arguments);
    };

    //数据模型-单个
    var Item =  Backbone.Model.extend({
        url: 'data/d.json',
        defaults: {
            title   : 'i am default title',
            done    : false
        },
        toggle: function() {
            this.save({done:!this.get('done')}, {
                success: function(m, res, op) {
                    console.log('save success');
                    console.log(res);
                },
                error: function(m, res, op) {
                    console.log('save success');
                    console.log(res);
                }
            });
        }
    });

    //数据模型-集合
    var Items = Backbone.Collection.extend({
        model: Item,
          //返回还未完成的model（done为false）
//        localStorage: new Backbone.LocalStorage("todos-backbone"),
        remaining : function() {
            return this.where({done:false});
        },
        create: function(o) {
            //根据参数实例化一条
            var model = new this.model(o);
            //把数据模型实例加入到集合中
            this.add(model);
            //把集合保存;
            model.save();
            //console.log(this.toJSON());
            //this.sync();
        }
    });

    //整个list的数据模型集合，请求数据
    var items = new Items;
    items.url = 'data/d.json';
    items.fetch();

    //单条记录的视图
    var Vitem = Backbone.View.extend({
        tagName: 'li',//容器
        initialize: function() {
            this.checkbox = this.$('.toggle');
            this.input = this.$('.edit');
            //初始化（把内容渲染好）
            this.render();

            //若是model数据模型有变化，则重新渲染一遍
            this.listenTo(this.model, 'change', this.render);

            //监听关联的model的销毁事件
            this.listenTo(this.model, 'destroy', this.remove);

        },
        events: {
            'click .toggle'   : 'toggleDone',
            'click .destroy'  : 'clear',
            'dblclick .view'  : 'edit',
            'blur .edit'      : 'close',//保存
            'keypress .edit'  : 'updateOnEnter'//保存
        },
        //触发了checkbox的click事件
        toggleDone: function(e) {
            this.model.toggle();
        },
        //销毁
        clear: function() {
            this.model.destroy();
        },
        edit: function() {
            this.$el.addClass('editing');
            this.input.focus();
        },
        //保存操作
        close: function() {
            var val = this.input.val();
            if(!val) {
                this.model.destroy();
            } else {
                this.$el.removeClass('editing');
                var val = this.input.val();
                //this.model.set('title', val);
                this.model.save({
                    title: val
                });
                console.log(123);
            }
        },
        updateOnEnter: function(e) {
            if(e.keyCode == 13) {
                this.close();
            }
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));//2个参数，后者若为true,则前面的className只能由无到有，反之，则只能从有到无
            this.input = this.$('.edit');
            return this;
        },
        template: _.template($('#item-template').html())
    });

    //整个应用的视图
    var Vapp = Backbone.View.extend({
        el: $('#todoapp'),
        initialize: function() {
            this.input = this.$('#new-todo');
            this.listCon = this.$('#todo-list');
            this.main = this.$('#main');
            this.allCheckbox = this.$("#toggle-all")[0];

            //监听数据模型集合的变化
            this.listenTo(items, 'add', this.addOne);
            this.listenTo(items, 'all', this.render);
        },

        render: function() {
            if(items.length > 0) {
                this.main.show();
            } else {
                this.main.hide();
            }

            //获取Collection里，还未完成的数量
            var remaining = items.remaining();
            if(remaining.length > 0) {
                this.allCheckbox.checked = false;
            } else {
                this.allCheckbox.checked = true;
            }
        },
        addOne: function(todo) {//在触发Collection实例的add事件后，会给回调函数传入新增的model作为第一个参数
            //新建一个view
            var newView = new Vitem({model: todo});
            this.listCon.append(newView.$el);
        },
        events: {
            //输入框里有输入，且按了回车
            'keypress #new-todo': 'addOneEvent',
            //勾上全选
            'click #toggle-all': 'toggleAllComplete'
        },
        addOneEvent: function(e) {
            //判断是回车，才继续
            if(e.keyCode != 13) return;

            var tar = $(e.target);
            if(!this.input.val()) return;
            //创建model，属性是新增put里输入的值
            items.create({
                title: this.input.val()
            });
            this.input.val('');
        },
        toggleAllComplete: function() {
            var done = this.allCheckbox.checked;
            items.each(function(i) {
                i.set('done', done);
            });
        }
    });

    var app = new Vapp;

});