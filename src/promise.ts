
// promise 规范： 查看网站 Promise A+

enum promiseStates {
    PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected'
}
// Promise 是一个类, 需要传入一个executor执行器, 默认立刻执行
class MyPromise {
    status: promiseStates; // 当前promise的状态
    value: any; // resolve返回值
    error: any; // reject返回值
    onResolvedCallbacks: Function[]; // 存放成功的回调
    onRejectedCallbacks: Function[]; // 存放失败的回调

    constructor(executor: Function) {
        this.status = promiseStates.PENDING;
        this.value = undefined;
        this.error = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        // resolve reject 写在constructor里避免this混乱
        const resolve = (value: any) => {
            if (value instanceof MyPromise) {
                value.then(resolve, reject);
                return;
            }
            if (this.status === promiseStates.PENDING) {
                this.value = value;
                this.status = promiseStates.RESOLVED;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (error: any) => {
            if (this.status === promiseStates.PENDING) {
                this.error = error;
                this.status = promiseStates.REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            // 立刻执行 executor
            executor(resolve, reject);
          } catch(err) {
            console.log('executor error: ', err);
            reject(err);
          }
        
    }

    // then方法可以返回一个值，默认是undefined
    // 如果返回值是普通值，会把这个结果放到下一次then的成功回调中
    // 如果返回值是一个promise, 会采用这个promise的结果
    // catch的特点是如果都没有错误处理(一层层)没找到，会找最近的catch，catch也遵循then规则
    // .then.then并不是和jquery一样返回this, promise中实现链式调用主要靠返回一个新的promise
    then(onFulfilled: any, onRejected?: any): any {
        onFulfilled = (typeof onFulfilled === 'function') ? onFulfilled : (data:any) => data;
        onRejected = (typeof onRejected === 'function') ? onRejected : (err:any) => { throw err };
        // 为了实现链式调用，需要创建一个新的promise
        const nextPromise: MyPromise = new MyPromise((resolve, reject) => {
            if (this.status === promiseStates.RESOLVED) {
                // 执行then中的方法，可能返回的是一个值或者是一个promise
                // 需要判断返回值的类型，如果是promise，需要执行这个promise并采用它的状态作为promise的成功或失败
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        // nextPromise需要在setTimeout里面调，否者会拿不到
                        resolvePromise(nextPromise, x, resolve, reject);
                      } catch(err) {
                        // 一旦执行then方法报错，就走到外层then的错误处理中，调用nextPromise的reject
                        console.log(err);
                        reject(err);
                      }
                }, 0);
            }
            if (this.status === promiseStates.REJECTED) {
                setTimeout(() => {
                    try {
                      const x = onRejected(this.error);
                      resolvePromise(nextPromise, x, resolve, reject);
                    } catch(err) {
                      console.log(err);
                      reject(err);
                    }
                  }, 0);
            }
            if (this.status === promiseStates.PENDING) {
                // 处理异步
                this.onResolvedCallbacks.push(() => {
                    // todo ... 切片編程
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            resolvePromise(nextPromise, x, resolve, reject);
                        } catch (err) {
                            console.log(err);
                            reject(err);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.error);
                            resolvePromise(nextPromise, x, resolve, reject);
                        } catch (err) {
                            console.log(err);
                            reject(err);
                        }
                    });
                })
            }
        });
        return nextPromise;
    }

    catch(onRejected: any) {
        this.then(null, onRejected);
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const result = [];
            let process = 0;
            const length = promises.length;
            const collectData = (value: any, index: number) => {
                result[index] = value;
                process++;
                if (process === length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < length; i++) {
                const item = promises[i];
                if (isPromise(item)) {
                    item.then(y => {
                        collectData(y, i);
                    }, reject);
                } else {
                    collectData(item, i);
                }

            }
        })
    }

    // ....TODO.....
    static race(promises) {

    }
    
    static resolve(callback: any) {

    }

    static reject(callback: Function) {

    }

    finally(callback: Function) {

    }

}

// 处理每一次then返回的新promise (参数x为上个promise的fulfill返回值)
function resolvePromise(nextPromise: MyPromise, x: any, resolve: Function, reject: Function): void {
    // 为了兼容所有的promise,n个库之间的执行流程是一样的，尽可能详细不出错
    // 1).不能引用同一个对象，防止造成死循环
    if (nextPromise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    };
    // called的作用：防止(某些promise库)onFulfilled和onRejected同时被调用
    let called = false;
    if (isPromise(x)) {
        // 有可能是promise，promise要有then
        let then = x.then; // 有可能会报错，需要catch捕获err直接reject
        // 只取一次 当前promise解析出来的结果可能还是一个promise
        then.call(x, y => {
            if (called) return;
            called = true;
            // 递归处理返回值
            resolvePromise(nextPromise, y, resolve, reject);
        }, r => {
            if (called) return;
            called = true;
            console.log(r);
            reject(r)
        })
    } else {
        resolve(x);
    }
}

function isPromise(x: any) {
    const xType = typeof x;
    if (x !== null && (xType === 'object' || xType === 'function')) {
        try {
            const then = x.then;
            if (typeof then === 'function') {
                return true;
            }
        } catch(err) {
            console.log('not a promise: ', err);
            return false;
        }
    }
    return false;
 }

export default MyPromise;