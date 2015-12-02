(function() {
    var md = angular.module("myClock", []);

    //取变量，公司的发票抬头
    md.value('taitou', '淘宝（中国）软件有限公司');

    //常量
    md.constant('cps', {
        taobao: {
            name  :"淘宝网",
            taitou:"淘宝中国软件有限公司",
            city  :"杭州"
        },
        ali: {
            name  :"阿里云",
            taitou:"阿里巴巴云计算技术有限公司",
            city  :"北京"
        },
        yunos: {
            name  :"云OS",
            taitou:"阿里巴巴云操作系统有限公司",
            city  :"上海"
        }
    });

    //定时器服务factory  tips:有同功能的内部模块$interval
    md.factory('setInterval', function() {
        return function(callback, time) {
            callback();
            setInterval(function() {
                callback();
            }, time);
        };
    });

    //时钟组件服务service
    md.service('clock', ['setInterval', function(setInterval) {
        this.myClock = function(o) {
            var box =  $('.clockStr', o.container);
            box.css({
                color: o.color
            });
            setInterval(function() {
                var t = new Date().toString();
                box.html(t);
            }, 1000);
        };
    }]);

    //clock指令
    md.directive("ctmClock", function(clock) {
        return {
            restrict: 'E',
            template: '<div class="myClock" data-i="123">' +
                '抬头：<span class="taitou" ng-model="taitoushow">{{taitou}}</span><br/>' +
                '<span class="clockStr"></span>' +
                '</div>',
            replace: false,
            link: function(scope, element, attrs) {
                console.log(scope);
                clock.myClock({
                    container   :   element,
                    color       :   'red'
                });
            }
        };
    });

    //控制器
    md.controller('myController', ['$scope', 'taitou',function(scope, taitou) {
        console.log(scope);
        //操作作用域
        scope.taitou = taitou;

        scope.taobao = {
            name  :"淘宝网",
            taitou:"淘宝中国软件有限公司",
            city  :"杭州",
            price:'100'
        };
        scope.ali = {
            name  :"阿里云",
            taitou:"阿里巴巴云计算技术有限公司",
            city  :"北京",
            price:'101'
        };
        scope.yunos = {
            name  :"云OS",
            taitou:"阿里巴巴云操作系统有限公司",
            city  :"上海",
            price:'102'
        }

        scope.Emmy = {
            name: "Emmy",
            address: "1600 Amphitheatre"
        };
        scope.Edison = {
            name: "Edison",
            address: "2500 Amphitheatre"
        };
    }]);

    //指令-点击几个按钮的事件
    md.directive('ctmBtn',  function() {
        return {
            restrict    :'E',
            template    :'<div class="ctm-btn">{{a}}<span ng-transclude></span></div>',
            replace     :true,
            transclude  :true,
            link        :function(scope, element, attrs) {
                var con = $(element);
                $(element).delegate('button', 'click', function(e) {
                    var tar = $(e.target);
                    var title = tar.attr('data-title');
                    scope.taitou = scope[title].taitou;
                    scope.$apply();
                });
            }
        }
    });

    md.directive('ctmTaitou', function() {
        return {
            restrict    :'E',
            template    :'<div class="ctm-taitou">'+
                '<p>名字：{{cp.name}}</p>'+
                '<p>抬头：{{cp.taitou}}</p>'+
                '<p>城市：{{cp.city}}</p>'+
                '<p>股价：{{cp.price}}</p>'+
                '</div>',
            replace     :true,
            scope       : {
                cp:"=sb"
            },
            link: function(scope) {
            }
        }
    });

    md.directive('ctmName', function() {
        return {
            restrict    :'E',
            template    :'<div>name:{{name}}，address:{{address}}。</div>',
            replace     :true,
            scope       : {
                name    : '@name',
                address : '=address'
            }
        }
    });

}) ();