$(function(){
    $('.layer').each(function(){
        var original_y = parseInt($(this).css('top').replace('px',''));
        $(this).attr('original-y', original_y);
        var scroll_offset = parseInt($(this).attr('scroll-offset'));
        $(this).attr('max-y', original_y - scroll_offset);
    });

    $(window).scroll(function(){
        scroll_layer();
    });

    scroll_layer();
});

function scroll_layer(){
    var scroll_top = $(window).scrollTop();
    var layer_delta = 0;

    if (scroll_top > 500){
        layer_delta = (scroll_top - 500) / 3;
        $('.layer').each(function(){
            var original_y = parseInt($(this).attr('original-y'));
            var max_y = parseInt($(this).attr('max-y'));
            var ratio = parseInt($(this).attr('scroll-ratio'));
            var new_top = original_y - layer_delta * ratio;
            new_top = Math.max(new_top, max_y);
            $(this).css('top', new_top+'px');
        });
    }
}
