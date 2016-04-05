var _Alert;
(function() {
    _Alert = Alert;
    var isSupportTouch = ('ontouchstart' in document.documentElement);
    var TAP = isSupportTouch? 'tap' : 'click';
    var TAP = 'click';

    $.extend($, {
        sc_inherit: function(Sub, Sup) {
            function Foo() {}
            Foo.prototype = Sup.prototype;
            Sub.prototype = new Foo();
            Sub.prototype.constructor = Sub;
            Sub.prototype._super = Sup;
        }
    });

    //Popwin
    function Popwin(o) {
        this.param = o;
        this.init();
    }
    $.extend(Popwin.prototype, {
        init: function() {
            this._setParam();
            this._structureInit();
            this._bindEvent();
            return this;
        },
        _setParam: function() {
            this.param = $.extend({
                content: ''
            }, this.param);
        },
        _structureInit: function() {

            var self = this;
            var maskStr = '<div class="pw_mask"></div>';
            var popWinStr = '<div class="pw">'+
                    //'<span class="pw_close">×</span>'+
                '<div class="pw_con">'+
                '<div class="pw_content">'+
                self.param.content +
                '</div>'+
                '</div>'+
                '</div>';

            var newHtml = '<div class="J_popWin">'+ maskStr + popWinStr  +'</div>';
            var newNode = $(newHtml);
            self.node = newNode;
        },
        _bindEvent: function() {
            //todo
            console.log('Popwin _bindEvent');
        },
        close: function() {
            this.node.remove();
            this.screenUnlock();
            this.param.onClose && this.param.onClose();
            return this;
        },
        show: function() {
            var self = this;
            $('body').append(self.node);

            var popwin = self.node.find('.pw');
            var windowHeight = $(window).height();
            var popwinHeight = popwin.height();
            var maxHeight = Math.floor(windowHeight * 0.8);
            popwinHeight = (popwinHeight < maxHeight)? popwinHeight : maxHeight;

            var top = Math.floor((windowHeight - popwinHeight)/2);
            popwin.css({
                height: popwinHeight,
                top: top
            });
            self.screenLock();
            return this;
        },
        screenLock: function() {
            $('html,body').css({
                overflowY:'hidden'
            });

            if($('html')[0].clientHeight === 0) {//webview的layout_height = wrap_content修正方案
                $('body').css({
                    height: (window.innerHeight + 1) + 'px'
                });
            }
        },
        screenUnlock: function() {
            $('html,body').css({
                overflowY:'visible'
            });
        }
    });

    //SimplePopwin
    function SimplePopwin(o) {
        Popwin.call(this, o);
    }
    $.sc_inherit(SimplePopwin, Popwin);
    $.extend(SimplePopwin.prototype, {
        init: function() {
            Popwin.prototype.init.call(this);
            return this;
        },
        _setParam: function() {
            Popwin.prototype._setParam.call(this);
            this.param.content = '<div class="pw_simple">' +
                    //'<div content="pw_simple_padding_box">' +
                '<div class="pw_simple_con">' +
                '<div class="pw_simple_forborder">' +
                '<s class="pw_simple_close"></s>'+
                this.param.content +
                '</div>' +
                '</div>'+
                    //'</div>' +
                '</div>';
        },
        _bindEvent: function() {
            Popwin.prototype._bindEvent.call(this);

            var self = this;
            var node = self.node;
            $('.pw_simple_close', self.node).on(TAP, function(e) {
                self.close();
            })
        }
    });

    //Alert
    function Alert(o) {
        SimplePopwin.call(this, o);
    }
    $.sc_inherit(Alert, SimplePopwin);
    $.extend(Alert.prototype, {
        init: function() {
            SimplePopwin.prototype.init.call(this);
            return this;
        },
        _setParam: function() {

            this.param.content = '<div class="pw_alert">' +
                '<div class="pw_alert_con">' +
                this.param.content +
                '</div>'+
                '</div>';
            SimplePopwin.prototype._setParam.call(this);
        }
    });
})();