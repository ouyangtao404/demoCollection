/**
 * 多选下拉框
 * @param o
 * @returns {MultiSelect}
 * @constructor
 *
 * new MultiSelect({
        data : [
            {
                "display" : "选1",
                "value"   : "值1"
            }, {
                "display" : "选2",
                "value"   : "值2"
            }, {
                "display" : "选3",
                "value"   : "值3"
            }, {
                "display" : "选4",
                "value"   : "值4"
            }, {
                "display" : "选5",
                "value"   : "值5"
            }, {
                "display" : "选6",
                "value"   : "值6"
            }, {
                "display" : "选7",
                "value"   : "值7"
            }
        ],
        name         :'name_test',
        selected     :['值1', '值2', '值3'],
        container    :$('.container')
    });
 */

function MultiSelect(o) {
    this.init(o);
    return this;
}
$.extend(MultiSelect.prototype, {
    init: function(o) {
        this._paramInit(o);
        this._createStructure();
        this._bindEvent();
        return this;
    },
    _paramInit: function(o) {
        this.param = $.extend({

        }, o);

        var value2display = {};
        o.data.forEach(function(item) {
            value2display[item.value] = item.display;
        });
        this.param.value2display = value2display;

        var selectedDisplay = [];
        o.selected.forEach(function(item, i) {
            selectedDisplay[i] = value2display[item];
        });
        this.param.selectedDisplay = selectedDisplay;
        return this;
    },
    _createStructure: function() {
        var self = this;
        var listStr = '';
        var param = this.param;
        var data = param.data;
        for(var i = 0, len = data.length; i < len; i ++) {
            listStr += '<li class="item">' +
                '<label>' +
                '<input type="checkbox" value="' + data[i].value + '" data-display="' + data[i].display + '"/>' +
                data[i].display +
                '</label>' +
                '</li>';
        }
        var str = '<span class="display">'+ this.param.selectedDisplay.join('、') +'</span>' +
            '<input class="J_value" type="hidden" name="nametest" value="'+ this.param.selected.join(',') +'"/>' +
            '<a href="javascript:void(0);" class="J_select">选择</a>' +
            '<div class="basic-box">' +
            '<div class="edit-box">' +
            '<div class="list">'+ listStr +'</div>' +
            '<div class="btn-box">' +
            '<a href="javascript:void(0);" class="J_cancel">取消</a>' +
            '<a href="javascript:void(0);" class="J_ok">确定</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        self.param.container.addClass('wd-multiSelect');
        self.param.container.html(str);
    },
    _bindEvent: function() {
        var self = this;
        var con = self.param.container;
        var editBox = con.find('.edit-box');
        con.delegate('.J_select', 'click', function(e) {
            editBox.show();
            self._renderShowDate();
        });
        con.delegate('.J_cancel', 'click', function(e) {
            editBox.hide();
        });
        con.delegate('.J_ok', 'click', function(e) {
            self._updateData();
            editBox.hide();
        });
    },
    _renderShowDate: function() {
        var self = this;
        var selected = self.param.selected;
        var con = self.param.container;

        con.find('input[type="checkbox"]').each(function(i, item) {
            item.checked = false;
        });
        for(var i = 0, len = selected.length; i < len; i++) {
            var item = selected[i];
            con.find('input[value="'+ item +'"]')[0].checked = true;
        }
    },
    _updateData: function() {
        var self = this;
        var con = self.param.container;
        var selected = [];
        var selectedDisplay = [];
        con.find('input[type="checkbox"]').each(function(i, item) {
            item = $(item);
            if(item[0].checked == true ) {
                selected.push(item.attr('value'));
                selectedDisplay.push(item.attr('data-display'));
            }
        });
        con.find('.display').html(selectedDisplay.join('、'));
        con.find('.J_value').val(selected.join(','));

        this.param.selected = selected;
        this.param.selectedDisplay = selectedDisplay;
    }
});