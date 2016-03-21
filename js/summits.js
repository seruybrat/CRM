$(document).ready(function(){

	create_summit_buttons('summit_buttons');	

	$('body').on('click', '#summit_buttons li', function(){
		$(this).addClass('active');
		var summit_id = $(this).attr('data-id');
		createSummits({'summit' : summit_id})
		window.summit = summit_id;
	});

	$('input[name="fullsearch"]').keyup(function() {
        	createSummits({'summit' : summit});
    });

});

var summit;

function show_summits(data, search){
	    var data_results = data.results;
	    console.log(data_results);

	    if (data_results.length == 0) {
	    	document.getElementById("summit_table").innerHTML = '<p>По запросу не найдено участников</p>';
	        Array.prototype.forEach.call(document.querySelectorAll(".pagination ul"), function(el) {
	            el.style.display = 'none'
	         })
	    	return;
	    }

	    var html = '<table><thead><tr>',
	        body = data_results[0].common;
	        head = Object.keys(data_results[0].common),
	        pagination = '<div class="pag-wrap"><div class="prev"><span class="double_arrow"></span><span class="arrow"></span></div><ul class="pag">',
	        page = search.page || 1,
	        config.pagination_count = 2,
	        count = data.count,
	        pages = Math.ceil(count / config.pagination_count);

	   	if (pages > 1) {
	        for (var k = 1; k <= pages; k++) {
	            if (k == page) {
		            pagination += '<li class="active">' + k + '</li>'
		        } else {
		            pagination += '<li>' + k + '</li>'
		        }
	        }
	    }

	    pagination += '</ul><div class="next"><span class="arrow"></span><span class="double_arrow"></span></div></div>';

		Array.prototype.forEach.call(document.querySelectorAll(".pagination"), function(el) {
			el.innerHTML = pagination;
			el.style.display = 'block';
		});

	    for (var i = 0; i < head.length; i++) {
	    	html += '<th>' + head[i] + '</th>';	      	
	    }

	    html += '</tr></thead><tbody>';

	    for (var j = 0; j < data_results.length; j++) {
	      	html += '<tr>';
	      	for (prop in body) {
	      		for (field in data_results[j].info) {
	      			if (body[prop] == data_results[j].info[field].verbose) {
	      				html += '<td>' + data_results[j].info[field].value + '</td>';
	      			}
	      		}
	      	}	      	
	    	html += '</tr>';
	    }
	    html += '</tbody></table>';

	    document.getElementById('summit_table').innerHTML = html;

	    Array.prototype.forEach.call(document.querySelectorAll(" .pag li"), function(el) {
        el.addEventListener('click', function() {
	            var data = search;
	            data['page'] = el.innerHTML;
	            createSummits(data);
        	});
    	});

    	Array.prototype.forEach.call(document.querySelectorAll(".arrow"), function(el) {
	        el.addEventListener('click', function() {
	        	var page;
	        	var data = search;
	        	if(  this.parentElement.classList.contains('prev')  ){
	        	page = parseInt( document.querySelector(".pag li.active").innerHTML ) > 1 ? parseInt( document.querySelector(".pag li.active").innerHTML ) -1 : 1
	        	data['page'] = page;
	        	createSummits(data);
	        	}else{
	        		
	        		page = parseInt( document.querySelector(".pag li.active").innerHTML ) !=  pages ? parseInt( document.querySelector(".pag li.active").innerHTML )  + 1 : pages
	        		data['page'] = page;
	        	createSummits(data);
	        	}

	        })
	    });

	    Array.prototype.forEach.call(document.querySelectorAll(".double_arrow"), function(el) {
	        el.addEventListener('click', function() {
	        	var data = search;
	            if(  this.parentElement.classList.contains('prev')  ){
	            
	            data['page'] = 1;
	            createSummits(data);
	            }else{
	                
	            data['page'] = pages;
	            createSummits(data);
	            }
	        })
	    });
}

function createSummits(data){
    var path = config.DOCUMENT_ROOT + 'api/summit_ankets/?',
    	data = data ||  {},
    	search = document.getElementsByName('fullsearch')[0].value;
    if(search && !data['search']){
        data['search'] = search;
    }
    ajaxRequest(path, data, function(answer) {
        show_summits(answer, data)
    })
}

function create_summit_buttons(id){
        ajaxRequest(config.DOCUMENT_ROOT + 'api/summit/', null, function(data) {
            var data = data.results;
            var html = '<p>Выбрать саммит</p><div class="buttons"><ul>';
            for (var i = 0; i < data.length; i++) {
                html += '<li data-id="' + data[i].id + '"><span>' + data[i].title + '</span></li>';
            }
            html += '</ul></div>';
            document.getElementById(id).innerHTML = html;

        });    
	}