$(document).ready(function(){

    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );

	$("#done_datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date(),
        onSelect: function(date) {
            window.done_from_date = date;
            sortDoneDeals(done_from_date,done_to_date);
        }
    }).datepicker("setDate", '-1m');

    $("#done_datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date) {
            window.done_to_date = date;
            sortDoneDeals(done_from_date,done_to_date);
        }
    }).datepicker("setDate", new Date());

    $("#expired_datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date(),
        onSelect: function(date) {
            window.expired_from_date = date;
            sortExpiredDeals(expired_from_date,expired_to_date);
        }
    }).datepicker("setDate", '-1m');

    $("#expired_datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date) {
            window.expired_to_date = date;
            sortExpiredDeals(expired_from_date,expired_to_date);
        }
    }).datepicker("setDate", new Date());

    makeTabs (); 

    document.getElementById('show-all-expired').addEventListener('click', function() {
            window.expired_from_date = '';
            window.expired_to_date = '';
            sortExpiredDeals(expired_from_date,expired_to_date);
        }); 

    document.getElementById('show-all-done').addEventListener('click', function() {
            window.done_from_date = '';
            window.done_to_date = '';
            sortDoneDeals(done_from_date,done_to_date);
        });   
})

var done_from_date = '',
    done_to_date = '',
    expired_from_date = '',
    expired_to_date = '';

init();

function getExpiredDeals(time) {
    var json = time || null;
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?expired=2', json, function(data) {
            var count = data.count,
                data = data.results,
                html = '';
            if (data.length == 0) {
                document.getElementById('overdue').innerHTML = 'Сделок нет';
                document.getElementById('overdue-count').innerHTML = '0';
                return;
            } 
            document.getElementById('overdue-count').innerHTML = count;
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div><button data-id=' + fields[names[0]].value + '>Завершить</button></div>';
            }    
            document.getElementById('overdue').innerHTML = html;  
            var but = document.querySelectorAll(".rows-wrap button");
            for (var j = 0; j < but.length; j++) {
                but[j].addEventListener('click', function(){
                    var attr = this.getAttribute('data-id');
                    console.log(attr)
                    updateDeals(attr);
                })
            }    
        }); 
}

function getDoneDeals(time) {
    var json = time || null;
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?done=2', json, function(data) {
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
                
            }
            document.getElementById('completed').innerHTML = html;
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
            var but = document.querySelectorAll(".rows-wrap button");
            for (var j = 0; j < but.length; j++) {
                but[j].addEventListener('click', function(){
                    var attr = this.getAttribute('data-id');
                    console.log(attr)
                    updateDeals(attr);
                })
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

function sortDoneDeals(from,to) {
    var json = {};
    json["to_date"] = to;
    json["from_date"] = from;
    getDoneDeals(json);
}

function sortExpiredDeals(from,to) {
    var json = {};
    json["to_date"] = to;
    json["from_date"] = from;
    getExpiredDeals(json);
}

function makeTabs () {
    	var pos = 0,
        tabs = document.getElementById('tabs'),
        tabsContent = document.getElementsByClassName('tabs-cont');
        
        for (var i = 0; i < tabs.children.length; i++) {
            tabs.children[i].setAttribute('data-page', pos);
            pos++;
        }   
        
        showPage(0);
        
    	tabs.onclick = function(event) {
            event.preventDefault();
            return showPage(parseInt(event.target.parentElement.getAttribute("data-page")));
        };
        
        function showPage(i) {
            for (var k = 0; k < tabsContent.length; k++) {
                tabsContent[k].style.display = 'none';
                tabs.children[k].classList.remove('current');
            }
            tabsContent[i].style.display = 'block';
            tabs.children[i].classList.add('current');
            if (document.querySelectorAll('a[href="#overdue"]')[0].parentElement.classList.contains('current')) {
                document.getElementById('period_done').style.display = 'none';
                document.getElementById('period_expired').style.display = 'block';
            } else if (document.querySelectorAll('a[href="#completed"]')[0].parentElement.classList.contains('current')) {
                document.getElementById('period_done').style.display = 'block';
                document.getElementById('period_expired').style.display = 'none';
            } else {
                document.getElementById('period_done').style.display = 'none';
                document.getElementById('period_expired').style.display = 'none';
            }
        }
}