# 手写实现简版 promise

[Promise规范参考](https://promisesaplus.com/)
>安装测试工具： npm install -g promise-aplus-tests

```javascript
// 测试脚本：
  Promise.defer = Promise.deferred = function() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
```