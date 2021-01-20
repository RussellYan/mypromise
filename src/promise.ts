class MyPromise {
    constructor(fn: Function) {
        fn(this.resolve, this.reject);
    }

    success = null;
    fail = null;

    resolve = () => {
        setTimeout(() => this.success());
    }

    reject = () => {
        setTimeout(() => this.fail());
    }

    then = (success, fail?) => {
        this.success = success;
        this.fail = fail;
    }

}

export default MyPromise;