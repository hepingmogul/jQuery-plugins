/**
 * 绑定事件封装
 * 支持单事件-单元素、多事件-多元素的绑定；
 * 支持单事件-单元素、多事件-多元素的卸载事件
 * 支持事件代理、事件委托（只支持单事件-单元素）
 * 支持原生api参数的传递
 * 测试案例：test\kevent\index.html
 */
var kevent = (function () {
  /**
   * @link https://www.w3school.com.cn/jsref/dom_obj_event.asp
   * @keypress 如果只按一次键盘（输入一个值），则事件获取值时为空 
   */
  var _events = [
    'blur',
    'change',
    'click',
    'focus',

    'keydown',
    'keyup',

    'keypress',

    'mousedown',
    'mouseup',

    'mouseover',
    'mouseout',

    'mousemove',

    'touchstart',
    'touchmove',
    'touchend',
  ];

  var kEvent = function () { };

  kEvent.prototype = {
    constructor: kEvent,
    /**
     * 添加事件
     * @param {String} types 事件
     * @param {HTMLElement} elems 元素
     * @param {Function} fn 回调
     * @param {Boolean} useCapture 
     * 1.useCapture为true，则侦听器只在捕获阶段处理事件，从父级逐级向下执行对应函数
     * 2.useCapture为false，则侦听器只在目标或冒泡阶段处理事件，从子级逐级上执行对应函数
     */
    add: function (types, elems, fn, useCapture) {
      if (typeof types !== 'string' || !elems || typeof elems !== 'object') {
        return;
      }
      if (!elems.length || elems.nodeName === 'SELECT') {
        elems = [elems];
      }
      var i, elem;
      var j, type;
      // 多个事件通过一个空格分隔
      types = types.split(' ');

      for (i = 0; i < elems.length; i++) {
        elem = elems[i];
        if (!elem) {
          continue;
        }
        for (j = 0; j < types.length; j++) {
          type = types[j];
          if (!type) {
            continue;
          }
          if (elem.addEventListener) {
            elem.addEventListener(type, fn, !!useCapture);
          }
          else if (elem.attachEvent) {
            elem.attachEvent('on' + type, fn);
          }
        }
      }
    },

    /**
     * 移除事件，事件、回调、useCapture必须与绑定时一致才能移除事件
     * @param {String} types 
     * @param {HTMLElement} elems 
     * @param {Function} fn 
     * @param {Boolean} useCapture 
     */
    remove: function (types, elems, fn, useCapture) {
      if (typeof types !== 'string' || !elems || typeof elems !== 'object') {
        return;
      }
      if (!elems.length) {
        elems = [elems];
      }
      var i, elem;
      var j, type;
      // 多个事件通过一个空格分隔
      types = types.split(' ');

      for (i = 0; i < elems.length; i++) {
        elem = elems[i];
        if (!elem) {
          continue;
        }
        for (j = 0; j < types.length; j++) {
          type = types[j];
          if (!type) {
            continue;
          }
          if (elem.removeEventListener) {
            elem.removeEventListener(type, fn, !!useCapture);
          }
          else if (elem.detachEvent) {
            elem.detachEvent('on' + type, fn);
          }
        }
      }
    },

    /**
     * 事件代理、事件委托
     * @param {String} type 事件类型
     * @param {HTMLElement} elem 元素
     * @param {String} rule 规则，支持nodeName和className
     * @param {Function} fn 回调
     * @param {Boolean} useCapture 
     */
    agent: function (type, elem, rule, fn, useCapture) {
      var that = this;
      if (typeof type !== 'string' || !elem || typeof elem !== 'object' || typeof rule !== 'string') {
        return;
      }
      var node;
      var nodeName;

      that.add.apply(that, [type, elem, function (e) {
        e = e || window.event;
        node = getNode(e.target || e.srcElement, rule);
        if (node) {
          fn && fn.call(node, e);
        }
      }, useCapture]);

      function getNode(node, rule) {
        if (!node || !rule) {
          return;
        }
        nodeName = node.nodeName && node.nodeName.toLowerCase();
        if (nodeName === rule.toLowerCase() || new RegExp(',' + rule + ',').test(',' + String(node.className.split(/\s+/g)) + ',')) {
          return node;
        } else {
          if (nodeName === 'body') {
            return null;
          }
          return getNode(node.parentNode, rule);
        }
      }
    },

    /**
     * 阻止捕获和冒泡阶段中当前事件的进一步传播
     * @param {HTMLElement} elem 
     */
    stop: function (elem) {
      if (!elem) {
        return;
      }
      elem.cancelBubble = true;
      if (!!elem.stopPropagation) {
        elem.stopPropagation();
      }
    },

    /**
     * 取消事件的默认动作
     * @param {HTMLElement} elem 
     */
    prevent: function (elem) {
      if (!elem) {
        return;
      }
      if (!!elem.preventDefault) {
        elem.preventDefault();
      } else {
        elem.returnValue = false;
      }
    },

  };

  (function () {
    for (var i = 0, name = null; i < _events.length; i++) {
      name = _events[i];
      if (!name) {
        continue;
      }
      (function (name) {
        kEvent.prototype[name] = function (elem, fn, useCapture) {
          this.add.apply(this, [name, elem, fn, useCapture]);
        };

        kEvent.prototype['un' + name] = function (elem, fn, useCapture) {
          this.remove.apply(this, [name, elem, fn, useCapture]);
        };
      })(name);
    }
  })();
  return new kEvent();
})();
