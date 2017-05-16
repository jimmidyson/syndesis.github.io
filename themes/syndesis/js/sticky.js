'use strict';

(function() {
  $(document).ready(function () {
    $('#sidemenu').affix({
      offset:{
        top: 0
      }
    });

    console.log($('.main-content').height() - $('.main-content').offset().top);

    /*
    $('#sidebar').affix({
      offset:{
        top: $('#topnav').outerHeight() - 20,
        bottom: $('footer').outerHeight() + 50
      }
    });
    */
  });
})();
