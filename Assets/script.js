//Setting globals
var placeID;
var placeLat;
var placeLong;

//When search button is clicked start everything
$("#searchBtn").on("click", function() {
    var placeArr = [];
    event.preventDefault();
    var userCity = $("#cityInput").val().trim();
    var userEvent = $("#eventInput").val().trim();
    //Yelp api - term = userEvent, location = userCity
    var yelpURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + userEvent + "&location=" + userCity + "&limit=10";
    $.ajax({
        url: yelpURL,
        method: "GET",
        headers: {
            Authorization: "Bearer l4dXS90kQrRBL2LozspYQ6nqfKa1tcrm7lgZuh3sGm7pFPp4cMPhbFqtZDuB9OqgrAvFbnrDGoDfrGJWTqquDaNQiHdvU1XWKPVMtkFvghvKFFVr7NNrwOkPUl9NXnYx",
        },
        dataType: "json"
    }).then(function(response) {
        //console.log(response);
        $("#yelpCard").empty();
        var newPlace = response.businesses;
        //var placeArr = [];
        //Each item in the array is a different location 
        for (var i = 0; i < newPlace.length; i++) {
            //Updating map with Yelp location - setting each item in an array to an object with lat, long coordinates
            placeArr.push({lat: newPlace[i].coordinates.latitude, lng: newPlace[i].coordinates.longitude});
            
            //Crating the card tags for materialize
            var newCard = $("<div>").addClass("card sticky-action");
            var newCardImage = $("<div>").addClass("card-image waves-effect waves-block waves-light");
            var newCardTitle = $("<span>").addClass("card-title activator");
            var newCardContent = $("<div>").addClass("card-content");
            var newCardReveal = $("<div>").addClass("card-reveal");
            var newCardAction = $("<div>").addClass("card-action");

            //if there is no image then use a placeholder image of yelp's logo
            if (newPlace[i].image_url !== "") {
                newCardImage.append($("<img src=" + newPlace[i].image_url + ">").addClass("activator"));
            } else {
                newCardImage.append($("<img src=https://cdn.worldvectorlogo.com/logos/yelp-icon.svg>").addClass("activator").css({"width": "35%", "height": "35%"}));
            }

            //Adds a icon to the clickable title section of the card
            newCardTitle.text(newPlace[i].name).append(($("<i>").addClass("fas fa-ellipsis-v right")));
            newCardContent.append(newCardTitle);

            //Creates a sub-title based on the tags used by yelp - each item is seperated by a comma
            var tempString = "";
            for (var j = 0; j < newPlace[i].categories.length; j++) {
                tempString += newPlace[i].categories[j].title;
                //If the tag is the last one then do not add a comma after it
                if (j !== newPlace[i].categories.length - 1) {
                    tempString += ", ";
                }
            }
            newCardContent.append($("<p>").text(tempString));
            //What appears when the card is clicked - the address and the phone number 
            newCardReveal.append($("<span>").addClass("card-title grey-text text-darken-4").text(newPlace[i].name).append($("<i>").addClass("fas fa-times right")));
            newCardReveal.append($("<p>").text(newPlace[i].location.display_address[0] + " " + newPlace[i].location.display_address[1]));
            newCardReveal.append($("<p>").text(newPlace[i].display_phone));
            //Clickable website link that opens in the new tab - locked in place on the card so it will always be visible
            newCardAction.append($("<a href=" + newPlace[i].url + ">").attr("target", "_blank").text("Website"));
            //Appending every section to the parent section of "card"
            newCard.append(newCardImage, newCardContent, newCardReveal, newCardAction);
            //Then appending that card to the page
            $("#yelpCard").append(newCard);
        }
    });
    
    //Triple nested ajax call
    //Google api place/findplacefromtext - input = userCity
    //From the user inputted city, getting the unique place id google assigns
    var getPlaceIdURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + userCity + "&inputtype=textquery&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
    $.ajax({
        url: getPlaceIdURL,
        method: "GET",
    }).then(function(getID) {
        //Setting the place id to the global variable "placeID"
        placeID = getID.candidates[0].place_id;

        //Google api place/details - place_id = placeID
        //From the placeID, getting the latitude and longitude that are required parameters for the next ajax call
        var getLatLongURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
        $.ajax({
            url: getLatLongURL,
            method: "GET"
        }).then(function(googleDetail) {
            //setting the latitude and longitude of the user inputted city
            placeLat = googleDetail.result.geometry.location.lat;
            placeLong = googleDetail.result.geometry.location.lng;
            
            //Google api place/nearbysearch - location = placeLat, placeLong, type = userEvent, keyword = userEvent
            //Gets 20 (default) nearby places that are based on the user inputted event
            var googleURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + placeLat + "," + placeLong + "&radius=1500&type=" + userEvent + "&keyword=" + userEvent + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";
            $.ajax({
                url: googleURL,
                method: "GET",
            }).then(function(nearbyPlace) {
                //Clears the card for every new search
                $("#googleCard").empty();
                var newPlace = nearbyPlace.results;
                //var placeArr = [];
                //Each item in the array is a different nearby location
                for (var i = 1; i < newPlace.length; i++) {
                    //Updating map with Google location - setting each item in an array to an object with lat, long coordinates
                    placeArr.push({lat: newPlace[i].geometry.location.lat, lng: newPlace[i].geometry.location.lng});
                    
                    //Google api place/detail - place_id = newPlace[i].place_id
                    var getSinglePlaceURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + newPlace[i].place_id + "&key=AIzaSyAYqUyaFCNKimpVDjKqBasRC8hzcPWn4r4";

                    //Ajax call inside the for loop as we need the placeID from each nearby location
                    $.ajax({
                        url: getSinglePlaceURL,
                        method: "GET"
                    }).then(function(details) {
                        var newDetails = details.result;

                        //Creating the cards for materialize
                        var newCard = $("<div>").addClass("card sticky-action");
                        var newCardImage = $("<div>").addClass("card-image waves-effect waves-block waves-light");
                        var newCardTitle = $("<span>").addClass("card-title activator");
                        var newCardContent = $("<div>").addClass("card-content");
                        var newCardReveal = $("<div>").addClass("card-reveal");
                        var newCardAction = $("<div>").addClass("card-action");

                        //Adds an icon to the clickible title section of the card
                        newCardTitle.text(newDetails.name).append(($("<i>").addClass("fas fa-ellipsis-v right")));
                        newCardContent.append(newCardTitle);

                        //Creates a sub-title with the tags Google list for the specific place
                        var tempString = "";
                        for (var j = 0; j < newDetails.types.length; j++) {
                            tempString += newDetails.types[j];
                            //If the tag is the last one then do not add a comma after it
                            if (j !== newDetails.types.length - 1) {
                                tempString += ", ";
                            }
                        }
                        newCardContent.append($("<p>").text(tempString));
                        //What appears when the card is clicked - the address and the phone number 
                        newCardReveal.append($("<span>").addClass("card-title grey-text text-darken-4").text(newDetails.name).append($("<i>").addClass("fas fa-times right")));
                        newCardReveal.append($("<p>").text(newDetails.formatted_address));
                        newCardReveal.append($("<p>").text(newDetails.formatted_phone_number));
                        //Clickable website link that opens in the new tab - locked in place on the card so it will always be visible
                        newCardAction.append($("<a href=" + newDetails.website + ">").attr("target", "_blank").text("Website"));
                        //Appending every section to the parent section of "card"
                        newCard.append(newCardImage, newCardContent, newCardReveal, newCardAction);
                        //Then appending that card to the page
                        $("#googleCard").append(newCard);
                        
                    });
                }
                //Calls the map function each element of the array is a coordinate of a place - includes both Yelp and Google results
                initMap(placeArr);
            });
        });
    });
});

//Creates a map
function initMap(places) {
    $("#map").empty();
    //Centers the map based on the first element of the array
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: places[0]});
    //Each element of the array is an object containing latitude and longitude 
    for (var i = 0; i < places.length; i++) {
        //newSpot is set to the object
        var newSpot = places[i]; 
        var bounds = new google.maps.LatLngBounds(newSpot);
        //The marker is set based on the coordinates
        var marker = new google.maps.Marker({position: newSpot, map: map});
    }
}
