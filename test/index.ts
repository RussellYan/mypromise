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

    it('new Promise(fn) 中 fn 立刻执行', () => {
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
})