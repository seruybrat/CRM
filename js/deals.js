$(document).ready(function(){

    //partnerlist 
    //getPartnersList();

$('input[name="fullsearch"]').keyup(function() {

        delay(function() {
            getPartnersList()
        }, 1500);



    });

    document.getElementById('sort_save').addEventListener('click',function(){
        updateSettings(getPartnersList);
     })

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

    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('popup').style.display = '';
    });

    document.getElementById('complete').addEventListener('click', function() {
        var attr = this.getAttribute('data-id');
        updateDeals(attr);        
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
                page = time['page'] || 1,                
                pages = Math.ceil(count / config.pagination_count),
                html = '';
            if (data.length == 0) {
                document.getElementById('overdue').innerHTML = 'Сделок нет';
                document.getElementById('overdue-count').innerHTML = '0';
                return;
            } 
            document.getElementById('overdue-count').innerHTML = count;
            var container = ".expired-pagination",
                target = ".expired-pagination .pag li",
                arrow = ".expired-pagination .arrow",
                active = ".expired-pagination .pag li.active",
                dblArrow = ".expired-pagination .double_arrow";
            makePagination(page,container,target,arrow,active,dblArrow,pages,data.length,count);
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div><button data-id=' + fields[names[0]].value + '>Завершить</button></div>';
            }    
            document.getElementById('overdue').innerHTML = html;  
            var but = document.querySelectorAll(".rows-wrap button");
            for (var j = 0; j < but.length; j++) {
                but[j].addEventListener('click', function(){
                    getDataForPopup(this.getAttribute('data-id'),this.getAttribute('data-name'),this.getAttribute('data-date'),this.getAttribute('data-responsible'),this.getAttribute('data-value') + ' ₴')                    
                })
            }    
        }); 
}

function getDoneDeals(time) {
    var json = time || null;
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?done=2', json, function(data) {
            config.pagination_count = 2;
            var count = data.count,
                data = data.results,                
                page = time['page'] || 1,                
                pages = Math.ceil(count / config.pagination_count),
                html = '';
            if (data.length == 0) {
                document.getElementById('completed').innerHTML = 'Сделок нету';
                document.getElementById('completed-count').innerHTML = '0';
                return;
            }
            document.getElementById('completed-count').innerHTML = count;
            
        var container = ".done-pagination",
            target = ".done-pagination .pag li",
            arrow = ".done-pagination .arrow",
            active = ".done-pagination .pag li.active",
            dblArrow = ".done-pagination .double_arrow";
            makePagination(page,container,target,arrow,active,dblArrow,pages,data.length,count)
            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div></div>';
                
            }
            document.getElementById('completed').innerHTML = html;
        }); 
}

function getUndoneDeals(data) {
    var json = data || null;
    ajaxRequest(config.DOCUMENT_ROOT + 'api/deals/?done=3', json, function(data) {
            var count = data.count,
                data = data.results,
                page = data['page'] || 1,                
                pages = Math.ceil(count / config.pagination_count),
                html = '';
            if (data.length == 0) {
                document.getElementById('incomplete').innerHTML = 'Сделок нету';
                document.getElementById('incomplete-count').innerHTML = '0';
                return;
            }
            document.getElementById('incomplete-count').innerHTML = count;
        var container = ".undone-pagination",
            target = ".undone-pagination .pag li",
            arrow = ".undone-pagination .arrow",
            active = ".undone-pagination .pag li.active",
            dblArrow = ".undone-pagination .double_arrow";
            makePagination(page,container,target,arrow,active,dblArrow,pages,data.length,count)

            for (var i = 0; i < data.length; i++) {
                var fields = data[i].fields,
                    names = Object.keys(fields);
                    html += '<div class="rows-wrap"><div class="rows"><div class="col"><p><span>'+fields[names[1]].value +'</span></p></div><div class="col"><p>Последняя сделка:<span> ' + fields[names[3]].value + '</span></p><p>Ответственный:<span> '+ fields[names[2]].value +'</span></p><p>Сумма:<span> ' + fields[names[4]].value + ' ₴</span></p></div></div><button data-id=' + fields[names[0]].value + ' data-name="' + fields[names[1]].value + '" data-date=' + fields[names[3]].value + ' data-responsible="' + fields[names[2]].value + '" data-value=' + fields[names[4]].value + '>Завершить</button></div>';
                document.getElementById('incomplete').innerHTML = html;
            }
            var but = document.querySelectorAll(".rows-wrap button");
            for (var j = 0; j < but.length; j++) {
                but[j].addEventListener('click', function(){
                    getDataForPopup(this.getAttribute('data-id'),this.getAttribute('data-name'),this.getAttribute('data-date'),this.getAttribute('data-responsible'),this.getAttribute('data-value') + ' ₴')                    
                })
            }
        }); 
}

