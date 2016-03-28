var config = {
    //'DOCUMENT_ROOT':'http://vocrm.org/',
    'DOCUMENT_ROOT': 'http://5.101.119.32:8008/',
    'pagination_count': 30, //Количество записей при пагинации
    'pagination_mini_count': 10,
    'column_table' : null
}

$('.top input').focus(function() {
    $('.top .search').animate({width:"100%"});
  });

$('.top input').blur(function() {
  $('.top .search').animate({width:"50%"});
});


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



$('.tabs-nav li a').click(function(e) {
	e.preventDefault();
	$('.tabs-nav li.current').removeClass('current');
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
              getCurrentSetting();
            }


            if(document.getElementById('event_wrap')){
              getCurrentSetting();
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

function getCurrentSetting(){
     var titles = config['column_table']
     var html = ''
     for(var p in titles){
         if (!titles.hasOwnProperty(p)) continue;
        var ischeck = titles[p]['active'] ? 'check' : ''
       var isdraggable = titles[p]['editable'] ? 'draggable' : 'disable'
        html += '<li '+ isdraggable  + ' >'+
           '<input id="'+  titles[p]['title']   +'" type="checkbox">'+
         '<label for="'+  titles[p]['title']   +'"  class="'+  ischeck +'" id= "' +  titles[p]['id']  +'">'+  p +'</label>'+
         '</li>'
     }


     document.getElementById('sort-form').innerHTML = html;
    
    var cols = document.querySelectorAll('[draggable]');
    Array.prototype.forEach.call(cols, function(col) {
    
      col.addEventListener('drop', handleDrop, false);
      col.addEventListener('dragstart', handleDragStart, false);
      col.addEventListener('dragenter', handleDragEnter, false);
      col.addEventListener('dragover', handleDragOver, false);
      col.addEventListener('dragleave', handleDragLeave, false);
 });
      



  live('click',"#sort-form label",function(el){
       if( !this.parentElement.hasAttribute('disable') ){

                          this.classList.contains('check') ? this.classList.remove('check') : this.classList.add('check');
        }
  })
}

function  updateSettings(callback){


var data = [];
var iteration = 1 
Array.prototype.forEach.call(document.querySelectorAll("#sort-form label"), function(el) {
     var item = {}
     item['id'] = parseInt( el.getAttribute('id') );
     item['number'] = iteration++;
     item['active'] = el.classList.contains('check') ? true : false
     data.push(item)
})



var json = JSON.stringify(data);


 ajaxRequest(config.DOCUMENT_ROOT + 'api/update_columns', json, function(JSONobj) {

        config['column_table'] = JSONobj['column_table'];
if(callback){
    callback();
}
      
        
                    }, 'POST', true, {
        'Content-Type': 'application/json'
        });
        

}
