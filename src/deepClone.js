// 深拷贝网上有很多答案，但是大部分都忽略了对‘函数function’这个特殊类型的拷贝
// 克隆一个函数
Function.prototype.clone = function() {
  eval(`var ${this.name}`);
  eval(`${this.name} = ${this.toString()}`);
  for (let key in this) {
    if (this.hasOwnProperty(key)) {
      // TODO...
      // 可能还有更复杂的情况，function的属性又有引用类型等...
      eval(`${this.name}[key] = this.key`);
    }
  }
  return eval(`${this.name}`);
}

// TODO
// 判断对象的类型：RegExp, Date, Array, Object, Map, WeakMap, Set, WeakSet....
function getObjType(value, type) {

}

/**
 * 相对完整的深拷贝
 * @param {*} target 拷贝的对象
 * @param {*} hash 用于存放对象的拷贝记录，可以处理一些循环引用
 *  ====> 容易忽略的几个类型: Function, Map, WeakMap, Set, WeakSet
 */
function deepClone(target, hash = new WeakMap()) { // dog sun的 ts-node报错说不支持WeakMap....， 以后再研究一下
  // 基本数据类型, null, undefine, symbol
  if ((typeof target !== 'object') || target == null) return target;
  // 拷贝正则对象
  if (target instanceof RegExp) return new RegExp(target);
  // 拷贝日期对象
  if (target instanceof Date) return new Date(target);
  // 还有 Map, Set, WeakMap, WeakSet......  TODO.....
  // 参考：https://blog.csdn.net/vipp666/article/details/83541319
  // 拷贝的target可能是数组或者对象，所以要用for in
  // 创建一个新的空数组或者空对象, 存放处理结果
  const instance = new target.constructor;
  if (hash.has(target)) {
    // 已经处理过该target，直接返回上次保存的处理结果
    return hash.get(target);
  } else {
    // hash可以放在它属性赋值之前, instance是引用类型所以，下面deepClone也要用到最新hash
    hash.set(target, instance);
  }
  for (let key in target) {
    // 过滤掉原型链上的属性
    if (target.hasOwnProperty(key)) {
      if (typeof target[key] === 'function') {
        const oldFunc = target[key];
        // 值是函数，拷贝该函数
        instance[key] = oldFunc.clone();
      } else {
        instance[key] = deepClone(target[key], hash);
      }
    }
  }
  return instance;
}



// test:

// var s = {
//   a: 1,
//   b: [3],
//   c: function() {
//     return 2;
//   },
//   self: null
// }
// s.self = s;
// const newWp = new WeakMap();
// const newS = deepClone(s, newWp);
// console.log(s, newS, newS.c === s.c);

var func = function(x) {console.log(x)};
console.log(func.clone().toString());

