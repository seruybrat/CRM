var config = {
    //'DOCUMENT_ROOT':'http://vocrm.org/',
    'DOCUMENT_ROOT': 'http://5.101.119.32:8008/',
    'pagination_count': 3, //Количество записей при пагинации
    'pagination_mini_count': 10,
    'column_table' : null
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

$("body").on('click', '#pag li', function(e) {
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



$(function() {
    
        ajaxRequest(config.DOCUMENT_ROOT + 'api/users/current', null, function(data) {
            var user_id = data.id;
            config.column_table =  data.column_table;
            

            if(document.getElementById('database_users')){
                createUser();
                getCurrentSetting();
            }

            if(document.getElementById('partnersips_list')){
              getPartnersList();
            }


          })
  })

jQuery(function($) {
    if($.datepicker){
            $.datepicker.regional['ru'] = {
            monthNames: ['Яварь', 'Февраль', 'Март', 'Апрель',
                'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
                'Октябрь', 'Ноябрь', 'Декабрь'
            ],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            firstDay: 1,
        };
        $.datepicker.setDefaults($.datepicker.regional['ru']);
    }
    
});

