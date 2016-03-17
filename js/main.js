$("#nav-sidebar li ").click(function(e) {
  e.preventDefault();
  $("#nav-sidebar li").removeClass('active');
  $(this).addClass('active');
});



$("#pag li ").click(function(e) {
  e.preventDefault();
  $("#pag li").removeClass('active');
  $(this).addClass('active');
});



$("#move-sidebar").click(function(){
  $("#sidebar").toggleClass("toggle-sidebar");
});



$("#sort-on").click(function () {
      $(".table-sorting").animate({right: '0px'})
 });



$("#sort-off").click(function () {
      $(".table-sorting").animate({right: '-300px'})
 }); 
