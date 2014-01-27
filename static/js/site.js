$(function(){
    show_next_quote();
    setTimeout('show_next_screenshot()', 3000);
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

function show_next_screenshot(){
    var number_of_shots = $('.screen-shots li').length;
    var current_screen = parseInt($('.screen-shots').attr('current-screen'));
    current_screen ++;
    if (current_screen == number_of_shots){
        current_screen = 0;
        $('.screen-shots').css('left', 0);
        setTimeout('show_next_screenshot()', 3000);
         $('.screen-shots').attr('current-screen', current_screen);
        return;
    } 

    $('.screen-shots').animate({left:-320*current_screen}, 250, function(){
        $('.screen-shots').attr('current-screen', current_screen);
        setTimeout('show_next_screenshot()', 3000);
    });
}