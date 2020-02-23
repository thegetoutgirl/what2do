//var queryURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4&libraries=places";

var placeID;
var placeLat;
var placeLong;

$("#searchBtn").on("click", function() {
    event.preventDefault();
    var userCity = $("#cityInput").val().trim();
    var userEvent = $("#eventInput").val().trim();
    var yelpURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + userEvent + "&location=" + userCity + "&limit=5";
    var getPlaceIdURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + userCity + "&inputtype=textquery&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
    $.ajax({
        url: yelpURL,
        method: "GET",
        headers: {
            Authorization: "Bearer l4dXS90kQrRBL2LozspYQ6nqfKa1tcrm7lgZuh3sGm7pFPp4cMPhbFqtZDuB9OqgrAvFbnrDGoDfrGJWTqquDaNQiHdvU1XWKPVMtkFvghvKFFVr7NNrwOkPUl9NXnYx",
        },
        dataType: "json"
    }).then(function(response) {
        console.log(response);
        $("#yelpCard").empty();
        var newPlace = response.businesses;
        var placeArr = [];
        for (var i = 0; i < newPlace.length; i++) {
            placeArr.push({lat: newPlace[i].coordinates.latitude, lng: newPlace[i].coordinates.longitude});
            
            var newCard = $("<div>").addClass("card sticky-action");
            var newCardImage = $("<div>").addClass("card-image waves-effect waves-block waves-light");
            var newCardTitle = $("<span>").addClass("card-title activator");
            var newCardContent = $("<div>").addClass("card-content");
            var newCardReveal = $("<div>").addClass("card-reveal");
            var newCardAction = $("<div>").addClass("card-action");
            if (newPlace[i].image_url !== "") {
                newCardImage.append($("<img src=" + newPlace[i].image_url + ">").addClass("activator"));
                //console.log($("#yelpCard .card-image").width);
                //console.log($("#yelpCard .card-image").hight);
            } else {
                newCardImage.append($("<img src=https://cdn.worldvectorlogo.com/logos/yelp-icon.svg>").addClass("activator").css({"width": "35%", "height": "35%"}));
            }
            newCardTitle.text(newPlace[i].name).append(($("<i>").addClass("fas fa-ellipsis-v right")));
            newCardContent.append(newCardTitle);
            var tempString = "";
            for (var j = 0; j < newPlace[i].categories.length; j++) {
                tempString += newPlace[i].categories[j].title;
                if (j !== newPlace[i].categories.length - 1) {
                    tempString += ", ";
                }
            }
            newCardContent.append($("<p>").text(tempString));

            newCardReveal.append($("<span>").addClass("card-title grey-text text-darken-4").text(newPlace[i].name).append($("<i>").addClass("fas fa-times right")));
            newCardReveal.append($("<p>").text(newPlace[i].location.display_address[0] + " " + newPlace[i].location.display_address[1]));
            newCardReveal.append($("<p>").text(newPlace[i].display_phone));
            newCardAction.append($("<a href=" + newPlace[i].url + ">").attr("target", "_blank").text("Website"));

            newCard.append(newCardImage, newCardContent, newCardReveal, newCardAction);
            $("#yelpCard").append(newCard);
        }
        initMap(placeArr)
    });
    
    $.ajax({
        url: getPlaceIdURL,
        method: "GET",
    }).then(function(getID) {
        placeID = getID.candidates[0].place_id;
        var getLatLongURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
        
        $.ajax({
            url: getLatLongURL,
            method: "GET"
        }).then(function(googleDetail) {
            //console.log(googleDetail);
            placeLat = googleDetail.result.geometry.location.lat;
            placeLong = googleDetail.result.geometry.location.lng;
            
            var googleURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + placeLat + "," + placeLong + "&radius=1500&type=" + userEvent + "&keyword=" + userEvent + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
            $.ajax({
                url: googleURL,
                method: "GET",
            }).then(function(nearbyPlace) {
                //console.log(nearbyPlace);
                $("#googleCard").empty();
                var newPlace = nearbyPlace.results;
                var placeArr = [];
                for (var i = 1; i < newPlace.length; i++) {
                    placeArr.push({lat: newPlace[i].geometry.location.lat, lng: newPlace[i].geometry.location.lng});
                    
                    var getSinglePlaceURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + newPlace[i].place_id + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
                    $.ajax({
                        url: getSinglePlaceURL,
                        method: "GET"
                    }).then(function(details) {
                        //console.log(details);
                        var newDetails = details.result;
                        var newCard = $("<div>").addClass("card sticky-action");
                        var newCardImage = $("<div>").addClass("card-image waves-effect waves-block waves-light");
                        var newCardTitle = $("<span>").addClass("card-title activator");
                        var newCardContent = $("<div>").addClass("card-content");
                        var newCardReveal = $("<div>").addClass("card-reveal");
                        var newCardAction = $("<div>").addClass("card-action");

                        newCardTitle.text(newDetails.name).append(($("<i>").addClass("fas fa-ellipsis-v right")));
                        newCardContent.append(newCardTitle);
                        var tempString = "";
                        for (var j = 0; j < newDetails.types.length; j++) {
                            tempString += newDetails.types[j];
                            if (j !== newDetails.types.length - 1) {
                                tempString += ", ";
                            }
                        }
                        newCardContent.append($("<p>").text(tempString));
            
                        newCardReveal.append($("<span>").addClass("card-title grey-text text-darken-4").text(newDetails.name).append($("<i>").addClass("fas fa-times right")));
                        newCardReveal.append($("<p>").text(newDetails.formatted_address));
                        newCardReveal.append($("<p>").text(newDetails.formatted_phone_number));
                        newCardAction.append($("<a href=" + newDetails.website + ">").attr("target", "_blank").text("Website"));
            
                        newCard.append(newCardImage, newCardContent, newCardReveal, newCardAction);
                        $("#googleCard").append(newCard);
                        //initMap(placeArr)
                        
                    });
                }
                         
                
            });
        });
    });
    
});



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


// $(document).on("click", ".card-reveal", function(event) {
//     event.stopPropagation();
//     $(this).find("> .card-title").trigger("click");
//     return false;
// });

