$(function(){
    //createUser({'master':user_id}) ;
     $('input[name="fullsearch"]').keyup(function() {

        delay(function() {
            createUser()
        }, 1500);



    });

     document.getElementById('sort_save').addEventListener('click',function(){
        updateSettings(createUser);
       $(".table-sorting").animate({right: '-300px'}, 10, 'linear')
     })
});


var ordering = {}
var parent_id = null

function createUserInfoBySearch(data, search) {


    var count = data.count;
    var data = data.results;
    var tbody = '';
    var page = parseInt(search.page) || 1;
    var list = data;
    
    var html = '<table id="userinfo">';
    if (data.length == 0) {

        showPopup('По данному запросу не найдено участников')
        document.querySelector(".table-wrap .table").innerHTML=''
        document.querySelector(".query-none p").innerHTML = 'По запросу не найдено участников';
        document.getElementById('total_count').innerHTML = count;
         document.getElementsByClassName('preloader')[0].style.display = 'none'
        Array.prototype.forEach.call(document.querySelectorAll(".pagination"), function(el) {
            el.style.display = 'none'
         })
        return;
    }

    //нагавнячив
    Array.prototype.forEach.call(document.querySelectorAll(".pagination"), function(el) {
            el.style.display = 'block'
         })


    html += '<thead>';



 var common  = config['column_table']
 for(var title in config['column_table']){
     if(  !config['column_table'][title]['active'] && config['column_table'][title]['editable']    ) continue

    if (ordering[config['column_table'][title]]) {
            html += '<th data-order="' + config['column_table'][title]['title'] + '" class="down"><span>' + title + '</span></th>';
        } else {
            html += '<th data-order="' + config['column_table'][title]['title'] + '"    class="up"><span>' + title + '</span></th>';
        }
    }





    html += '<th>Подчиненные</th><th>Анкета</th></thead>';



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

    document.getElementById('total_count').innerHTML = count;

   // document.getElementById("pag").innerHTML = paginations;
    Array.prototype.forEach.call(document.querySelectorAll(" .pag-wrap"), function(el) {
        el.innerHTML = paginations
    })


    html += '<tbody>'
    for (var i = 0; i < list.length; i++) {
        var id_parent_subordinate = list[i]['id'];
        var list_fields = list[i].fields;


        if(!list_fields) continue

      if(   typeof list_fields === 'undefined') {
          console.log('Нету fields для  ID:  ' + id_parent_subordinate)
        }

        tbody += '<tr>';



        for(  var prop in config['column_table']  ){
            if( prop in list_fields) {



            if (prop == 'Facebook'  &&  config['column_table']['Facebook'] && config['column_table']['Facebook']['active']   ) {
                if (list_fields[prop]['value']) {
                    tbody += '<td><a class="facebook" href="' + list_fields[prop]['value'] + '">facebook</a></td>'
                } else {
                    tbody += '<td data-model="' + prop + '">&nbsp;</td>'
                }

            }
            if (!list_fields.hasOwnProperty(prop) || prop == 'id' || prop == 'Facebook') continue
            if ( /*common.indexOf(prop) === -1   || */( !config['column_table'][prop]['active'] && config['column_table'][prop]['editable'] ) ) continue
            tbody += '<td  data-model="' + prop + '" data-type="' + list_fields[prop]['id'] + '">' + list_fields[prop]['value'] + '</td>';
            }
        }

    

        tbody += '<td><a href="#" class="subordinate" data-id="' + id_parent_subordinate + '">подчиненные</a></td>';
        tbody += '<td><a href="' + config.DOCUMENT_ROOT + '/account/' + id_parent_subordinate + '" class="questionnaire" data-id="' + id_parent_subordinate + '">анкета</a></td>'

    }
    html += '</tbody>'
    html += '</table>';

    document.querySelector(".table-wrap .table").innerHTML = html;
    document.querySelector(".table-wrap .table tbody").innerHTML = tbody;
    document.querySelector(".query-none p").innerHTML=''
    document.getElementsByClassName('preloader')[0].style.display = 'none'
    Array.prototype.forEach.call(document.querySelectorAll(" .pag li"), function(el) {
        el.addEventListener('click', function() {

            var data = search;
            data['page'] = el.innerHTML;
            createUser(data);


        });
    });
   


    Array.prototype.forEach.call(document.querySelectorAll(".subordinate"), function(el) {
        el.addEventListener('click', getsubordinates);
    });

    

    /* Navigation*/

    Array.prototype.forEach.call(document.querySelectorAll(".arrow"), function(el) {
        el.addEventListener('click', function() {
            var page 
            var data = search;
            if(  this.parentElement.classList.contains('prev')  ){
            page = parseInt( document.querySelector(".pag li.active").innerHTML ) > 1 ? parseInt( document.querySelector(".pag li.active").innerHTML ) -1 : 1
            data['page'] = page
            createUser(data);
            }else{
                
                page = parseInt( document.querySelector(".pag li.active").innerHTML ) !=  pages ? parseInt( document.querySelector(".pag li.active").innerHTML )  + 1 : pages
                  data['page'] = page
            createUser(data);
            }

        })
    });

    Array.prototype.forEach.call(document.querySelectorAll(".double_arrow"), function(el) {
        el.addEventListener('click', function() {
            var data = search;
            if(  this.parentElement.classList.contains('prev')  ){
            
            data['page'] = 1
            createUser(data);
            }else{
                
            data['page'] = pages
            createUser(data);
            }


        })
    });

    //Cортировка


    Array.prototype.forEach.call(document.querySelectorAll(".table-wrap   th"), function(el) {
        el.addEventListener('click', function() {
            var data_order = this.getAttribute('data-order');
            //  var status = ordering[data_order] = ordering[data_order] ? false : true
            var status = false;
            if (ordering[data_order]) {
                status = false;
            } else {
                status = true
            }
            ordering = {};
            ordering[data_order] = status

            data_order = status ? data_order : '-' + data_order;
            var  page = document.querySelector(".pag li.active")  ? parseInt( document.querySelector(".pag li.active").innerHTML ) : 1

            var data = {

                'ordering': data_order,
                'page': page
            }

 
            createUser(data)
        });
    })

 
}

function createUser(data){
    var path = config.DOCUMENT_ROOT + 'api/users/?'
    var data = data ||  {}

    var search = document.getElementsByName('fullsearch')[0].value;
    if(search && !data['sub']){
        data['search'] = search;
    }
    document.getElementsByClassName('preloader')[0].style.display = 'block'
    ajaxRequest(path, data, function(answer) {
      //  document.getElementsByClassName('preloader')[0].style.display = 'block'
        createUserInfoBySearch(answer, data)
    })
}

//Получение подчиненных
function getsubordinates(e) {
    e.preventDefault();
    document.getElementsByName('fullsearch')[0].value = ''
    var id = this.getAttribute('data-id');
    createUser({
        'master': id
    });
    window.parent_id = id;

}


