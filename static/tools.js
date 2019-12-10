/*
typeof Symbol() -> symbol
toString.call(Symbol()) -> '[object Object]'
toString未使用call方法，this始终指向Object: toString(1)->"[object Object]"
toString.call(document.getElementsByTagName('body'))->"[object HTMLCollection]"
*/
var toString = Object.prototype.toString;

/**
 * 获取数据类型
 * @param {Any} val
 * @returns {String}
 */
function toType(val) {
  var r = !!val ? toString.call(val).replace(/\[|\]/g, '') : '';
  r = !!r ? r.split(/\s/)[1] : '';
  r = r.substring(0, 1).toLowerCase() + r.substring(1);
  return r;
}

/**
 * 判断有值
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isVal(val) {
  return !(val === undefined || val === null);
}

/**
 * 判断布尔
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isBoolean(val) {
  return toString.call(val) === '[object Boolean]';
}

/**
 * 判断字符串
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isString(val) {
  return toString.call(val) === '[object String]';
}

/**
 * 判断数字
 * isNaN 非数字，返回true
 * toString.call(NaN) : number
 * typeof NaN : number
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isNumber(val) {
  return !isNaN(val);
}

/**
 * 判断数组
 * 类数组对象也要算在其中
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]' || (toType(val) === 'object' && val.length >= 0);
}

/**
 * 判断对象
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isObject(val) {
  return toString.call(val) === '[object Object]';
}

/**
 * 判断日期对象
 * @param {Object} val
 * @returns {Boolean} 是true，否false
 */
function isDate() {
  return toString.call(val) === '[object Date]';
}

/**
 * 判断函数
 * @param {Object} val
 * @returns {Boolean} 是true，否false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * 判断window
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isWindow(val) {
  return toString.call(val) === '[object Window]';
}

/**
 * 判断 document
 * @param {Any} ob
 * @returns {Boolean} 是true，否false
 */
function isDocument(ob) {
  return toString.call(ob) === "[object HTMLDocument]";
}

/**
 * 判断dom节点
 * @param {Any} val
 * @returns {Boolean} 是true，否false
 */
function isDom(val) {
  return typeof HTMLElement !== 'undefined' ? val instanceof HTMLElement
    : (typeof val === 'object' && val.nodeType);
}

/**
 * 判断空对象
 * @param {Object} ob
 * @returns {Boolean} 非空返回false
 */
function isEmptyObject(ob) {
  for (var k in ob) {
    return false;
  }
  return true;
}

/**
 * 检查是否时可枚举属性
 * @param {Object} ob
 * @param {String} key
 * @returns {Boolean} 是true，否false
 */
function hasOwn(ob, key) {
  if (Object.prototype.hasOwnProperty) {
    return Object.prototype.hasOwnProperty.call(ob, key);
  } else {
    return ob[key];
  }
}

/**
 * 随机字符串
 * @param {Number} range
 * @returns {String}
 */
function anystr(range) {
  range = range || 8;
  var r = [];
  var letter = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var length = letter.length;
  for (var i = 0; i < range; i++) {
    r.push(letter.charAt(
      Math.floor(Math.random() * length)
    ));
  }
  return r.join('');
}

/**
 * 模板字符串替换
 * @param {String} val
 * @returns {String}
 */
function format(val) {
  var i = 0;
  var args = arguments;
  var length = args.length;
  return String(val).replace(/%[sdj]/g, function (x) {
    if (i >= length) {
      return x;
    }
    i++;
    switch (x) {
      case '%s':
        return String(args[i]);
      case '%d':
        return Number(args[i]);
      case '%j':
        return jsonStr(args[i]);
      default:
        return x;
    }
  });
}

/**
 * 去掉前后空格
 * @param {String} val
 * @returns {String}
 */
