var inAnimation = false;
var slideIndex = 0;
var screenshotHeight = 364;

if (window.addEventListener) {
    // IE9, Chrome, Safari, Opera
    window.addEventListener("mousewheel", MouseWheelHandler, false);
    // Firefox
    window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else window.attachEvent("onmousewheel", MouseWheelHandler);

var adjustTimer = null;
var totalChanges = 0;

function MouseWheelHandler(e) {
    var e = window.event || e; // old IE support
    totalChanges += e.detail;
    var top = parseInt($('.bgs').css('top')) - e.detail * 10;
    top = Math.min(0, top);
    top = Math.max(-$(window).height() * 5, top);

    $('.bgs').css('top', top  + 'px');

    var sTop = parseInt($('.screenshot').css('top')) - e.detail * 5;
    sTop = Math.min(0, sTop);
    sTop = Math.max(-screenshotHeight * 5, sTop);
    $('.screenshot').css('top', sTop + 'px');

    clearTimeout(adjustTimer);
    adjustTimer = setTimeout(function(){
        if (Math.abs(totalChanges) > 8) {

            var targetIndex = slideIndex;
            if (totalChanges < 0) {
                // move up
                targetIndex --;
            } else {
                // move down
                targetIndex ++;
            }

            targetIndex = Math.min(4, targetIndex);
            targetIndex = Math.max(0, targetIndex);

            showSlide(targetIndex, 400);
        } else {
            showSlide(slideIndex, 400);
        }

        totalChanges = 0;
        
    }, 500);
}
$(function(){

    $(window).resize(function(){
        updateSectionHeight();
    });

    updateSectionHeight();

    $.each([0, 1, 2, 3, 4], function(index){
        var li = $('<li><div/></li>');
        li.click(function(){
            if (index != slideIndex && !inAnimation) {
                //500 / Math.abs(currentIndex - index)
                showSlide(index, 400);
            }
            
        });
        $('.page-ctrl').append(li);
    });

    $('.screenshot li:first').css('top', '0');
    $('.page-ctrl li:first').addClass('active');
    showDescription(0, 0, 1);
    scheduleNextSlide();
});

function updateSectionHeight() {
    $('.wh').css('height', $(window).height() + 'px');

    var halfHeight = $(window).width() > 767 ? '100%' : '50%';
    $('.hh').css('height', halfHeight);

    screenshotHeight = parseInt($('.screenshot li:first').css('height'));
    var fontSize = Math.min(40, ($(window).width() / 1440) * 40);
    fontSize = Math.max(20, fontSize);
    $('.description p').css('font-size', fontSize+'px');
    $('.description').css('height', fontSize * 3 + 'px');
    showSlide(slideIndex, 300);
}

function showDescription(index, duration, opacity) {
    $('.description li:eq('+index+')').animate({'opacity':opacity, 'top':0}, opacity == 0 ? duration / 2 : duration, function(){
        if (opacity == 0) {
            $(this).css('top', '40px');
        }
    });
}

var sliderTimer = null;
function scheduleNextSlide() {
    inAnimation = false;
    clearTimeout(sliderTimer);
    sliderTimer = setTimeout(function(){ 
        var targetIndex = slideIndex + 1;
        if (targetIndex == 5) {
            targetIndex = 0;
        }
        showSlide(targetIndex, 400);
    }, 5000);
}

function showSlide(targetIndex, duration) {
    inAnimation = true
    showDescription(slideIndex, duration, 0);
    showDescription(targetIndex, duration, 1);
    //
    $('.page-ctrl li.active').removeClass('active');
    $('.page-ctrl li:eq('+targetIndex+')').addClass('active');
    $('.bgs').animate({'top':-targetIndex * $(window).height()}, duration, function(){
        slideIndex = targetIndex;
        if (targetIndex == 4) {
            $('.page-ctrl').addClass('page-ctrl-active');
        } else {
            $('.page-ctrl').removeClass('page-ctrl-active');
        }
        scheduleNextSlide();
    }); 

    $('.screenshot').animate({'top':-targetIndex * screenshotHeight}, duration);

    $('.slide-content').animate({'top':targetIndex==4 ? -$(window).height():0}, duration);


}