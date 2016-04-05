;(function() {
    var con = $('.advice');

    var url = 'http://appdev.yunos.com/submitFeedback.htm';


    var textCon = $('.J_val', con);
    textCon.on('change', function(e) {
        alert('change')
    });
    textCon.on('keydown', function(e) {
        alert('keyDown')
    });
    textCon.on('keyup', function(e) {
        alert('keyUp')
    });

    $('.verifyCodeImg', con).on('click', function(e) {
        updateVerifyCode();
    });
    $('.J_sbt', con).on('click', function(e) {
        var contentBox = $('.J_val', con);
        var content = contentBox.val();
        if(content == '') {
            flicker($('.advice-box', con), function() {
                contentBox[0].focus();
            });
            return;
        }
        //请求
        $.ajaxJSONP({
            url: url,
            data: {
                content     : content,
                topicId     : con.attr('data-topicId'),
                verifyCode  : $('.J_code', con).val()
            },
            success: function(data, status) {
                console.log(data);
                //提示结果
                if(data.success) {
                    _alert('发表成功');
                    resetForm();
                    return;
                }
                _alert('发表失败，请稍后再试，原因：' + data.msg);
            },
            error: function() {
                _alert('发表失败，请稍后再试');
            }
        });
    });

    function updateVerifyCode() {
        var tar = $('.verifyCodeImg', con);
        tar.prop('src', tar.prop('src').split('?')[0] + '?t=' + (new Date() - 0));
    }
    function resetForm() {
        updateVerifyCode();
        $('.J_val', con).val('');
        $('.J_code', con).val('');
    }
    function _alert(str) {
        new _Alert({
            content: str
        }).show();
    }

})();