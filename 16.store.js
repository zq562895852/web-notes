/**
 * vuex,Flux,Redux,Redux-saga,Dva,Mobx
 */

/**
 *  vuex
 * 1. vue传值的方法  父子 props   $parent/$children调用组件的方法   provide/reject  ref  eventBus  vuex   localStorage/sessionStorage
 * $attrs/$listeners
 * 2. gettes
 * Redux： view——>actions——>reducer——>state变化——>view变化（同步异步一样）

Vuex： view——>commit——>mutations——>state变化——>view变化（同步操作） view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）
 */

/**
 * redux
 * 1. 只有一个store
 * 2. 核心代码就是下面这个，当然还有很多东西，不过核心就这几行，
 * 3. Redux有三大原则： 单一数据源：Flux 的数据源可以是多个。 State 是只读的：Flux 的 State 可以随便改。 * 使用纯函数来执行修改：Flux 执行修改的不一定是纯函数。
 */

export const createStore = () => {
  let state = {};
  let eventListenners = [];
  function getState() {
    return state;
  }
  function dispatch(action) {
    //   reducer 就是动作类型
    state = reducer(state, action);
    // 当数据发生改变时，通知订阅者
    eventListenners.forEach(fn => fn());
  }
  function subscribe(listen) {
    eventListenners.push(listen);
    return () => {
      eventListenners = eventListenners.filter(fn => fn !== listen);
    };
  }

  dispatch({ type: "@@redux_init" }); //初始化store数据

  return { getState, dispatch, subscribe };
};

const initState = {
  count: 0
};

function reducer(state = initState, action) {
  // reducer根据传入的action做不同的操作，并返回，reducer是纯函数，相同的输入一定是相同的输出
  switch (action.type) {
    case "plus":
      return {
        ...state,
        count: state.count + 1
      };

    default:
      return state;
  }
}

// Provider 实现 通过上下文对象，使用静态属性

/**
 * redux-saga
 * redux-saga 把异步获取数据这类的操作都叫做副作用，它的目标就是把这些副作用管理好，让他们执行更高效，测试更简单，在处理故障时更容易。
 */

/**
 * mobx
 * autoRun  依赖收集
 * MobX 允许有多个 store，而且这些 store 里的 state 可以直接修改
 */
