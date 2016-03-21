$(document).ready(function(){
	$("#datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date()
    }).datepicker("setDate", '-1m');


    $("#datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
    }).datepicker("setDate", new Date());

    makeTabs (); 

    $('body').on('click', '.tab-status li', function() {
    	if ($('.tab-status a[href="#overdue"]').parent().hasClass('current')) {
			$('.period').show();
		} else {
			$('.period').hide();
		} 
    });


    
      
})

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