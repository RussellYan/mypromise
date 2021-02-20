# 手写实现简版 promise

[Promise规范参考](https://promisesaplus.com/)
>1、安装测试工具：
`npm install -g promise-aplus-tests`

>2、测试脚本例子：
```javascript
  const Promise = require('./promise.js');
  Promise.defer = Promise.deferred = function() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  }
```
>3、在测试脚本的目录运行下面的命令：
`promise-aplus-tests promise.js`;