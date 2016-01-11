/*@version 20151022*/
/**
 * 跑马灯
 //参数配置
 var mg = new Marquee({
        container: $('.J_custom'),
        items:[
            '1小明：一等奖',
            '2jack：二等奖',
            '3成吉思汗：特等奖',
            '4秦始皇：身体健康~~~~~~~~~~',
            '5爱因斯坦：再来一次',
            '6抱鹤：感谢有你'
        ],
        width:200,
        height:30,
        duration:3000,
        hover: true
    });
 mg.init();
 mg.run();
 */
var Marquee = (function() {
    var Mq = function(o) {
        var self = this;
        self.param = $.extend({
            width:300,
            height:25,
            speed:'normal',
            hover: false,
            test: 'test'
        }, o);
    };
    Mq.fn = Mq.prototype;

    $.extend(Mq.fn, {
        init: function() {
            var self = this;
            console.log('init');

            self._structure();
            self._bindEvent();
            return self;
        },
        _structure: function() {
            console.log('structure');
            var self = this;
            var param = self.param;
            var con = param.container;
            var items = param.items;

            con.addClass('wg_marquee');
            //todo 这里后期用模板优化
            var itemsStr = '';
            for(var i= 0,len=items.length;i<len;i++) {
                itemsStr += '<li class="item" style="height:'+ param.height +'px;line-height:'+ param.height +'px;">'+ items[i] +'</li>';
            }
            var box_oneStr = '<ul class="box_one">'+ itemsStr +'</ul>';
            var structureStr = '<div class="twitch_box" style="width:'+ param.width +'px;height:'+ param.height +'px;">'+
                box_oneStr +
                box_oneStr +
            '</div>';

            con.html(structureStr);
            self.twitch_box = $('.twitch_box', con);
            var box_ones = $('.box_one', con);
            self.box_front = box_ones[0];
            self.box_behind = box_ones[1];

        },
        _bindEvent: function() {
            var self = this;
            //todo hover

        },
        run: function() {
            var self = this;
            var param = self.param;
            console.log('run');

            var con = self.container;
            var twitch_box = self.twitch_box;
            var box_front = self.box_front;
            var box_behind = self.box_behind;
            var item_len = param.items.length;
            var box_height = item_len * param.height;
            var currentIndex = 1;

            runOneStep();
            function runOneStep () {
                var originTop = parseInt(twitch_box.css('top').split('px')[0], 10);
                twitch_box.animate({top:  originTop - param.height},
                    param.speed,
                    function() {
                        currentIndex ++;
                        if(currentIndex == item_len + 1) {
                            changebox();//置换前后box
                            currentIndex = 1;
                        }
                        runOneStep();
                    }
                );
            }

            function changebox() {
                $(box_front).insertAfter($(box_behind));
                //加padding-top
                var oldPaddingTop = parseInt(twitch_box.css('padding-top').split('px')[0], 10);
                twitch_box.css({'paddingTop':oldPaddingTop + box_height});
                //交换前后身份
                self.box_front = box_behind
                self.box_behind = box_front;
            }

            return self;
        },
        pause: function() {
            var self = this;
            //todo
            console.log('pause');
        },
        play: function() {
            var self = this;
            //todo
            console.log('play');
        },
        update: function(newItems) {
            console.log('update');
            var self = this;
            var param = self.param;
            param.items = newItems;
            self._clear();
            self._structure();
            self.run();
        },
        _clear: function() {
            var self = this;
            clearInterval(self.timer);
        }
    });
    return Mq
})();