function makePagination(page,container,target,arrow,active,dblArrow,pages,length,count) {
            var pagination = '<div class="element-select"><p>Показано <span>'+ length +'</span> из <span>'+ count +'</span></p></div><div class="pag-wrap">';
            
            if(  page > 1 ){
                 pagination += '<div class="prev"><span class="double_arrow"></span><span class="arrow"></span></div>';
            }

            if (pages > 1) {
                pagination += '<ul class="pag">';
                    for (var k = page - 5; k < page + 5; k++) {
                        if (k == page) {
                            pagination += '<li class="active">' + k + '</li>'
                        } else {
                            if(  k > 0  && k < pages + 1  ){
                                pagination += '<li>' + k + '</li>';
                            }
                        }
                    }
                    pagination += '</ul>';
                } 
           if( page < pages ){     
                pagination += '<div class="next"><span class="arrow"></span><span class="double_arrow"></span></div></div>';
            }
    Array.prototype.forEach.call(document.querySelectorAll(container), function(el) {
            el.innerHTML = pagination;
            el.style.display = 'block';
        });
        
        Array.prototype.forEach.call(document.querySelectorAll(target), function(el) {
        el.addEventListener('click', function() {
                setClickToPagination(this);
            });
        });
        Array.prototype.forEach.call(document.querySelectorAll(arrow), function(el) {
            el.addEventListener('click', function() {                
                arrowClick(this,active,pages);                
            })
        });
        Array.prototype.forEach.call(document.querySelectorAll(dblArrow), function(el) {
            el.addEventListener('click', function() {
                dblArrowClick(this,pages);
            })
        });
}

function dblArrowClick(parent,pages) {
    var data = {};
    if(  parent.parentElement.classList.contains('prev')  ) {                
        data['page'] = 1;
        data["to_date"] = done_to_date;
        data["from_date"] = done_from_date;
        getDoneDeals(data);
    } else {                    
        data['page'] = pages;
        data["to_date"] = done_to_date;
        data["from_date"] = done_from_date;
        getDoneDeals(data);
    }
}

function arrowClick(parent,target,pages) {
    var page;
    var data = {};
    if(  parent.parentElement.classList.contains('prev')  ){
        page = parseInt( document.querySelector(target).innerHTML ) > 1 ? parseInt( document.querySelector(target).innerHTML ) -1 : 1
        data['page'] = page;
        data["to_date"] = done_to_date;
        data["from_date"] = done_from_date;
        getDoneDeals(data);
    } else {                    
        page = parseInt( document.querySelector(target).innerHTML ) !=  pages ? parseInt( document.querySelector(target).innerHTML )  + 1 : pages
        data["to_date"] = done_to_date;
        data["from_date"] = done_from_date;
        data['page'] = page;
        getDoneDeals(data);
    }
}

function setClickToPagination(target) {
    var data = {};
    data['page'] = target.innerHTML;
    getDoneDeals(data);
}

function getDataForPopup(id,name,date,responsible,value) {
    document.getElementById('complete').setAttribute('data-id',id);
    document.getElementById('client-name').innerHTML = name;
    document.getElementById('deal-date').innerHTML = date;
    document.getElementById('responsible-name').innerHTML = responsible;
    document.getElementById('deal-value').innerHTML = value;
    document.getElementById('popup').style.display = 'block';
}

function init() {
    var json = {};
    json["page"] = '1';
    getExpiredDeals(json);
    getDoneDeals(json);
    getUndoneDeals(json);
}

