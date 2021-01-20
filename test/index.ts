import * as Chai from 'chai';
import * as Sinon from 'sinon';
import * as SinonChai from 'sinon-chai'
import MyPromise from '../src/promise';

const { assert } = Chai;

describe('Promise', () => {
    it('test mypromise', () => {
        assert.isFunction(MyPromise);
        assert.isObject(MyPromise.prototype);
    });

    it('new promise return then', () => {
        const promise = new MyPromise(() => {});
        assert.isFunction(promise.then)
    });

    it('fn excutes immediately', () => {
        const fn = Sinon.fake();
        new MyPromise(fn);
        assert(fn.called);
    })

    it('promise.then(success) 中的 success 会在 resolve 被调用的时候执行', done => {
        const success = Sinon.fake();
        const promise = new MyPromise((resolve, reject) => {
          resolve();
          assert.isFalse(success.called); // success 是异步调用的，所以现在是false
          setTimeout(() => {
            assert.isTrue(success.called); // setTimeout 是true
            done(); // done 表示异步测试完成
          });
        });
        promise.then(success);
    });

    it('promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行', done => {
        const fail = Sinon.fake();
        const promise = new MyPromise((resolve, reject) => {
            reject();
            assert.isFalse(fail.called);
            setTimeout(() => {
                assert.isTrue(fail.called);
                done();
            });
        });
        promise.then(null, fail);
    });

    it('test init status', () => {
        const promise = new MyPromise(() => {})
        assert(promise.status === 'pending')
    })

    it('test resolve status', done => {
        const promise = new MyPromise((resolve) => {
          resolve();
          setTimeout(() => {
            assert(promise.status === 'fulfilled');
            done();
          })
        })
        promise.then(() => {}, () => {});
    });

    it('test reject status', done => {
        const promise = new MyPromise((resolve, reject) => {
          reject();
          setTimeout(() => {
            assert(promise.status === 'rejected');
            done();
          });
        })
        promise.then(() => {}, () => {});
    });

    it('onFulfilled onRejected 如果非函数跳过', () => {
        const promise = new MyPromise((resolve, reject) => {
          reject();
        });
        promise.then(false, null);
    });

    it('then 可以多次调用', done => {
        const callbacks = [Sinon.fake(), Sinon.fake(), Sinon.fake()];
        const promise = new MyPromise((resolve, reject) => {
            resolve();
        });
        promise.then(callbacks[0]); // 多次使用.then()
        promise.then(callbacks[1]);
        promise.then(callbacks[2]);
        setTimeout(() => {
            assert.isTrue(callbacks[0].called); 
            assert.isTrue(callbacks[0].calledBefore(callbacks[1])) // 确保调用顺序
            assert.isTrue(callbacks[1].called);
            assert.isTrue(callbacks[1].calledBefore(callbacks[2]))
            assert.isTrue(callbacks[2].called);
            done();
        });
    });

    it('失败回调', done => {
        const callbacks = [Sinon.fake(), Sinon.fake(), Sinon.fake()];
        const promise = new MyPromise((resolve, reject) => {
            reject();
        });
        promise.then(null, callbacks[0]);
        promise.then(null, callbacks[1]);
        promise.then(null, callbacks[2]);
        setTimeout(() => {
            assert.isTrue(callbacks[0].called); 
            assert.isTrue(callbacks[0].calledBefore(callbacks[1]))
            assert.isTrue(callbacks[1].called);
            assert.isTrue(callbacks[1].calledBefore(callbacks[2]))
            assert.isTrue(callbacks[2].called);
            done();
        });
    });

    

})