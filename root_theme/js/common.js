$(function() {

	$(".burger-menu").click(function () {
    $(".main-nav--mobile").toggleClass("flex");
    $(".burger-menu").toggleClass("menu-on");
    $(".burger-menu-text").toggleClass("is-open");
  });


  $(window).resize(function(){
    var w = $(window).width();
    menu    = $('.main-nav--mobile');
    if(w > 480 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }
  });

  // sticky header menu
  $(window).scroll(function() {
    var top = $(document).scrollTop();
    if (top < 300) $(".top_nav").removeClass('fixed');
    else $(".top_nav").addClass('fixed');
  });

});
