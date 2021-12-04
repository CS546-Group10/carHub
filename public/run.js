(function($) {

    var map_city = "";
    var myNewTaskForm = $('#myMapForm'),
        myInputMap = $('mapInput');

    var map = L.map('mapBOX').setView([40.7178, -74.0431], 10);
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW1taXN0MDciLCJhIjoiY2t3cGxzdHZ3MDFjbzJvbzJrc2RmdmhhNSJ9.nlLm3a7Oo_wkduLzaTCTsQ'
    }).addTo(map);
    // L.marker([40.7178, -74.0431]).addTo(map);

    myNewTaskForm.submit(function(event) {
        event.preventDefault();
        var requestConfig = {
            method: 'POST',
            url: '/map/car',
            contentType: 'application/json',
            data: JSON.stringify({
                sourceAddress: myInputMap.val(),
            })
        };
        $.ajax(requestConfig).then(function(responseMessage) {
            console.log(responseMessage);
        });
        L.marker([40.7178, -74.0431]).addTo(map)

    });



})(window.jQuery);