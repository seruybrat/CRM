var config = {
   //    'DOCUMENT_ROOT':'http://vocrm.org/',
    'DOCUMENT_ROOT': 'http://5.101.119.32:8008/',
    'pagination_count': 50, //Количество записей при пагинации
    'pagination_mini_count': 10
}

$("#nav-sidebar li ").click(function(e) {
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
      $(".table-sorting").animate({right: '0px'}, 10, 'linear')
 });
$("#sort-off").click(function () {
      $(".table-sorting").animate({right: '-300px'}, 10, 'linear')
 });



$('.tabs .tabs-nav li a').click(function(e) {
	e.preventDefault();
	$('.tabs .tabs-nav li.current').removeClass('current');
	$(this).parent().addClass('current');
	$('.tab-content .tab-toggle:not(:hidden)').hide();
	$(this.hash).show();
	
});

$(".tabs-nav li a:first").click();