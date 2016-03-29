$(document).ready(function(){
	getEventsList();
});


function getEventsList(){
	 ajaxRequest(config.DOCUMENT_ROOT + '/api/event_types/', null, function(data) {
	 	//console.log(data)
	 	var result = data.results;
	 	var html = '';
	 	var last_date_event;
	 	for(var i =0 ; i<result.length;i++){


	 		last_date_event = result[i].last_event_date ? '<p>Последнее событие: <span>'+result[i].last_event_date + '</span></p>'  : '';
	 		html +=	'<div class="event-i"><span>Служение</span><div class="event-hover">'+
						'<h3>' +  result[i].title  +'</h3>'+ last_date_event+
						'<p>Всего событий: <span>'+  result[i].event_count  +'</span>	</p><button data-id = "'+  result[i].id +'">Перейти</button>' +
					'</div></div>'
	 	}
	 	document.querySelector(".events-wrap").innerHTML = html;

		 Array.prototype.forEach.call(document.querySelectorAll('button[data-id]'), function(el) {
		        el.addEventListener('click', function() {
		         var id =   this.getAttribute('data-id')  
		         document.location.href = '../nightpray.html?id=' + id 
		        })
    	});
	 })
}