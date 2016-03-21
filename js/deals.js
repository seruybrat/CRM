$(document).ready(function(){
	$("#datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        /*defaultDate: '-1m',*/
        maxDate: new Date()
    }).datepicker("setDate", '-1m');


    $("#datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
    }).datepicker("setDate", new Date());
})