function updateDeals(deal) {
    var data = {
        "id": deal,
        "done": true
    }
    var json = JSON.stringify(data);
    ajaxRequest(config.DOCUMENT_ROOT + 'api/update_deal', json, function(JSONobj) {
            init(); 
            document.getElementById('popup').style.display = '';
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
            var done = document.getElementById('period_done'),
                expired = document.getElementById('period_expired');
            if (document.querySelectorAll('a[href="#overdue"]')[0].parentElement.classList.contains('current')) {
                done.style.display = 'none';
                expired.style.display = 'block';
            } else if (document.querySelectorAll('a[href="#completed"]')[0].parentElement.classList.contains('current')) {
                done.style.display = 'block';
                expired.style.display = '';
            } else {
                done.style.display = '';
                expired.style.display = '';
            }
        }
}



function getPartnersList(param){
    var param = param || {}
     var path = config.DOCUMENT_ROOT + '/api/partnerships/?'
    
var search = document.getElementsByName('fullsearch')[0].value;
    if(search ){
        param['search'] = search;
    }
    ajaxRequest(path, param, function(data) {

        var results = data.results;
        var count = data.count;
        var common_fields = data.common_table;
        var  html = ''
        var thead = '<table><thead>'
        for(var i = 0;i<results.length;i++){
            html += '<tr>'
            
            var field = results[i].fields;
                for(var j in field){

                    if(  !common_fields[j] && (!config['column_table'][j] || !config['column_table'][j]['active'] )  ) continue 

                    if(!i){
                       thead += '<th data-order="'+ field[j]['verbose']  +'">'+j+'</th>'
                    }    
                    html += '<td data-model="'+ j  +'">' + field[j].value  +'</td>'
                
                }
            html += '</tr>'
            thead += '</thead><tbody></tbody></table' 
        }

    var page = parseInt(param['page']) || 1;
        //paginations

    var pages = Math.ceil(count / config.pagination_count);

    var paginations = ''

    if(  page > 1 ){
         paginations += '<div class="prev"><span class="double_arrow"></span><span class="arrow"></span></div>';
    }

    if (pages > 1) {
        paginations += '<ul class="pag">'
        for (var j = page -5 ; j < page + 5; j++) {
            if (j == page) {
                paginations += '<li class="active">' + j + '</li>'
            } else {
                if(  j > 0  && j < pages + 1  ){
                     paginations += '<li>' + j + '</li>'
                }
               
            }

        }
        paginations += '</ul>'
    }

    if( page < pages ){
        paginations += '</ul><div class="next"><span class="arrow"></span><span class="double_arrow"></span></div>' 
    }



        document.getElementById('partnersips_list').innerHTML = thead

        document.querySelector("#partnersips_list tbody").innerHTML = html;
    Array.prototype.forEach.call(document.querySelectorAll(" .pag-wrap"), function(el) {
        el.innerHTML = paginations
    })



        Array.prototype.forEach.call(document.querySelectorAll(" .pag li"), function(el) {
                el.addEventListener('click', function() {

                    var data = {};
                    data['page'] = el.innerHTML;
                     getPartnersList(data);


                });
            });
           



    /* Navigation*/

    Array.prototype.forEach.call(document.querySelectorAll(".arrow"), function(el) {
        el.addEventListener('click', function() {
            var page 
             var data = {};
            if(  this.parentElement.classList.contains('prev')  ){
            page = parseInt( document.querySelector(".pag li.active").innerHTML ) > 1 ? parseInt( document.querySelector(".pag li.active").innerHTML ) -1 : 1
            data['page'] = page
            getPartnersList(data);
            }else{
                
                page = parseInt( document.querySelector(".pag li.active").innerHTML ) !=  pages ? parseInt( document.querySelector(".pag li.active").innerHTML )  + 1 : pages
                  data['page'] = page
            getPartnersList(data);
            }

        })
    });

    Array.prototype.forEach.call(document.querySelectorAll(".double_arrow"), function(el) {
        el.addEventListener('click', function() {
            var data = {};
            if(  this.parentElement.classList.contains('prev')  ){
            
            data['page'] = 1
            getPartnersList(data);
            }else{
                
            data['page'] = pages
            getPartnersList(data);
            }


        })
    });



    })
}



