/**
 * Vue双向绑定，简单模拟
 */

// defineProperty版本（老版本Vue）
const obj = {name: 'russell', sex: 'M', age: '32', info: {
  hobby: 'game'
}, arr: [1,2,3,4]};
function update() {
  console.log('数据更新了');
}
function observer(target) {
  if (typeof target !== 'object') {
    return target;
  }
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}
// 把对象的所有属性都采用Object.defineProperty方式定义
function defineReactive(target, key, value) {
  observer(value);
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(val) {
      if (value !== val) {
        update();
        return val
      }
    }
  });
}
// observer(obj);
// obj.age = 34;
// obj.info.hobby = 'learn';

// proxy版本 (Object.defineProperty不支持数值，proxy可以监听到数组)
const arr = {a:1, b: {c: 2}, arr: [1]};
const handler = {
  // 第三个叫代理的对象，一般不用
  get(target, key, proxy) {
    // 不可以在这里打印第三个参数，会触发死循环造成内存泄漏
    // console.log(proxy);
    if (typeof target[key] === 'object') {
      return new Proxy(target[key], handler);
    }
    // return target[key];
    // 等价于
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    const oldValue = target[key];
    console.log('==========', key, value, oldValue, [value, oldValue]);
    if (value !== oldValue) {
      update();
      // target[key] = value;
      // console.log('~~~~ ', target);
      // return true;
      // 等价于
      return Reflect.set(target, key, value);
    }
    // 处理数组push等，不加会报错
    return true;
  }
}
const proxy = new Proxy(arr, handler);


// proxy.b.c = 7;
proxy.arr.push(123)
console.log(arr);