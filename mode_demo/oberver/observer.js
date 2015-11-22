//发布者
function Observable() {
    this.observers = [];
    this.changed = false;
}
$.extend(Observable.prototype, {
    //注册
    register: function(observer) {
        if(observer instanceof Observer) {
            //todo 可以监测该成员是否已经存在
            this.observers.push(observer);
        } else {
            console.warn('有个实例非继承自Observer!');
        }
    },
    //移除
    remove: function(observer) {
        var index = $.inArray(observer, this.observers);
        if(index != -1) {
            this.observers.splice(index, 1);
            console.log('remove successfull!');
        }
    },
    notifyObsevers: function(o) {
        if(this.changed) {
            $(this.observers).each(function(index, observer) {//!可能index，item顺序不对
                observer.update(o)
            });
            this.changed = false;
        }
    },
    setChanged: function() {
        this.changed = true;
    }
});

//观察者类
function Observer() {
    this.subject = null;
}
$.extend(Observer.prototype, {
    update: function(o) {
        this.display(o);
    },
    display: function(o) {
        console.error('实例中必须实现display方法');
    },
    regist: function(observerable) {
        this.subject = observerable;
        observerable.register(this);
    },
    remove: function() {
        this.subject.remove(this);
    }
});