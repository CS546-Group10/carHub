(function($) {

    var map_city = "";
    var myNewTaskForm = $('#filter-form-map')

    myNewTaskForm.submit(function(event) {

        map_city = $('#filter-city').val();
    });
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1taXN0MDciLCJhIjoiY2t3cGxzdHZ3MDFjbzJvbzJrc2RmdmhhNSJ9.nlLm3a7Oo_wkduLzaTCTsQ';
    const map = new mapboxgl.Map({
        container: 'mapBOX', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    var requestConfig = {
        method: 'POST',
        url: '/map/car',
        contentType: 'application/json',
        data: JSON.stringify({
            sourceAddress: "Jersey",
        })
    };
    $.ajax(requestConfig).then(function(responseMessage) {
        console.log(responseMessage);
    });


})(window.jQuery);