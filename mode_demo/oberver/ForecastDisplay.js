//布告板类，继承自观察者
function ForecastDisplay(o) {
    Observer.call(this, arguments);
    this.name = o.name;
    this.subject = null;
}
extend(ForecastDisplay, Observer);
$.extend(ForecastDisplay.prototype, {
    display: function(o) {
        console.log(this.name + ' says:'+ JSON.stringify(o));
    }
});
