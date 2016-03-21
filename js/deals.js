$(document).ready(function(){
    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
	$("#datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date()
    }).datepicker("setDate", '-1m');


    $("#datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
    }).datepicker("setDate", new Date());

    makeTabs (); 

    $('body').on('click', '.tab-status li', function() {
    	if ($('.tab-status a[href="#overdue"]').parent().hasClass('current') || $('.tab-status a[href="#completed"]').parent().hasClass('current')) {
			$('.period').show();
		} else {
			$('.period').hide();
		} 
    });

    $('body').on('click', 'button', function(){
        updateDeals($(this).attr('data-id'));        
    })      
})

init();

function getExpiredDeals() {
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?expired=2', null, function(data) {
            var count = data.count,
                data = data.results,
                html = '';
            if (data.length == 0) {
                document.getElementById('overdue').innerHTML = 'Сделок нет';
                document.getElementById('overdue-count').innerHTML = '0';
            } 
            document.getElementById('overdue-count').innerHTML = count;
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div><button data-id=' + fields[names[0]].value + '>Завершить</button></div>';
                document.getElementById('overdue').innerHTML = html;
            }           
        }); 
}

function getDoneDeals() {
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?done=2', null, function(data) {
            var count = data.count,
                data = data.results,
                html = '';
            if (data.length == 0) {
                document.getElementById('completed').innerHTML = 'Сделок нету';
                document.getElementById('completed-count').innerHTML = '0';
                return;
            }
            document.getElementById('completed-count').innerHTML = count;
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div></div>';
                document.getElementById('completed').innerHTML = html;
            }
        }); 
}

function getUndoneDeals() {
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?done=3', null, function(data) {
            var count = data.count,
                data = data.results,
                html = '';
            if (data.length == 0) {
                document.getElementById('incomplete').innerHTML = 'Сделок нету';
                document.getElementById('incomplete-count').innerHTML = '0';
                return;
            }
            document.getElementById('incomplete-count').innerHTML = count;
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div><button data-id=' + fields[names[0]].value + '>Завершить</button></div>';
                document.getElementById('incomplete').innerHTML = html;
            }
        }); 
}

function init() {
    getExpiredDeals();
    getDoneDeals();
    getUndoneDeals();
}

function updateDeals(deal) {
    var data = {
        "id": deal,
        "done": true
    }
    var json = JSON.stringify(data);
    ajaxRequest(config.DOCUMENT_ROOT + 'api/update_deal', json, function(JSONobj) {
        init(); 
                    }, 'POST', true, {
        'Content-Type': 'application/json'
        });
        
}



function makeTabs () {

    	var pos = 0,
        tabs = $('.tab-status li'),
        tabsContent = $('.tabs-cont');
        
        for (var i = 0; i < tabs.length; i++) {
            $(tabs[i]).attr('data-page', pos);
            pos++;
        }        
        
        showPage(0);
        
    	tabs.click(function(e) {    		
    		e.preventDefault();    		 
    	    return showPage(parseInt($(this).attr("data-page")));
        });
        
        function showPage(i) {
                tabsContent.hide();
                tabs.removeClass("current");
	            tabsContent.eq(i).show();
            	tabs.eq(i).addClass("current");
        }   
}