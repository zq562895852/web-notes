/**
 * promsie实现，
 * 首先分析一下
 * 1. 状态 pending(等待),fulfiled(成功) rejected(失败)
 * 2. then 链式调用方法
 * 3. all方法 以最后一个返回的为准执行回调函数
 * 4. race方法 以最快返回的执行回调
 * 5. catch方法
 */

class Promise {
  constructor(executor) {
    //  默认的等待状态
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    // 存放成功的回调
    this.onResolveCallbacks = [];
    // 存放失败的回调
    this.onRejectCallbacks = [];

    let resolve = (data) => {
      if (this.status === "pending") {
        this.status = "resolved";
        this.value = data;
        this.onResolveCallbacks.forEach((fn) => fn());
      }
    };

    let reject = (reason) => {
      if (this.status === "pending") {
        this.status = "rejected";
        this.reason = reason;
        this.onRejectCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onResolve, onReject) {
    if (this.status === "resolved") {
      //成功
      onResolve(this.value);
    }
    if (this.status === "rejected") {
      onReject(this.reason);
    }
    // 当前既没有成功也没有失败
    if (this.status === "pending") {
      // 存放成功的回调
      this.onResolveCallbacks.push(() => {
        onResolve(this.value);
      });
      // 存放失败的回调
      this.onRejectCallbacks.push(() => {
        onReject(this.reason);
      });
    }
  }
}

let b = { [Symbol.toPrimitive]: ((i) => () => ++i)(0) };
