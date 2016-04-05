var TAP = 'click';
var LOADING = 'loading';
var ACTIVE = 'active';
var CLASS = 'w_cardlottery';

function Cardlottery(o) {
    this.param = $.extend({
        leastNumber: 2
    }, o);
}
$.extend(Cardlottery.prototype, {
    init: function() {
        var self = this;
        this._createStructure();
        this._paramInit();
        //this._createCanvas();
        this._bindEvent();
        return self;
    },
    _paramInit: function() {
        var list = [];
        this.param.cardList.forEach(function(item) {
            list.push(item);
        });
        this.param.cardList = list;
        this.param.turnsNumberPerLottery = 0;//圈数，以０开始计，有结果则归零
    },
    _bindEvent: function() {
        var self = this;
        var param = self.param;
        param.startBtn.on(TAP, function(e) {
            if(self._isLock()) {
                return;
            }
            self._lock();
            self._run();
            param.onStart && param.onStart();
        });
    },
    _createStructure: function() {
        this.param.container.addClass(CLASS);
        this.param.cardList.forEach(function(item, index) {
            $(item).attr('data-index', index);
        });
    },
    _run: function() {
        console.log('is running');
        var self = this;
        var during = 150;
        self.param.turnsNumberPerLottery = 0;
        var cardList = this.param.cardList;

        self.timer = setInterval(function() {
            var currentCard = self.param.container.find('.'+ ACTIVE);
            if(currentCard.length == 0) {
                currentCard = cardList[0];
                currentCard.addClass(ACTIVE);
                return;
            }
            var currentIndex = parseInt(currentCard.attr('data-index'), 10);
            var newIndex = currentIndex + 1;
            if(newIndex == cardList.length) {
                newIndex = 0;
                self.param.turnsNumberPerLottery ++;
            }
            self._setNewctive(currentIndex, newIndex);
            $(self).trigger('cardlottery.jump', {
                currentIndex: newIndex
            });
        }, during)
    },
    _setNewctive: function(currentIndex, newIndex) {
        var cardList = this.param.cardList;
        cardList[currentIndex].removeClass(ACTIVE);
        cardList[newIndex].addClass(ACTIVE);
    },
    go: function(index) {
        var self = this;
        var param = self.param;
        $(self).on('cardlottery.jump', function(e, data) {
            if(data.currentIndex == index && param.turnsNumberPerLottery >= param.leastNumber) {
                clearInterval(self.timer);
                $(self).off('cardlottery.jump');
                this._unLock();
                console.log('the result is '+ index);
                param.onComplete && param.onComplete.call(self);
            }

        });
    },
    _isLock: function() {
        if(this.param.startBtn.hasClass(LOADING)) {
            return true;
        }
        return false;
    },
    _lock: function() {
        this.param.startBtn.addClass(LOADING);
    },
    _unLock: function() {
        console.log('unLock');
        this.param.startBtn.removeClass(LOADING);
    }
});