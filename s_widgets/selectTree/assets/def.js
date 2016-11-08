/**
 * 下拉框展示树形结构数据
 * @param o
 * @returns {SelectTree}
 * @constructor
 * 只展示有name的层级　由参数name_list控制
 */
function SelectTree(o) {
    this.init(o);
    return this;
}
$.extend(SelectTree.prototype, {
    init: function(o) {
       this._paramInit(o);
       this._createStructure();
       this._bindEvent();
    },
    _paramInit: function(o) {
        this.param = $.extend({
            blankOption: {
                display : '请选择',
                value   : ''
            },
            name_list: ['name1', 'name2', 'name3', 'name4'],
            selectBoxs: [],
            nameSpace: 'wd-selectTree'
        }, o);
        this.param.origin_selected = this.param.selected;
        if(this.param.blankOption) {
            this.param.blankOptionStr = '<option value="'+ this.param.blankOption.value +'">'+ this.param.blankOption.display +'</option>';
        }
    },
    _createStructure: function() {
        var self = this;
        var param = self.param;
        var con = param.container;
        con.addClass(param.nameSpace);

        //生成多个下拉框的容器，并存入param
        var str = '';
        param.name_list.forEach(function(item, i) {
            str += '<div class="select-box" data-name="'+ item +'" data-depth="'+ i +'" style="display:inline-block;border:1px solid red;"></div>';
        });
        con.html(str);
        param.selectBoxs = $('.select-box', con);

        //渲染结构
        self._createSelectHtml(param.data, 0);
    },
    //递归渲染到最深处
    _createSelectHtml: function(arr, depth) {
        var self = this;
        var param = self.param;
        var selectBox = param.selectBoxs.eq(depth);
        selectBox.html(self._getOneSelectHtml(arr, depth));
        self._bindSelectedEvent(selectBox);
        selectBox.find('select').prop('name', selectBox.attr('data-name'));

        var nextArr = self._getNextArr(arr, depth);
        var nextDepth = depth + 1;
        if(nextDepth <= self.param.name_list.length) {
            console.log(nextArr);
            self._createSelectHtml(nextArr, nextDepth);
        }
    },
    _bindSelectedEvent: function (selectBox) {
        var self = this;
        $('select', selectBox).on('change', function(e) {
            var tar = $(e.target);
            self._updateNextSelect(tar);
        });
    },
    _getNextArr: function(arr, depth) {
        var self = this;
        var rst = [];
        var isExist = false;

        var selectedValue = self._getSelectedValue(depth);
        arr.forEach(function(item) {
            if(selectedValue == item.value) {
                isExist = true;
                if(item.children) {
                    rst = item.children;
                }
            }
        });
        if(!isExist && selectedValue) {
            console.warn('the selected value:'+ selectedValue +' is not exist!');
        }
        return rst;
    },
    _getOneSelectHtml: function(arr, depth) {
        var self = this;
        var str = '';
        var selectedValue = self._getSelectedValue(depth);
        if(arr.length == 0) {
            return str;
            //arr = [];
            //console.log('mark');
        }
        arr.forEach(function(item) {
            if(selectedValue == item.value) {
                str += '<option value='+ item.value +' selected>'+ item.display +'</option>';
            } else {
                str += '<option value='+ item.value +'>'+ item.display +'</option>';
            }
        });
        return '<select>'+ self.param.blankOptionStr + str + '</select>';
    },
    _getSelectedValue: function(depth) {
        var selectedOne = this.param.selected[depth];
        if(selectedOne) {
            return selectedOne.value;
        }
        return null;
    },
    _bindEvent: function() {
        var self = this;
    },
    _updateNextSelect: function(tar) {//还有备用方案，从头开始渲染,坏处是性能不好
        var self = this;
        var tarName = tar.prop('name');
        var tarValue = tar.val();
        var tarDepth = tar.parents('.select-box').attr('data-depth');
        tarDepth = parseInt(tarDepth, 10);
        //var targetArr = self._getTargetArr(tar);
        //todo　更新 selected
        self.param.selected[tarDepth] = {
            value: tarValue
        };

        var slt = self.param.selected;
        console.log('splice====start====');
        console.log(slt);
        slt.splice(tarDepth + 1);
        console.log(slt);
        console.log('splice====end====');

        //todo 数组末尾矫正
        self._createSelectHtml(self.param.data, 0);
    }
});