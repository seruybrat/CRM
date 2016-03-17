$(document).ready(function(){

	create_summit_buttons('summit_buttons');


	function create_summit_buttons(id){
        ajaxRequest(config.DOCUMENT_ROOT + 'api/summit/', null, function(data) {
            var data = data.results;
            var html = '<p>Выбрать саммит</p>' +
                '<div class="buttons"><ul>';
            for (var i = 0; i < data.length; i++) {
                html += '<li data-id="' + data[i].id + '"><span>' + data[i].title + '</span></li>';
            }
            html += '</ul></div>';
            document.getElementById(id).innerHTML = html;

        });    
	}

	$('body').on('click', '#summit_buttons li', function(){
		var summit_id = $(this).attr('data-id');
		show_summits(summit_id)
	})		
});



function show_summits(id){
	   ajaxRequest(config.DOCUMENT_ROOT+'api/summit_ankets/?user=&summit='+id, null, function(data) {
	     var data = data.results,
	         html = '<table><thead><tr>',
	         body = data[0].common;
	         head = Object.keys(data[0].common);
	         console.log(data);
	     for (var i = 0; i < head.length; i++) {
	      html += '<th>' + head[i] + '</th>';	      	
	     }
	     html += '</tr></thead><tbody>';
	     for (var j = 0; j < data.length; j++) {
	      html += '<tr>';
	      for (prop in body) {
	      	for (field in data[j].info) {
	      		if (body[prop] == data[j].info[field].verbose) {
	      			html += '<td>' + data[j].info[field].value + '</td>';
	      		}
	      	}
	      }	      	
	      html += '</tr>';
	     }
	     html += '</tbody></table>';
       $('#summit_table').html(html);
	   }); 
}