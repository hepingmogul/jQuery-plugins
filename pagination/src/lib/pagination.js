(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global, true);
  } else if (typeof define === "function" && define.amd) {
    define(function () {
      return factory(global, true);
    });
  } else {
    factory(global);
  }
}(typeof window !== "undefined" ? window : this, function (wow, bool) {
  "use strict";
  var config = {
    container: null,
    // 默认显示5个可选页面
    shows: 5,
    // 总条数
    total: 0,
    // 总页数
    pages: 0,
    // 每页条数
    skip: 10,
    // 当前第几页
    count: 1,
    // 回调
    callback: null,
    isCfg: ["container", "total", "pages", "skip", "callback"]
  };

  var QS = function (selector) {
    var elems = document.querySelectorAll(selector);
    return elems ? elems.length === 1 ? elems[0] : elems : null;
  };

  var extend = function (obj) {
    var newobj = JSON.parse(JSON.stringify(config));
    for (var i in obj) {
      if (obj[i]) { newobj[i] = obj[i]; }
    }
    return newobj;
  };

  var bindEvent = function (elems, callback) {
    if (!elems.length) { elems = [elems]; }

    for (var i = 0, el = null, l = elems.length; i < l; i++) {
      el = elems[i];
      if (!el) { continue; }
      el.attachEvent ? el.attachEvent('onclick', callback) :
        el.addEventListener('click', callback, false);
    }
  };

  var Paginations = function (options) {
    var that = this;
    that.cfg = extend(options);
    that.container = QS(that.cfg.container);

    if (!that.isCfg(that.cfg)) { return; }

    that.views();
    that.handleEvent();
  };

  Paginations.prototype.isCfg = function (data) {
    if (!data) { return false; }

    var array = this.cfg.isCfg;
    for (var i = 0, l = array.length; i < l; i++) {
      if (!data[array[i]]) {
        console.warn(array[i] + ' is not defined!');
        return false;
      }
    }
    return true;
  };

  Paginations.prototype.views = function () {
    var that = this;
    var str = [];
    var pages = parseInt(that.cfg.pages);
    var count = parseInt(that.cfg.count);
    var shows = parseInt(that.cfg.shows);

    var fristDisable = count === 1 ? 'disable' : 'jsPaginationBtn';
    var lastDisable = count === pages ? 'disable' : 'jsPaginationBtn';

    var omit = '<span class="kui-pagination__btn" data-id="-5">...</span>';
    var firstHtml = '<span class="kui-pagination__btn jsPaginationBtn" data-id="1">1</span>';
    var lastHtml = '<span class="kui-pagination__btn jsPaginationBtn" data-id="' + pages + '">' + pages + '</span>';

    str.push('<div class="kui-pagination"><div class="kui-pagination__cells"><span class="kui-pagination__btn ' + fristDisable + '" data-id="-1">首页</span>' +
      '<span class="kui-pagination__btn ' + fristDisable + '" data-id="-2">上一页</span>');

    if (pages > 6) {
      // 总页数大于6
      if (count < shows) {
        // 当前页数小于5时显示省略号
        str.push(that.htmlFrag(0, shows, count));
        str.push(omit);
        str.push(lastHtml);
      } else {
        if (count < pages - 3) {
          // 判断页码在末尾的时候
          str.push(that.htmlFrag(count - 3, count + 2, count));
          str.push(omit);
          str.push(lastHtml);
        } else {
          // 页码在中间部分时候
          str.push(firstHtml);
          str.push(omit);
          str.push(that.htmlFrag(pages - 4, pages, count));
        }
      }
    } else {
      // 总页数小于6
      str.push(that.htmlFrag(0, pages, count));
    }
    str.push('<span class="kui-pagination__btn ' + lastDisable + '" data-id="-3">下一页</span>' +
      '<span class="kui-pagination__btn ' + lastDisable + '" data-id="-4">尾页</span></div></div>');

    that.container.innerHTML = str.join('');
  };

  Paginations.prototype.htmlFrag = function (i, pages, count) {
    var str = [];
    i = i || 0;
    for (i; i < pages; i++) {
      if (count === i + 1) {
        str.push('<span class="kui-pagination__btn active" data-id="' + (i + 1) + '">' + (i + 1) + '</span>');
      } else {
        str.push('<span class="kui-pagination__btn jsPaginationBtn" data-id="' + (i + 1) + '">' + (i + 1) + '</span>');
      }
    }
    return str.join('');
  };

  Paginations.prototype.handleEvent = function () {
    var that = this;
    var callback = that.cfg.callback;
    var pages = parseInt(that.cfg.pages);
    var count = parseInt(that.cfg.count);
    var skip = parseInt(that.cfg.skip);
    var nums = 0;

    bindEvent(
      QS('#' + that.container.id + ' .jsPaginationBtn')
      , function () {
        var idx = parseInt(this.getAttribute('data-id'));

        if (idx === 1 || idx === -1) {
          count = 1;
        } else if (idx === -4 || idx === pages) {
          count = pages;
        } else if (idx === -2) {
          count = count <= 1 ? 1 : count - 1;
        } else if (idx === -3) {
          count = count === pages ? pages : count + 1;
        } else {
          count = idx;
        }

        that.cfg.count = count;
        nums = count;
        if (nums <= 1) {
          nums = 0;
        } else if (nums >= pages) {
          nums = (pages - 1) * skip;
        } else {
          nums = (nums - 1) * skip;
        }

        that.views();
        that.handleEvent();
        callback && callback.call(that, count, nums);
      });
  };

  // 加载样式
  (function () {
    var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
    var path = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);

    //如果合并方式，则需要单独引入 pagination.css
    if (script.getAttribute('merge')) return;
    document.head.appendChild(function () {
      var link = document.createElement('link');
      link.href = path + 'pagination.min.css';
      link.type = 'text/css';
      link.rel = 'styleSheet'
      link.id = 'paginationcss';
      return link;
    }());
  })();

  wow.pagination = {
    version: 1,
    open: function (options) {
      return new Paginations(options);
    }
  }
}));