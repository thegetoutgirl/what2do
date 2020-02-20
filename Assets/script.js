//var queryURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4&libraries=places";
//var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJrTLr-GyuEmsRBfy61i59si0&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4"

var yelpURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Dining&location=Philadelphia&limit=5";

$.ajax({
    url: yelpURL,
    method: "GET",
    headers: {
        Authorization: "Bearer l4dXS90kQrRBL2LozspYQ6nqfKa1tcrm7lgZuh3sGm7pFPp4cMPhbFqtZDuB9OqgrAvFbnrDGoDfrGJWTqquDaNQiHdvU1XWKPVMtkFvghvKFFVr7NNrwOkPUl9NXnYx",
    },
    dataType: "json",
}).then(function(response) {
    console.log(response);
    var newPlace = response.businesses;
    var placeArr = [];
    for (var i = 0; i < newPlace.length; i++) {
        placeArr.push({lat: newPlace[i].coordinates.latitude, lng: newPlace[i].coordinates.longitude});
        var newUL = $("<ul>").attr("class", "list-group")
        var newList = $("<li>").attr("class", "list-group-item");
        var newName = $("<p>").text(newPlace[i].name);
        var newImage = $("<img src=" + newPlace[i].image_url + ">").css({"width": "10%", "height": "10%"});
        var newURL = $("<a href=" + newPlace[i].url + ">").attr("target", "_blank").text("Website");
        newList.append(newName, newImage, newURL);
        newUL.append(newList);
        $("#restaurantCard").append(newUL);
    }
    initMap(placeArr)
});

// $.ajax({
//     url: queryURL,
//     method: "GET",
// }).then(function(google) {
//     console.log(google);
// });

function initMap(places) {
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: places[0]});
    for (var i = 0; i < places.length; i++) {
        var newSpot = places[i];
        var bounds = new google.maps.LatLngBounds(newSpot);
        var marker = new google.maps.Marker({position: newSpot, map: map});
        //marker.fitBounds(bounds);
        //bounds.extend(marker.newSpot);
    }
    //map.fitBounds(bounds);
}


