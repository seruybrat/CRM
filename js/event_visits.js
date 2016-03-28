
$(document).ready(function(){



  var owl =   $('.owl-carousel').owlCarousel({
            loop:false,
            margin:10,
            nav:false,
            responsive:{
                0:{
                    items:2
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }

    });



$(".prev_item").click(function () {
    owl.trigger('prev.owl.carousel');
});

$(".next_item").click(function () {
    owl.trigger('next.owl.carousel');
});



 $("#done_datepicker_from").datepicker({
        dateFormat: "yy-mm-dd",
        maxDate: new Date(),
        onSelect: function(date) {
           console.log(date)
        }
    }).datepicker("setDate", '-1m');

    $("#done_datepicker_to").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date) {
           console.log(date)
        }
    }).datepicker("setDate", new Date());




 Array.prototype.forEach.call(document.querySelectorAll("#corousel_wrap [data-event-id]"), function(el) {
    el.addEventListener('click', function(){
        Array.prototype.forEach.call(document.querySelectorAll("#corousel_wrap [data-event-id]"), function(el) {
            el.classList.remove('active_item')
        })
        this.classList.add('active_item');
    })
 })




document.getElementById('sort_save').addEventListener('click', function() {
        updateSettings();
        $(".table-sorting").animate({
            right: '-300px'
        }, 10, 'linear')
    })
})

