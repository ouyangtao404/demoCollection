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
            selectBoxs: [],
            nameSpace: 'wd-selectTree'
        }, o);

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
        self._createSelectHtml(param.data, 0, self.param.selected);
    },
    //递归渲染到最深处
    _createSelectHtml: function(arr, depth, selectedObj) {
        if(!selectedObj) {
            console.error('you must input selectedObj');
            return;
        }
        var self = this;
        var param = self.param;
        var selectBox = param.selectBoxs.eq(depth);
        selectBox.html(self._getOneSelectHtml(arr, depth, selectedObj));
        selectBox.find('select').prop('name', selectBox.attr('data-name'));

        var nextArr = self._getNextArr(arr, depth, selectedObj);
        var nextDepth = depth + 1;
        if(nextArr.length > 0) {
            self._createSelectHtml(nextArr, nextDepth, selectedObj);
        }
    },
    _getNextArr: function(arr, depth, selectedObj) {
        var self = this;
        var rst = [];
        var isExist = false;

        var selectedValue = self._getSelectedValue(depth, selectedObj);
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
    _getOneSelectHtml: function(arr, depth, selectedObj) {
        var self = this;
        var str = '';
        var selectedValue = self._getSelectedValue(depth, selectedObj);
        if(arr.length == 0) {
            return str;
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
    _getSelectedValue: function(depth, selectedObj) {
        if(!selectedObj) {
            console.error('you must input selectedObj');
            return;
        }
        var selectedOne = selectedObj[depth];
        if(selectedOne) {
            return selectedOne.value;
        }
        return null;
    },
    _bindEvent: function() {
        var self = this;
        $('select', self.param.container).on('change', function(e) {
            var tar = $(e.target);
            self._updateNextSelect(tar);
        });
    },
    _updateNextSelect: function(tar) {//还有备用方案，从头开始渲染,坏处是性能不好
        var self = this;
        var tarName = tar.prop('name');
        var tarValue = tar.val();
        var tarDepth = tar.parents('.select-box').attr('data-depth');

        var targetArr = self._getTargetArr(tar);

        var selectedObj = [];
        self._createSelectHtml(targetArr, tarDepth, selectedObj);
        console.log('getTargetArr');
    },
    _getTargetArr: function(tar) {
        var rst = this.param.data[1].children[1].children[0].children;
        console.log(rst);
        //var tarValue = tar.val();
        //var data = self.param.data;
        //var rst = [];
        //var tarSelectBox = tar.parents('.select-box');
        ////self.param.selectBoxs.each(function(i, boxItem) {
        ////    var boxItemValue = $(boxItem).find('select').val();
        ////    //下拉框盒子,某一个
        ////    //遍历对应arr分支
        ////
        ////    if(tarSelectBox[0] === item) {return false;}
        ////});
        //
        //var depthCount = 0;
        //var rst = getNextDot(self.param.data);
        //function getNextDot(arr) {
        //    var currentDepthTargetValue = self.param.selectBoxs.eq(depthCount).find('select').val();
        //    var targetDotArr;
        //
        //    if(arr) {
        //        $.each(arr, function(i, item) {
        //            if(item.value == currentDepthTargetValue) {
        //                console.log(item.value);
        //                if(arr[i].children) {
        //                    targetDotArr = arr[i].children;
        //                }
        //                return false;
        //            }
        //        });
        //    }
        //
        //    console.log('targetDotArr');
        //    console.log(targetDotArr);
        //    if(self.param.selectBoxs.eq(depthCount).find('select') == tarSelectBox) {
        //        depthCount ++;
        //        //递归
        //        return getNextDot(targetDotArr);
        //    }
        //    console.log('递归出来了');
        //    return targetDotArr;
        //}

        return rst;
    }
});