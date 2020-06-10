/**
 * react 相关
 */

//  useState 函数组件也可以有自己的状态
/**
 * useEffect：
 *  用来处理副作用
 * 特点：有一个回调，和一个依赖数组，如果这个数组是空的，callback每次render都会执行，如果存在，只有count发生变化才会执行callback
 */
// useEffect(() => {
//     console.log(count);
// }, [count]);

/**
 * 高阶组件：
 *  就是一个函数，接收一个参数（组件)，返回一个新的组件
 */
