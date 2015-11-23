
    Upload = function(config) {
        var s = this;
        this.config = config;
        s._form();
    };


    $.extend(Upload.prototype, {
        _form : function () {
        var s = this,
            time = 'i' + (new Date() - 0),
            iframe = $('<iframe id="' + time + '" name="' + time + '" src="about:blank" style="display:none"></iframe>'),
            _config = {
                enctype: 'application/x-www-form-urlencoded',
                method: 'get',
                action: '',
                error: './TEMPLATE.html'
            };

        _config = $.extend(_config, s.config);
        s.config.form.attr('target', time);
        s.config.form.attr('method', _config.method);
        s.config.form.attr('action', _config.action);
        s.config.form.attr('enctype', _config.enctype);

        iframe.appendTo('body');
        s.config.form[0].submit();
        iframe.on('load', function () {
            var doc, bodyNode, bodyStr, data;
            try {
                doc = iframe[0].contentWindow.document;
            } catch (e) {
                alert('环境错误, 请联系开发同学');
            }
            if (doc) {
                console.log(doc);
                bodyNode = $('body', doc);
                bodyStr = bodyNode.html();
                try {
                    data = JSON.parse(bodyStr);
                } catch (e) {
                    data = {'msg': '返回的数据是非json的'};
                }
                iframe.remove();
            }
            _config.callback(data);
        });
        }
    });
