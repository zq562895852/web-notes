// 发布订阅， 发布和订阅是没有关系的
const e = {
  event: [],
  on(listen) {
    this.event.push(listen);
    //取消订阅
    return () => {
      this.event = this.event.filter(fn => fn != listen);
    };
  },
  emit(e) {
    this.event.forEach(fn => {
      fn(e);
    });
  }
};

e.on(e => {
  console.log("订阅1");
});

e.on(e => {
  console.log("订阅2");
});
e.emit(12);

// 观察者模式 被观察的对象在观察者列表中

// 观察者
class Subject {
  constructor() {
    this.observe = []; //观察者列表
  }
  add(observe) {
    this.observe.push(observe);
  }
  notify() {
    //   通知更新
    this.observe.forEach(o => o.update());
  }
}

// 被观察者
class Observe {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log("目标更新了");
  }
}

let s = new Subject();
let o = new Observe("one");
s.add(o);
s.notify();
