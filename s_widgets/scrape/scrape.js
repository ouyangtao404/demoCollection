function Scrape(o) {
    this.param = $.extend({
        coatImg : '/_common/materials/256.png',
        coatColor: '#ccc',
         //开始请求抽奖的比例
        requestCondition: 1,
        //涂层全开的刮开比例
        openCondition: 40
    }, o);
    this.nodes = {};
    this.canvas = null;
}
$.extend(Scrape.prototype, {
    init: function() {
        var self = this;
        this._createStructure();
        this._createCanvas();
        return self;
    },
    _createCanvas: function() {
        var self = this;
        setTimeout(function() {
            self._clear();
            var isStartFirst = true;
            var isOpenFirst = true;

            self._renderCoat(1, function(f, t) {
                var percent = parseInt(f.toFixed(2), 10);
                if(isStartFirst && percent > self.param.requestCondition) {
                    isStartFirst = false;
                    $(self).trigger('scrape.start');
                }
                if(isOpenFirst && percent > self.param.openCondition) {
                    self.openCoat();
                    isOpenFirst = false;
                    $(self).trigger('scrape.open');
                }
            });

        }, 200);
    },
    showResult: function(str) {
        var self = this;
        self.nodes.resultBox = $('<div class="result">'+ str +'</div>').css({
            position    : 'absolute',
            width       : '100%',
            textAlign   : 'center',
            top         : self.canvas.height/2
        }).appendTo(self.param.container);
        self.nodes.bgImg.css('visibility', 'hidden');
    },
    openCoat: function() {
        var self = this;
        var canvas = self.canvas;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    },
    refresh: function() {
        this._createCanvas();
    },
    _clear: function() {
        var self = this;
        self.nodes.bgImg.css('visibility', 'hidden');
        self.param.container.find('canvas').remove();
        self.param.container.find('.result').remove();
    },
    _createStructure: function() {
        var self = this;

        self.param.container.css({
            'position':'relative'
        });
        //创建图片
        var img = $('<img style="width:100%;display:block;visibility:hidden;" src="'+ self.param.bgImg +'"/>');
        img.appendTo(self.param.container);
        self.nodes.bgImg = img[0];
        self.nodes.bgImg = $('img', self.param.container);

        var coatImg = $('<img style="width:100%;display:block;" src="'+ self.param.coatImg +'"/>');
        self.nodes.coatImg = coatImg;
    },

    _renderCoat: function(condition,callback,isOnce) {
        var self = this;
        var img = this.nodes.bgImg[0];
        if(img.complete || img.readyState == 'loading' || img.readyState == 'complete'){
            console.log('complete');
            canvasInit();
        } else {
            img.onload = canvasInit();
        }

        function canvasInit() {
            generate();
            self.nodes.bgImg.css('visibility', 'visible');
        }

        //引入代码
        function generate() {
            var cvs = document.createElement('canvas');
            cvs.style.position = 'absolute';
            cvs.style.zIndex = 5;
            cvs.style.left = img.offsetLeft+'px';
            cvs.style.top = img.offsetTop+'px';
            cvs.width = img.width;
            cvs.height = img.height;
            img.parentNode.insertBefore(cvs,img);
            var context = cvs.getContext('2d');
            self.canvas = cvs;

            if(self.param.coatImg) {
                var coverImg = self.nodes.coatImg[0];
                var pat = context.createPattern(coverImg,"repeat");
                context.fillStyle = pat;
            } else {
                context.fillStyle = self.param.coatColor;
            }

            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.globalCompositeOperation = 'destination-out';
            context.strokeStyle = "fff";
            context.lineJoin = "round";
            context.lineWidth = 35;
            var offsetParent = cvs,offsetLeft=0,offsetTop=0;
            while(offsetParent){
                offsetLeft += offsetParent.offsetLeft;
                offsetTop += offsetParent.offsetTop;
                offsetParent = offsetParent.offsetParent;
            }
            var pathPoints=[];
            var x,y;
            var start='mousedown',move='mousemove',end='mouseup';
            if(document.createTouch){
                start="touchstart";
                move="touchmove";
                end="touchend";
            }
            cvs.addEventListener(start,onTouchStart);


            function onTouchStart(e){
                e.preventDefault();
                if(e.changedTouches){
                    e=e.changedTouches[e.changedTouches.length-1];
                }
                console.log(e.pageX,offsetLeft);
                x=e.pageX - offsetLeft;
                y=e.pageY - offsetTop;
                context.beginPath();
                context.arc(x, y, 35/2, 0, Math.PI*2, true);
                context.closePath();
                context.fill();
                document.addEventListener(end,onTouchEnd);
                cvs.addEventListener(move,onTouch)

            }

            function onTouch(e){
                if(e.changedTouches){
                    e=e.changedTouches[e.changedTouches.length-1];
                }
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(e.pageX - offsetLeft, e.pageY- offsetTop);
                x=e.pageX - offsetLeft;y=e.pageY - offsetTop;
                context.closePath();
                context.stroke();
                var n=(Math.random()*10000000)|0;
                context.canvas.style.color='#'+ n.toString(16);//fix android 4.2 bug force repaint

            }

            function onTouchEnd(){
                cvs.removeEventListener(move,onTouch);
                pathPoints=[];
                check();
            }
            function check(){
                var st=+new Date();
                data=context.getImageData(0,0,cvs.width,cvs.height).data;
                var length=data.length,k=0;
                for(var i=0;i<length-3;i+=4){
                    if(data[i]==0&&data[i+1]==0&&data[i+2]==0&&data[i+3]==0){
                        k++;
                    }
                }
                var f=k*100/(cvs.width*cvs.height);
                if(f>(condition||90)){
                    if( callback){
                        callback(f,t);
                        if(isOnce){
                            callback=null;}

                    }

                }
                var t=+new Date()-st;
                console.log('刮开面积:'+f.toFixed(2)+'% 检测耗时'+ t+'ms ');
                data=null;
            }
        }
    }
});