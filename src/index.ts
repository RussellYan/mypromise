// import MyPromise from './promise';

// const p = new MyPromise((resolve, reject) => {
//   console.log('立刻执行:');
//   // resolve(1);
//   resolve(234);
//   // setTimeout(() => {
//   //   throw new Error('抛出错误'); // setTimeout里的抛错无法捕获
//   // }, 2000);
//   // console.log('异步');
//   // throw new Error('抛出错误');
// });
// p.then((data) => {
//   console.log('成功1：', data);
// }, (err) => {
//   console.log('失败1：', err);
//   // 运行到这一步，如果返回值是基本类型，会被下一个then的onFulfilled接收而
//   return '第一次失败了'; 
// }).then((data) => {
//   console.log('成功2：', data);
// }, (err) => {
//   console.log('失败2：', err);
// });

// MyPromise.all([1,2, p]).then(data => {
//   console.log('result: ', data);
// }).catch(err => {
//   console.log('error: ', err);
// });

Promise.reject().finally(() => {
  console.log(1);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('resolve');
    }, 1000);
  })
}).catch(err => {
  console.log('error: ', err);
})