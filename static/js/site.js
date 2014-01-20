$(function(){
    show_next_quote();
});

function show_next_quote(){
    var quote = $('.quotes li:first');

    if ($('.quotes li.showing').length > 0){
        quote = $('.quotes li.showing').next('li');
        if (quote.length == 0) quote = $('.quotes li:first');

        $('.quotes li.showing').animate({opacity:0}, 1000, function(){
            $(this).hide();
            $(this).removeClass('showing');
            quote.addClass('showing').show().css('opacity','0').animate({opacity:1}, 1000, function(){
                var seconds = $(this).find('p').html().split(' ').length * 170;
                if (seconds < 3000){
                    seconds = 3000;
                }

                setTimeout('show_next_quote()', seconds);
            });
        });
    }else{
         quote.addClass('showing').show().css('opacity','0').animate({opacity:1}, 1000, function(){
            var seconds = $(this).find('p').html().split(' ').length * 170;
            if (seconds < 3000){
                seconds = 3000;
            }
            setTimeout('show_next_quote()', seconds);
        });
    }
}