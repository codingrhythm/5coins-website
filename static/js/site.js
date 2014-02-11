$(function(){
    var now = new Date();
    var hours = now.getHours();

    if (hours < 6){
        $('#bg img').prop('src','static/img/bg/1.jpg');
    }else if (hours >=6 && hours <= 9){
        $('#bg img').prop('src','static/img/bg/2.jpg');
    }else if (hours >9 && hours <=16){
        $('#bg img').prop('src','static/img/bg/3.jpg');
        //$('body').addClass('light');
    }else if (hours >16 && hours <=19){
        $('#bg img').prop('src','static/img/bg/4.jpg');
    }else{
        $('#bg img').prop('src','static/img/bg/5.jpg');
    }

    // build reviews
    for (var i in reviews){
        var li = $('<li><p class="by"><strong>by '+reviews[i].name+'</strong> - '+reviews[i].date+'</p><p>'+reviews[i].content+'</p></li>');
        $('#reviews').append(li);
    }
    show_next_quote();
    setTimeout('show_next_screenshot()', 4000);
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
                var seconds = $(this).find('p:last').html().split(' ').length * 200;
                if (seconds < 3000){
                    seconds = 3000;
                }

                setTimeout('show_next_quote()', seconds);
            });
        });
    }else{
         quote.addClass('showing').show().css('opacity','0').animate({opacity:1}, 1000, function(){
            var seconds = $(this).find('p:last').html().split(' ').length * 200;
            if (seconds < 3000){
                seconds = 3000;
            }
            setTimeout('show_next_quote()', seconds);
        });
    }
}

function show_next_screenshot(){
    var showing_view = $('.screen-shots li.showing');
    var next_view = showing_view.prev('li');

    if (next_view.length == 0){
        showing_view.removeClass('showing');
        next_view = $('.screen-shots li:last');
        next_view.addClass('showing').animate({opacity:1}, 1000, function(){
            $('.screen-shots li').css('opacity', '1');
            setTimeout('show_next_screenshot()', 4000);
        });
    }else{
        showing_view.animate({opacity:0}, 1000, function(){
            showing_view.removeClass('showing');
            next_view.addClass('showing');
            setTimeout('show_next_screenshot()', 4000);
        });
    }
}