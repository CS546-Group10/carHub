(function($) {

    var map_city = "";
    var myNewTaskForm = $('#myMapForm'),
        myInputMap = $('#mapInput'),
        divMap = $('#mapBOX')

    if (divMap.length != 0) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW1taXN0MDciLCJhIjoiY2t3cGxzdHZ3MDFjbzJvbzJrc2RmdmhhNSJ9.nlLm3a7Oo_wkduLzaTCTsQ';
        const map = new mapboxgl.Map({
            container: 'mapBOX',
            style: 'mapbox://styles/ammist07/ckwr7lotn0oqx14ny64ub4eh8',
            center: [-95.0431, 40.7178],
            zoom: 3
        })
    }
    myNewTaskForm.submit(function(event) {
        event.preventDefault();
        var getCars = {
            method: 'POST',
            url: '/map/car',
            contentType: 'application/json',
            data: JSON.stringify({
                sourceAddress: myInputMap.val(),
            })
        };
        $.ajax(getCars).then(function(dataCars) {
            console.log(dataCars);
            $.each(dataCars, function(i, value) {
                var getLatLong = {
                    method: 'GET',
                    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${value.address.number} ${value.address.street} ${value.address.city} City ${value.address.state} US ${value.address.zip}&key=AIzaSyBxWRrj4Zm1xfOAumL816_I6xRaq0N7qxg`
                };
                $.ajax(getLatLong).then(function(dataLatLang) {
                    var lat = dataLatLang.results[0].geometry.location.lat;
                    var long = dataLatLang.results[0].geometry.location.lng;
                    if (value.cars.length > 0) {
                        var el = document.createElement('div');
                        $(el).text(value.cars.length);
                        $(el).addClass('marker');
                        new mapboxgl.Marker(el)
                            .setLngLat([long, lat])
                            .addTo(map);
                        map.flyTo({
                            center: [long, lat],
                            essential: true,
                            zoom: 14
                        });
                    }
                })
            })
        });



    });



})(window.jQuery);