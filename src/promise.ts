class MyPromise {
    constructor(fn: Function) {
        fn(this.resolve, this.reject);
    }

    success = null;
    fail = null;
    status = 'pending';
    // 支持多个回调
    callbacks = [];

    resolve = value => {
        if (this.status !== 'pending') return;
        this.status = 'fulfilled';
        setTimeout(() => {
            this.callbacks.forEach(cb => {
                if (cb[0] instanceof Function) {
                    cb[0].call(undefined, value);
                }
            })
        });
    }

    reject = reason => {
        if (this.status !== 'pending') return;
        this.status = 'rejected';
        setTimeout(() => {
            this.callbacks.forEach(cb => {
                if (cb[1] instanceof Function) {
                    cb[1].call(undefined, reason);
                }
            })
        });
    }

    then = (success?, fail?) => {
        const cbs = [];
        if (success instanceof Function) {
            cbs[0] = success;
        }
        if (fail instanceof Function) {
            cbs[1] = fail;
        }
        this.callbacks.push(cbs);
    }

}

export default MyPromise;