  //Проверка существование элемента на странице
  function isElementExists(element) {
      if (typeof(element) != 'undefined' && element != null) {
          return true;
      }
  }


  var delay = (function() {
      var timer = 0;
      return function(callback, ms) {
          clearTimeout(timer);
          timer = setTimeout(callback, ms);
      };
  })();


  //реализация jquery live event
  function live(eventType, elementQuerySelector, cb) {
      document.addEventListener(eventType, function(event) {

          var qs = document.querySelectorAll(elementQuerySelector);
          if (qs) {
              var el = event.target,
                  index = -1;
              while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                  el = el.parentElement;
              }
              if (index > -1) {
                  cb.call(el, event);
              }
          }
      });
  }

  //Счетчик уведомлений
  function counterNotifications() {
      ajaxRequest(config.DOCUMENT_ROOT+'api/notifications/today/', null, function(data) {
          document.getElementById('count_notifications').innerHTML = '(' + data.count + ')';
      });
  }

  function ajaxRequest(url, data, callback, method, withCredentials, headers, statusCode) {
      var withCredentials = withCredentials === false ? false : true;
      var method = method || 'GET';
      var data = data || {};
      var headers = headers || {};
      statusCode = statusCode || {};
      $.ajax({
          url: url,
          data: data,
          type: method,
          success: callback,
          xhrFields: {
              withCredentials: withCredentials
          },
          statusCode: statusCode,
          headers: headers 
      });
  }


  function ajaxRequest__(url, data, callback, method, withCredentials, headers, statusCode) {
      var withCredentials = withCredentials === false ? false : true;
      var method = method || 'GET';
      var data = data || {};
      var headers = headers || {};
      var statusCode = statusCode || 200;
      var xmlhttp = new XMLHttpRequest();
      var url = url;
/*
      if( method == 'GET' ){
        for( var j in  data){
          if (!data.hasOwnProperty(j)) continue
            url += j + '=' + data[j] + '&';
        }
      }  
*/
      xmlhttp.withCredentials = withCredentials
      xmlhttp.open(method, url, true);

      //headers;
      for (var head in headers) {
          xmlhttp.setRequestHeader(head, headers[head])
      }

      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4) {
              if (xmlhttp.status == statusCode) {
                  callback(JSON.parse(xmlhttp.responseText))

              }
          }
      };
      xmlhttp.send(data);
  }

  function arrClassName(data, answer) {
      for (var i = 0; i < data.length; i++) {
          document.getElementsByClassName(data[i].className)[data[i].index].innerHTML = answer[data[i].dataAtrr];
      }
  }


  function showPopup(text) {
      document.getElementById('popup_text').innerHTML = text
      document.getElementById('popup_div').style.display = 'block'
  }

  function hidePopup() {
      document.getElementById('popup_div').style.display = 'none'
  }



  function createPopups(id,html,callback){
    var popup = document.createElement('div');
    popup.id = id;  
    popup.className = 'popap_wrap';

    var content = document.createElement('div');
    content.className = 'pop_cont';
    content.innerHTML = html;

    var close = document.createElement('span');
    close.className = 'close';
    close.innerHTML = 'x'
    content.appendChild(close);

    popup.appendChild(content);

     document.body.appendChild(popup);
     callback();

  }
  function removePopups(id){
        if(  document.getElementById(id) ){
          document.getElementById(id).parentElement.removeChild(document.getElementById(id))
    }
  }
  function showPopupById(id){
        if(  document.getElementById(id) ){
     document.getElementById(id).style.display = 'block';
   }
    
  }
  function hidePopupById(id){
    if(  document.getElementById(id) ){
     document.getElementById(id).style.display = 'none';
   }
  }


  