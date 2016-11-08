setInterval(function() {
    var dcm = $(window.frames[3].document);
    console.log(dcm);
    var pageNum = parseInt(dcm.find('.focus').html(), 10);
    console.log(pageNum);
    if(!pageNum && pageNum <= 123) {
        alert('删除完成');
        return;
    }

    var checkbox = dcm.find('.checkbox[menu="file_check_all"]');
    console.log(checkbox);
    checkbox.trigger('click');

    var btn =dcm.find('[menu="delete"]');
    console.log(btn);
    btn.trigger('click');

    var popWin = $('.window-current');
    console.log(popWin);

    var comfirmBtn = popWin.find('.button');
    console.log(comfirmBtn);
    comfirmBtn.trigger('click');

}, 6000);