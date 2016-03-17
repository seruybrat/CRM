$(function(){
	//createUser({'master':user_id}) ;
	createUser() ;

	 $('input[name="fullsearch"]').keyup(function() {

        delay(function() {
            createUser()
        }, 2500);



    });
});


var ordering = {}
var parent_id = null

function createUserInfoBySearch(data, search) {


    var count = data.count;
    var data = data.results;
    var tbody = '';

    var page = search.page || 1;
  // var full = search.my_sub_list ? 'notfullsearch' : ''
   var full = ''
 
    var list = data;
    var html = '<table class="tab1 search ' + full + '" id="userinfo">';
    if (data.length == 0) {
        document.querySelector(".table-wrap").innerHTML = 'по запросу не найдено участников';
       // document.querySelector(".lineTabs").innerHTML = '';
        return;
    }

    var titles = Object.keys(data[0].fields);
    var common_ = list[0]['common']
    var common = Object.keys(list[0]['common']);
    html += '<thead>';

    for (var k = 0; k < titles.length; k++) {
        if (common.indexOf(titles[k]) === -1) continue

        if (ordering[common_[titles[k]]]) {
            html += '<th data-order="' + common_[titles[k]] + '" class="low"><span>' + titles[k] + '</span></th>';
        } else {
            html += '<th data-order="' + common_[titles[k]] + '"><span>' + titles[k] + '</span></th>';
        }

    }
    html += '<th></th><th></th></thead>';

    //paginations
   // var paginations = '<li>Найдено ' + count + ' пользователей</li>';
   var paginations = ''
    var pages = Math.ceil(count / config.pagination_count);

    if (pages > 1) {
        for (var j = 1; j < pages + 1; j++) {
            if (j == page) {
                paginations += '<li class="active">' + j + '</li>'
            } else {
                paginations += '<li>' + j + '</li>'
            }

        }
    }


	document.getElementById('total_count').innerHTML = count;

   // document.getElementById("pag").innerHTML = paginations;
    [].forEach.call(document.querySelectorAll(" .pag"), function(el) {
    	el.innerHTML = paginations
    })


    html += '<tbody>'
    for (var i = 0; i < list.length; i++) {
        var id_parent_subordinate = list[i]['id'];
        var list_fields = list[i].fields;

        tbody += '<tr>';
        for (var prop in list_fields) {


            if (prop == 'Facebook') {
                if (list_fields[prop]['value']) {
                    tbody += '<td><a class="facebook" href="' + list_fields[prop]['value'] + '">facebook</a></td>'
                } else {
                    tbody += '<td>&nbsp;</td>'
                }

            }
            if (!list_fields.hasOwnProperty(prop) || prop == 'id' || prop == 'Facebook') continue
            if (common.indexOf(prop) === -1) continue
            tbody += '<td  data-model="' + prop + '" data-type="' + list_fields[prop]['id'] + '">' + list_fields[prop]['value'] + '</td>';

        }
        tbody += '<td><a href="#" class="subordinate" data-id="' + id_parent_subordinate + '">подчиненные</a></td>';
        tbody += '<td><a href="' + config.DOCUMENT_ROOT + '/account/' + id_parent_subordinate + '" class="questionnaire" data-id="' + id_parent_subordinate + '">анкета</a></td>'

    }
    html += '</tbody>'
    html += '</table>';

    document.querySelector(".table-wrap").innerHTML = html;
    document.querySelector(".table-wrap tbody").innerHTML = tbody;


    [].forEach.call(document.querySelectorAll(" .pag li"), function(el) {
        el.addEventListener('click', function() {

            var data = search;
            data['page'] = el.innerHTML;
            createUser(data);


        });
    });
   


    [].forEach.call(document.querySelectorAll(".subordinate"), function(el) {
        el.addEventListener('click', getsubordinates);
    });




    //Переробить сортировку
/*

    [].forEach.call(document.querySelectorAll(".tab_content   th"), function(el) {
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
            var  page = document.querySelector("span.page.active")  ? parseInt(document.querySelector("span.page.active").innerHTML) : 1

            var data = {

                'ordering': data_order,
                'page': page
            }

 
            createUser(data)
        });
    })
*/
 
}

function createUser(data){
    var path = config.DOCUMENT_ROOT + 'api/users/?'
    var data = data ||  {}

    var search = document.getElementsByName('fullsearch')[0].value;
    if(search && !data['sub']){
        data['search'] = search;
    }
    ajaxRequest(path, data, function(answer) {
        createUserInfoBySearch(answer, data)
    })
}


function getsubordinates(e) {
    e.preventDefault();
    //Добавить очистку dropbox

    document.getElementsByName('fullsearch')[0].value = ''
    var id = this.getAttribute('data-id');
    createUser({
        'master': id
    });
    window.parent_id = id;

}