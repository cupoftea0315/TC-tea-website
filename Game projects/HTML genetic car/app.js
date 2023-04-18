var optionsTimeoutIn,
    optionsTimeoutOut,
    graphicsDisabled = false;

$(function() {
    optionsTimeoutIn = setTimeout(function() {
        $('.options').animate({
            opacity: 0
        }, 1000)
    }, 7000);

    $('.options').mouseenter(function(){
        clearTimeout(optionsTimeoutIn);
        clearTimeout(optionsTimeoutOut);
        $('.options').animate({
            opacity: 1
        }, 500);
    });

    $('.options').mouseleave(function(){
        clearTimeout(optionsTimeoutIn);
        clearTimeout(optionsTimeoutOut);
        optionsTimeoutOut = setTimeout(function() {
            $('.options').animate({
                opacity: 0
            }, 500)
        }, 1000);
    });
});

function toggleInfo() {
    graphicsDisabled = !graphicsDisabled;
    $('.info').toggleClass('hidden');
    $('#mainbox').toggleClass('hidden');
}

