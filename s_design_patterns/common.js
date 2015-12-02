//继承
//只继承原型链上的方式，不继承父类的静态方法，不确定是否合理？
function extend(SubType, SuperType) {
    function Foo() {}
    Foo.prototype = SuperType.prototype;

    SubType.prototype = new Foo();
    SubType.prototype.constructor = SubType;
}

