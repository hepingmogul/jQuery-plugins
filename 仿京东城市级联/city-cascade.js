var cityCascade = (function (context) {

  if (!("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
      get: function () {
        var self = this;
        function update(fn) {
          return function (value) {
            var cls = self.className.split(/\s+/g)
            var index = cls.indexOf(value);
            fn(cls, index, value);
            self.className = cls.join(" ");
          }
        }
        return {
          add: update(function (cls, index, value) {
            if (!~index) {
              cls.push(value);
            }
          }),
          remove: update(function (cls, index) {
            if (~index) {
              cls.splice(index, 1);
            }
          }),
          toggle: update(function (cls, index, value) {
            if (~index) {
              cls.splice(index, 1);
            } else {
              cls.push(value);
            }
          }),
          contains: function (value) {
            return !!~self.className.split(/\s+/g).indexOf(value);
          },
          item: function (i) {
            return self.className.split(/\s+/g)[i] || null;
          }
        };
      }
    });
  }
  function Doms(dom, selector) {
    var length = dom ? dom.length : 0;
    for (var i = 0; i < length; i++) {
      this[i] = dom[i];
    }
    this.length = length;
    this.selector = selector || '';
  }
  Doms.prototype = {
    constructor: Doms,
    addClass: function (className) {
      var that = this;
      if (!className) {
        return that;
      }
      className = className.split(' ');
      var i = 0, j = 0, length = that.length;
      for (; i < className.length; i++) {
        for (; j < length; j++) {
          !!that[j] && that[j].classList.add(className[i]);
        }
      }
      return that;
    },
    removeClass: function (className) {
      var that = this;
      if (!className) {
        return that;
      }
      className = className.split(' ');
      var i = 0, j = 0, length = that.length;
      for (; i < className.length; i++) {
        for (; j < length; j++) {
          !!that[j] && that[j].classList.remove(className[i]);
        }
      }
      return that;
    },
    hasClass: function (className) {
      var that = this;
      if (!className) {
        return false;
      }
      return !!that[0] ? that[0].classList.contains(className) : false;
    },
    toggleClass: function (className) {
      var that = this;
      if (!className) {
        return that;
      }
      className = className.split(' ');
      var i = 0, j = 0, length = that.length;
      for (; i < className.length; i++) {
        for (; j < length; j++) {
          !!that[j] && that[j].classList.toggle(className[i]);
        }
      }
      return that;
    },
    html: function (val) {
      var that = this;
      if (!val) {
        return !!that[0] && that[0].innerHTML;
      }
      for (var j = 0; j < that.length; j++) {
        !!that[j] && (that[j].innerHTML = val);
      }
      return that;
    },
    on: function (type, fn, useCapture) {
      var that = this;
      if (!type || !fn) {
        return;
      }
      for (var i = 0, el = null, l = that.length; i < l; i++) {
        el = that[i];
        if (!el) {
          continue;
        }
        if (el.addEventListener) {
          el.addEventListener(type, fn, !!useCapture);
        } else if (el.attachEvent) {
          el.attachEvent('on' + type, fn);
        }
      }
      return that;
    },
    off: function (type, fn, useCapture) {
      var that = this;
      if (!type || !fn) {
        return;
      }
      for (var i = 0, el = null, l = that.length; i < l; i++) {
        el = that[i];
        if (!el) {
          continue;
        }
        if (el.removeEventListener) {
          el.removeEventListener(type, fn, !!useCapture);
        } else if (el.detachEvent) {
          el.detachEvent('on' + type, fn);
        }
      }
      return that;
    },
    click: function (fn, useCapture) {
      return this.on('click', fn, useCapture);
    },
    change: function (fn, useCapture) {
      return this.on('change', fn, useCapture);
    }
  };
  function jdom(selector, context) {
    if (selector && typeof selector === "object") {
      if (selector.nodeName === 'SELECT' || selector.length === undefined || selector.length === null) {
        selector = [selector];
      }
    } else {
      selector = jdom.qsa(selector, context);
    }
    return new Doms(selector, context);
  };
  jdom.qsa = function (selector, context) {
    return (context || document).querySelectorAll(selector);
  };
  jdom.finder = function (ob, val) {
    return (!ob || !val) ? false : new RegExp(',' + val + ',').test(',' + String(ob) + ',');
  };
  jdom.extend = function () {
    var i = 1;
    var args = arguments || [];
    var clone = function (target, obj) {
      // 每个数据类型都是一个Function对象，运行(function(){}).constructor===Function便可以得到这个结论
      // obj.constructor.toString()===Array.toString() /// "function Array() { [native code] }"
      target = target || (obj.constructor === Array ? [] : {});
      for (var i in obj) {
        //如果值为对象，则进入递归，继续深度合并
        target[i] = (obj[i] && (obj[i].constructor === Object))
          ? clone(target[i], obj[i])
          : obj[i];
      }
      return target;
    }
    args[0] = typeof args[0] === 'object' ? args[0] : {};
    for (; i < args.length; i++) {
      if (typeof args[i] === 'object') {
        clone(args[0], args[i]);
      }
    }
    return args[0];
  };

  /**
   * 获取x、y的偏移量
   * @param {Elements} element 
   * @returns {Object}
   */
  function getOffset(element) {
    var r = {
      left: 0,
      top: 0
    };
    if (!element) {
      return r;
    }
    // 获取父级与位置有关的元素
    var p = element.offsetParent;
    //首先获取自己本身的左偏移和上偏移
    r.left = element.offsetLeft || 0;
    r.top = element.offsetTop || 0;
    //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
    while (p) {
      // ie8 累加父级参照物的边框
      /* if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
        r.left += p.clientLeft || 0;
        r.top += p.clientTop || 0;
      } */
      //累加父级参照物本身的偏移
      r.left += p.offsetLeft || 0;
      r.top += p.offsetTop || 0;
      p = p.offsetParent;
    }
    return r;
  }

  var Config = {
    index: 0,
    box: null,
    data: null,
    currentTab: 'province',
    input: null,
    province: {
      name: '',
      code: '110000',
      show: true,
      disabled: []
    },
    city: {
      name: '',
      code: '110100',
      show: true,
      disabled: []
    },
    area: {
      name: '',
      code: '110101',
      show: true,
      disabled: []
    },
    className: ['city-cascade', 'city-cascade-active']
  };
  //初始化时间
  var timer = null;
  var box = null;
  function CityCascade(options) {
    var that = this;
    Config.index++;
    jdom.extend(that, Config, options);
    if (!that.data || !that.input) {
      return;
    }
    var data = that.getSelectData();
    jdom.extend(that, data);
    that.setInput(data);

    jdom(that.input).on('mouseover', function () {
      if (timer) clearTimeout(timer);
      if (!box)
        that.init();
    });

    jdom(that.input).on('mouseout', function () {
      timer = setTimeout(function () {
        jdom('body')[0].removeChild(jdom('#' + that.className[0] + that.index)[0]);
        box = null;
      }, 500);
    });
  }

  CityCascade.prototype = {
    constructor: CityCascade,

    init: function () {
      var that = this;
      that.createBox();
      that.createView();
      that.addBox();
      that.bindTabs();
      that.bindTds();
      that.bindBox();
      that.position();
    },

    position: function () {
      var that = this;
      var posi = getOffset(that.input) || {};
      var el = jdom('#' + that.className[0] + that.index)[0];
      var h = that.input.innerHeight;
      el.style.top = posi.top + h;
      el.style.left = posi.left;
    },

    bindTabs: function () {
      var that = this;
      var id = that.className[0] + that.index;
      var tabs = jdom('#' + id + ' .city-cascade-tab>div');
      var self;
      var attrName;
      jdom(tabs).on('click', function () {
        self = this;
        jdom(tabs).removeClass(that.className[1]);
        jdom(self).addClass(that.className[1]);
        attrName = self.getAttribute('data-id');
        that.currentTab = attrName;
        if (attrName === 'province') {
          jdom('[data-id="' + id + '"]').html(that.viewProvince());
          that.bindTds();
        } else if (attrName === 'city') {
          jdom('[data-id="' + id + '"]').html(that.viewCity());
          that.bindTds();
        } else if (attrName === 'area') {
          jdom('[data-id="' + id + '"]').html(that.viewArea());
          that.bindTds();
        }
      });
    },

    bindTds: function () {
      var that = this;
      var id = that.className[0] + that.index;
      var tabs = jdom('#' + id + ' .city-cascade-tab>div');
      var self;
      var attrName;
      jdom(jdom('#' + id + ' table td')).on('click', function () {
        self = this;
        attrName = self.getAttribute('data-id');
        if (that.currentTab === 'province') {
          that.selectProvinceHandler(attrName);
        } else if (that.currentTab === 'city') {
          that.selectCityHandler(attrName);
        } else if (that.currentTab === 'area') {
          that.selectAreaHandler(attrName);
        }
      });
    },

    bindBox: function () {
      var that = this;
      jdom(that.box).on('mouseover', function () {
        if (timer) clearTimeout(timer);
        // that.init();
      });

      jdom(that.box).on('mouseout', function () {
        timer = setTimeout(function () {
          jdom('body')[0].removeChild(jdom('#' + that.className[0] + that.index)[0]);
          box = null;
        }, 500);
      });
    },

    selectProvinceHandler: function (currentId) {
      var that = this;
      that.province.code = currentId;
      var cfgProvince = that.province || {};
      var currProvince = that.data.provinces;
      var currProvinceName = currProvince[cfgProvince.code];
      that.setTabProvince(currProvinceName);
      var data = that.getSelectData();
      jdom.extend(that, data);
      that.setInput(data);
      that.callback && that.callback(that);
    },

    selectCityHandler: function (currentId) {
      var that = this;
      that.city.code = currentId;
      var currCity = that.data.cities[that.province.code];
      that.setTabCity(currCity[currentId]);
      var data = that.getSelectData();
      jdom.extend(that, data);
      that.setInput(data);
      that.callback && that.callback(that);
    },

    selectAreaHandler: function (currentId) {
      var that = this;
      that.area.code = currentId;
      var data = that.getSelectData();
      that.setTabArea(data.area.name);
      jdom.extend(that, data);
      that.setInput(data);
      that.callback && that.callback(that);
    },

    getSelectData: function () {
      var that = this;
      var r = {
        province: { name: '', code: that.province.code, },
        city: { name: '', code: that.city.code, },
        area: { name: '', code: that.area.code, },
      };
      r.province.name = that.data.provinces[r.province.code];
      r.city.name = that.data.cities[r.province.code][r.city.code];
      r.area.name = that.data.areas[r.city.code][r.area.code];
      return r;
    },

    setInput: function (data) {
      var that = this;
      that.input.innerHTML = that.input.value = data.province.name + '|' + data.city.name + '|' + data.area.name
    },

    setTabProvince: function (name) {
      var that = this;
      jdom('#' + that.className[0] + that.index + ' .city-cascade-tab>div[data-id="province"]').html(name);
      that.setTabCity('', that.province.code);
    },

    setTabCity: function (name, provinceId) {
      var that = this;
      if (!name) {
        var data = that.data.cities[provinceId]
        for (var k in data) {
          name = data[k];
          that.city.code = k;
          break;
        }
      }
      jdom('#' + that.className[0] + that.index + ' .city-cascade-tab>div[data-id="city"]').html(name);
      that.setTabArea('', that.city.code);
    },

    setTabArea: function (name, cityId) {
      var that = this;
      if (!name) {
        var data = that.data.areas[cityId];
        for (var k in data) {
          name = data[k];
          that.area.code = k;
          break;
        }
      }
      jdom('#' + that.className[0] + that.index + ' .city-cascade-tab>div[data-id="area"]').html(name);
    },

    createBox: function () {
      var that = this;
      var dv = document.createElement('div');
      dv.className = that.className[0];
      dv.id = that.className[0] + that.index;
      that.box = dv;
    },

    addBox: function () {
      var that = this;
      jdom('body')[0].appendChild(that.box);
    },

    createView: function () {
      var that = this;
      var r =
        that.viewTab() +
        '<table data-id="' + (that.className[0] + that.index) + '">' +
        that.viewProvince() +
        '</table>';
      jdom(that.box).html(r);
    },

    viewTab: function () {
      var that = this;
      var data = that.getSelectData();
      return '<div class="city-cascade-tab">' +
        ' <div class="city-cascade-active" data-id="province">' + data.province.name + '</div>' +
        ' <div data-id="city">' + data.city.name + '</div>' +
        ' <div data-id="area">' + data.area.name + '</div>' +
        '</div>';
    },

    viewProvince: function () {
      var that = this;
      var data = that.data.provinces || {};
      var current = that.province || {};
      var r = [];
      var i = 0;
      for (var k in data) {
        i++;
        if (!data.hasOwnProperty(k) || !data[k] || jdom.finder(current.disabled, k)) {
          continue;
        }
        if (i == 0) {
          r.push('<tr>');
        }
        r.push('<td data-id="' + k + '">' + data[k] + '</td>');
        if (i % 5 === 0) {
          r.push('</tr>');
          r.push('<tr>');
        }
      }
      return r.join('');
    },

    viewCity: function () {
      var that = this;
      var data = that.data.cities[that.province.code] || {};
      var current = that.city;
      var r = [];
      var i = 0;
      for (var k in data) {
        i++;
        if (!data.hasOwnProperty(k) || !data[k] || jdom.finder(current.disabled, k)) {
          continue;
        }
        if (i == 0) {
          r.push('<tr>');
        }
        r.push('<td data-id="' + k + '">' + data[k] + '</td>');
        if (i % 5 === 0) {
          r.push('</tr>');
          r.push('<tr>');
        }
      }

      return r.join('');
    },

    viewArea: function () {
      var that = this;
      var data = that.data.areas[that.city.code] || {};
      var current = that.area;
      var r = [];
      var i = 0;
      for (var k in data) {
        i++;
        if (!data.hasOwnProperty(k) || !data[k] || jdom.finder(current.disabled, k)) {
          continue;
        }
        if (i == 0) {
          r.push('<tr>');
        }
        r.push('<td data-id="' + k + '">' + data[k] + '</td>');
        if (i % 5 === 0) {
          r.push('</tr>');
          r.push('<tr>');
        }
      }
      return r.join('');
    }
  };

  return function (options) {
    return new CityCascade(options);
  };
})(window);
