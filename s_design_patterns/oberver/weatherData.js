function WeatherData() {
    this.temperature = null;
    this.pressure = null;
    Observable.call(this, arguments);
}
extend(WeatherData, Observable);
$.extend(WeatherData.prototype, {
    getTemperature: function() {
        return 23;
    },
    getPressure: function() {
        return 80;
    },
    run: function() {
        this.setChanged();//由实现类来控制触发的门槛
        this.notifyObsevers({
            temperature: this.temperature,
            pressure: this.pressure
        });
    },
    updateData: function() {
        this.temperature = this.getTemperature();
        this.pressure = this.getPressure();
        this.run();//更新了状态就一定run一下；
    }
});