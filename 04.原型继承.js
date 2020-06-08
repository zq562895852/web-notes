/**
 * 1. __proto__,constructor 是对象独有的，prototype 是函数独有的  ，函数也是对象，故函数也拥有__proto__和constructor
 *
 *
 *
 */

function Person() {}

let p = new Person();

// 原型链是通过__proto__查找的，p没有，就向构造函数的Person.prototype去找，如果还没有通过Person.prototype.__proto__属性找到Object.prototype,如果没有继续通过Object.prototype.__proto__去找也就是null

// 构造函数 是对象也是函数，所以拥有 prototype 和 __proto__，constructor
// => 指向，  -> 属性
// p.__proto__  => Person.prototype (这是个对象)->   __proto__ => Object.prototype -> __proto__ => null

// Person.__proto__ => Function.prototype（对象）-> __proto__ => Object.prototype -> __proto__ => null

// Function.__proto__ => Function.prototype  -> __proto__ => Object.prototype -> __proto__ => null

// 函数的原型是对象
// Person.prototype.constructor => Person ->constructor => Function
// Object.prototype.constructor => Object->constructor => Function
// Function.prototype.constructor => Function
// p.constructor => Person-> constructor => Function
// Function.constructor => Function

/**
 * 总结：
 * 1.函数的prototype.constructor 指向自己  函数的constructor指向大函数（Function） 普通对象的constructor指向对象的构造函数
    大函数的构造函数指向了他自己
    
   2.对象通过__proto__属性查找原型链，函数独有属性prototype,对象独有属性__proto__,constructor,因为函数也是对象所有函数拥有这三个属性
 */

/**
 * typeof && instanceof 原理？
 * 
 * 
 * typeof null == 'object' 为什么？ 在javascript最初的实现中，值是由一个表示类型的标签和实际数据值表示的，对象的类型标签是0，由于null代表空指针（多数是这样），所以null的类型标签是0，js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息：
 *  1：整数
    110：布尔
    100：字符串
    010：浮点数
    000：对象
    对于 undefined和null 存储不一样，null所有机器码为0，undefined 用-2^30整数来表示 所以尽量用typeof判断基本类型，包括symbol,避免对null判断

    instanceof 检测实例是否在原型链上
 */

/**
 * new 关键字
 *
 *function objectFactory() {

    var obj = new Object(),//从Object.prototype上克隆一个对象

    Constructor = [].shift.call(arguments);//取得外部传入的构造器

    var F=function(){};
    F.prototype= Constructor.prototype;
    obj=new F();//指向正确的原型

    var ret = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性

    return typeof ret === 'object' ? ret : obj;//确保构造器总是返回一个对象

 };

 *
 */