function trim(val) {
  return String(val).replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * 去掉前空格
 * @param {String} val
 * @returns {String}
 */
function trimStart(val) {
  return String(val).replace(/^\s*/, '');
}
/**
 * 去掉后空格
 * @param {String} val
 * @returns {String}
 */
function trimEnd(val) {
  return String(val).replace(/\s*$/, '');
}

/**
 * 查找指定字符串
 * String(ob)：将其转换为字符串类
 * @param {any} ob
 * @param {any} val
 * @returns {String}
 */
function finder(ob, val) {
  if (!ob || !val) {
    return false;
  }
  return new RegExp(',' + val + ',').test(',' + String(ob) + ',');
}

/**
 * 单词首字母大写
 * @param {String} val
 * @returns {String}
 */
function firstCapital(val) {
  return String(val).toLowerCase().replace(/( |^)[a-z]/g, function (str) {
    return str.toUpperCase();
  });
}

/**
 * 中文/字符串等进行Unicode编码
 * @param {String} val
 * @returns {String}
 */
function toUnicode(val) {
  val = String(val);
  var r = [];
  for (var i = 0, length = val.length; i < length; i++) {
    // charCodeAt() 方法返回0到65535之间的整数，表示给定索引处的UTF-16代码单元
    // slice(-4): 编码后字符不满足4位的用0填充，并截取最后四位
    r.push(
      ("00" + val.charCodeAt(i).toString(16)).slice(-4)
    );
  }
  return "\\u" + r.join("\\u");
}

/**
 * 字符串解码/还原字符串
 * @param {String} val
 * @returns {String}
 */
function unicodeTo(val) {
  return !val ? val : unescape(val.replace(/\\/g, "%"));
}

/**
 * 可以用来将一个类数组（Array-like）对象/集合转换成一个新数组
 * @param {Any} val
 * @returns {Array}
 */
function toArray(val) {
  return !val ? [] : [].slice.call(val);
}

/**
 * 转换为json字符串
 * @param {Object} val
 * @returns {String}
 */
function jsonStr(val) {
  return (isObject(val) || isArray(val)) ? JSON.stringify(val) : val;
}

/**
 * 转换为json对象
 * 正则方法处理有弊端，引号的不确定性（s = s.replace(/'/g, '"')），还是改用eval
 * @param {String} val
 * @returns {Object}
 */
function parseJson(val) {
  if (!isString(val)) {
    return val;
  }
  try {
    val = JSON.parse(val);
  } catch (e) {
    // eval也有处理不了字符串
    try {
      val = eval('(' + val + ')');
    } catch (e) { }
  }
  return val;
}

/**
 * json对象转参数字符串
 * @param {Object} ob
 * @returns {String}
 */
function jsonToParam(ob) {
  if (!isObject(ob)) {
    return ob;
  }
  var r = [];
  for (var k in ob) {
    r.push(k + '=' + jsonStr(ob[k]));
  }
  return r.sort().join('&');
}

/**
 * 参数字符串转json对象
 * @param {String} ob
 * @returns {Object}
 */
function paramToJson(ob) {
  if (!isString(ob)) {
    return ob;
  }
  ob = ob.split('&');
  var r = {};
  for (var i = 0, str = '', length = ob.length; i < length; i++) {
    str = ob[i];
    if (!str) {
      continue;
    }
    str = str.split('=');
    r[str[0]] = str[1];
  }
  return r;
}

/**
 * 循环
 * @param {Array|Object} ob
 * @param {Function} cb
 */
function each(ob, cb) {
  if (!cb) {
    return;
  }
  var o;
  if (isArray(ob)) {
    var length = ob.length;
    for (var i = 0; i < length; i++) {
      o = ob[i];
      cb.call(o, o, i, ob);
    }
  } else if (isObject(ob)) {
    for (var i in ob) {
      o = ob[i];
      cb.call(o, o, i, ob);
    }
  }
  return ob;
}

/**
 * 合并、扩展、深/浅拷贝多个对象
 * @param {arguments} [Boolean,Object,...]；第一个参数为true时，表示深度合并、深拷贝；否则浅度合并、浅拷贝（后者与Object.assign同理）；
 * @returns {Object}
 * @eg extend(true,{},...); extend({},{},...)
 */
function extend() {
  var args = arguments || [];
  var isDeep = false;
  var target = args[0];
  var i = 1;
  var length = args.length;
  if (target === true) {
    isDeep = true;
    target = args[1];
    i = 2;
  }
  target = Object(target);
  for (; i < length; i++) {
    cloneObject(target, args[i], isDeep);
  }

  function cloneObject(to, from, deep) {
    var child;
    to = to || {};
    for (var k in from) {
      child = from[k];
      if (!isVal(child) || k === '__proto__') {
        continue;
      }
      if (deep && !isDom(child)) {
        if (isObject(child)) {
          to[k] = cloneObject(to[k], child, deep);
        } else if (isArray(child)) {
          to[k] = cloneArray(to[k], child, deep);
        } else {
          to[k] = child;
        }
      } else {
        to[k] = child;
      }
    }
    return to;
  }

  function cloneArray(array, list, deep) {
    if (!isArray(array)) {
      array = [];
    }
    if (!isArray(list)) {
      list = [];
    }
    var to;
    var from;
    var r = [];
    for (var i = 0; i < list.length; i++) {
      to = array[i];
      from = list[i];
      if (isObject(to) || isObject(from)) {
        r.push(cloneObject(to || {}, from || {}, deep));
      } else if (isArray(to) || isArray(from)) {
        r.push(cloneArray(to || [], from || [], deep));
      } else if (isVal(from)) {
        r.push(from);
      }
    }
    return r.concat(array.slice(list.length));
  }

  return target;
}

/**
 * 获取url中的参数
 * @param {String} name 参数名字
 * @param {String} url url地址
 * @returns {String}
 */
function urlParam(name, url) {
  var str;
  if (!url) {
    str = decodeURIComponent(location.search).substr(1);
  } else {
    str = decodeURIComponent(url.split("?"))[1];
  }
  var reg = new RegExp('&\\s*' + name + '\\s*=\\s*([^&]*)&', 'gi');
  var val = reg.exec('&' + str + '&');
  return !val ? '' : trim(val[1]);
}

/**
* 会话缓存
* @param {String} name 键
* @param {any} val 值
* @returns {null|String} 值
*/
function sessionCache(name, val) {
  return !val ? sessionStorage.getItem(name) : sessionStorage.setItem(name, jsonStr(val));
}

/**
* 本地储存
* @param {String} name 键
* @param {any} val 值
* @returns {null|String} 值
*/
function localCache(name, val) {
  return !val ? localStorage.getItem(name) : localStorage.setItem(name, jsonStr(val));
}
