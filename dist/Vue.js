var Vue = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var GlobalFunc = null;

  var _default$3 = /*#__PURE__*/_createClass(function _default(fn) {
    _classCallCheck(this, _default);

    // 1. 通过wapperFn每次都将会重新调用fn
    function wapperFn() {
      console.log("触发了");
      GlobalFunc = wapperFn;
      fn();
      GlobalFunc = null;
    } // 1. 只会触发一次fn调用


    wapperFn(); // console.log("触发了")
    // GlobalFunc = fn
    // fn()
    // GlobalFunc = null
  });

  var _default$2 = /*#__PURE__*/function () {
    function _default() {
      _classCallCheck(this, _default);

      this.listener = new Set();
    }

    _createClass(_default, [{
      key: "depend",
      value: function depend() {
        if (GlobalFunc) {
          this.listener.add(GlobalFunc);
        }
      }
    }, {
      key: "notify",
      value: function notify() {
        this.listener.forEach(function (fn) {
          return fn();
        });
      }
    }]);

    return _default;
  }();

  var ArrayFunc = ['push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice'];

  var _default$1 = /*#__PURE__*/function () {
    function _default(target) {
      _classCallCheck(this, _default);

      _defineProperty(this, "__dep", {});

      for (var k in target) {
        this.__dep[k] = new _default$2();
        var initVal = target[k];

        if (Array.isArray(initVal)) {
          this.__reactiveArray(k, initVal);
        } else {
          this.__reactiveCommon(k, initVal);
        }
      }
    }

    _createClass(_default, [{
      key: "__reactiveCommon",
      value: function __reactiveCommon(key, initVal) {
        var vm = this;
        Object.defineProperty(vm, key, {
          get: function get() {
            console.log("\u4F9D\u8D56\u6536\u96C6".concat(key));

            vm.__dep[key].depend();

            return initVal;
          },
          set: function set(val) {
            if (initVal !== val) {
              initVal = val;

              vm.__dep[key].notify();
            }
          }
        });
      }
    }, {
      key: "__reactiveArray",
      value: function __reactiveArray(key, initVal) {
        var vm = this;
        var obj = Object.create(Array.prototype);
        ArrayFunc.forEach(function (funName) {
          obj[funName] = function () {
            var _Array$prototype$funN;

            (_Array$prototype$funN = Array.prototype[funName]).call.apply(_Array$prototype$funN, [this].concat(Array.prototype.slice.call(arguments)));

            vm.__dep[key].notify();
          };
        });
        var t = Object.create(obj);
        initVal.forEach(function (val) {
          return t.push(val);
        });
        initVal = t;
        Object.defineProperty(vm, key, {
          get: function get() {
            vm.__dep[key].depend();

            return initVal;
          },
          set: function set(val) {
            if (initVal !== val) {
              initVal = val;

              vm.__dep[key].notify();
            }
          }
        });
      }
    }]);

    return _default;
  }();

  var _default = /*#__PURE__*/function () {
    function _default(options) {
      _classCallCheck(this, _default);
      this.$options = options;

      this.__init();
    }

    _createClass(_default, [{
      key: "__init",
      value: function __init() {
        this.__initState();

        new _default$3(this.$options.render.bind(this));
        this.$mount(this.$options.el); // 判断是否是根节点
        // if(this.$options.el) {
        // }
        // new initListener()
        // new InitLifeCycle()
        // this.beforeCreated()
        // new InitState()
        // this.beforeCreated()
        // if (el) {
        //     // 是用来挂载的Root节点
        //     this.$root = null
        // }
        // const componentRender = InitRender(render || template)
        // this.beforeMount()
        // if (created) {
        //  }
        // new Watcher(render.bind(this))
        // return obs
      }
    }, {
      key: "__initState",
      value: function __initState() {
        var _this = this;
        var data = this.$options.data;
        data = typeof data === 'function' ? data.call(this) : data;
        data = new _default$1(data);

        var _iterator = _createForOfIteratorHelper(Object.getOwnPropertyNames(data)),
            _step;

        try {
          var _loop = function _loop() {
            var dataKey = _step.value;
            Object.defineProperty(_this, dataKey, {
              get: function get() {
                return data[dataKey];
              },
              set: function set(val) {
                data[dataKey] = val;
              }
            });
          };

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop();
          } // new Watcher(data)

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "$mount",
      value: function $mount(el) {
        var vm = this;
        el = document.querySelector(el);
        vm.$el = el;

        if (!vm.$options.render) {
          var template = vm.$options.template;

          if (!template) {
            // 外部包裹el
            console.log(el.outterHTML);
          }
        }
      }
    }]);

    return _default;
  }();

  return _default;

})();
