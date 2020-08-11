(function (win) {
    var def = {
        optionsFormSelect: '.options-formselect',
        txFormSelect: '.tx-formselect',
        txFormSelectValue: '.tx-formselect span',
        optionFormSelect: '.option-formselect',
        active: 'formselect-active',
        dataValue: 'data-value',
    }

    /*
    示例：
    $('#boxFormselect').initFormSelect({
            list: list: [
                { label: '全部道路等级', value: '' },
                { label: '国道', value: '42000' },
                { label: '省道', value: '51000' },
                { label: '高速公路', value: '41000' },
                { label: '城市主干路', value: '44000' }
            ],
            value: '',
            width: '142px',
            callback: function (value, obj) {
                设置值
                // this.value = value
            }
        })
    $('[data-id="formselect"]').initFormSelect(
        {
            list: [
                { label: '全部道路等级', value: '' },
                { label: '国道', value: '42000' },
                { label: '省道', value: '51000' },
                { label: '高速公路', value: '41000' },
                { label: '城市主干路', value: '44000' }
            ],
            width: '150px',
            height: '28px',
            value: '',
            callback: function (value, obj) {
                console.log(
                    value,
                    obj
                )
            }
        }
    )
    */
    function Formselect(options) {
        this.show = false
        this.label = ''
        this.value = ''
        this.width = '150px'
        this.height = '28px'
        $.extend(this, options)
        if (!this.list || !this.list.length) {
            return
        }
        this.init()
        this.binds()
    }

    Formselect.prototype = {
        constructor: Formselect,

        findValue: function () {
        },
        findLabel: function () {
            var that = this
            var r = ''
            that.list.forEach(o => {
                if (that.value == o.value) {
                    r = o.label
                }
            })
            return r
        },
        init: function () {
            var that = this
            var list = []
            var active = ''
            that.list.forEach(o => {
                active = that.value == o.value ? def.active : ''
                list.push(
                    '<div class="option-formselect ' + active + '" data-value="' + o.value + '">' + o.label + '</div>'
                )
            });
            that.$container.html(
                '<div class="box-formselect" style="width:' + this.width + ';">' +
                '    <div class="tx-formselect" style="height:' + this.height + ';line-height:' + this.height + '">' +
                '        <span>' + that.findLabel() + '</span>' +
                '    </div>' +
                '    <div class="options-formselect">' +
                list.join('') +
                '    </div>' +
                '</div>'
            )
        },
        binds: function () {
            var that = this
            var box = that.$container.find(def.optionsFormSelect)
            var item = that.$container.find(def.optionFormSelect)

            that.$container.find(def.txFormSelect).click(function () {
                if (that.show) {
                    that.show = false
                    box.hide()
                } else {
                    box.show()
                    that.show = true
                }
            })
            var _item
            item.click(function () {
                _item = $(this)
                item.removeClass(def.active)
                _item.addClass(def.active)
                box.hide()
                that.show = false
                that.label = _item.html()
                that.value = _item.attr(def.dataValue)
                that.$container.find(def.txFormSelectValue).html(that.label)
                that.callback && that.callback(that.value, that)
            })
        }
    }

    $.fn.initFormSelect = function (options) {
        options = options || {}
        options.$container = this
        return new Formselect(options)
    }
})(window)
