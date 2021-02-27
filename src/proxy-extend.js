/**
 * 利用proxy实现extend
 * @param {*} inheritedClass 要扩展的父类
 * @param {*} self 自身
 */
function extend(inheritedClass, self) {
  const descriptor = Object.getOwnPropertyDescriptors(self.prototype, 'constructor');
  // 让self.__proto__ 指向 inheritedClass.prototype
  self.prototype = Object.create(inheritedClass.prototype);
  const handler = {
    // new 操作符的捕捉器
    construct: function(target, args) {
      const obj = Object.create(self.prototype);
      // this.apply调用的是handler的apply方法
      this.apply(target, obj, args);
      console.log('construct: ==> ', target.toString(), obj);
      return obj;
    },
    // 函数调用操作的捕捉器
    apply: function(target, that, args) {
      console.log('apply: ==> ', target.toString(), that.toString(), args);
      inheritedClass.apply(that, args);
      self.apply(that, args);
    }
  }
  const proxy = new Proxy(self, handler);
  descriptor.value = proxy;
  Object.defineProperty(self.prototype, 'constructor', descriptor);
  return proxy;
}

const Person = function(name) {
  console.log('Person');
  this.name = name;
}

const Boy = extend(Person, function(name, age) {
  console.log('Boy');
  this.age = age;
});

Boy.prototype.sex = 'Male';

const Russell = new Boy('Russell', 17);