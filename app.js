//close nav bar onclick for mobile devices
function changePage() {
	if ($(window).width() < 992) {
		$('.navmenu').offcanvas('toggle');
	}
}



var app = angular.module("app", ['ngRoute']);
var controllers = {};

controllers.HeaderController = function ($scope, $location){
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.url();
	};
}

controllers.SimpleController = function($scope){
	$scope.customers = 
	[{name : 'Dave Adams' ,  city : 'Phoenix'} , 
	{name: 'Brad Baker' , city : 'Portland'} , 
	{name : 'Steve Cowls' , city : 'Houston'} , 
	{name : 'Kyle Davis' , city : 'Boston'} , 
	{name :'Robert Evans' , city : 'Boise'}]

	$scope.addCustomer = function () {	
		$scope.customers.push({
				name: $scope.newCustomer.name,
				city: $scope.newCustomer.city
		});
	}
}

controllers.NewController = function($scope){
	
	$scope.add = "false";
	$scope.readOnly = true;
		
	$scope.customers = 
	[{
	firstname : 'Dave' , 
	lastname: 'Adams' ,  
	city : 'Phoenix' ,
	state : 'Arizona'
	} , {
	firstname: 'Brad' , 
	lastname: 'Baker' , 
	city : 'Portland' ,
	state : 'Oregon'
	} , {
	firstname : 'Steve' , 
	lastname: 'Cowls' , 
	city : 'Houston' ,
	state: 'Texas'
	} , {
	firstname: 'Kyle' , 
	lastname: 'Davis' , 
	city: 'Boston' ,
	state: 'Massachusets'
	} , {
	firstname: 'Robert' , 
	lastname: 'Evans' , 
	city: 'Boise' ,
	state: 'Idaho'
	}];
	
	$scope.thing = function(index){
		$scope.selected = 0;
		$scope.selected = index;
		$scope.showView = true;	
		$scope.editCity = $scope.customers[index].city;
		$scope.editState = $scope.customers[index].state;
		$scope.editFirstName = $scope.customers[index].firstname;
		$scope.editLastName = $scope.customers[index].lastname;
		$scope.isClicked = false;
		$scope.notClicked = true;
		$scope.showButton = false;
		$scope.add = "false";
		$scope.readOnly = true;
	}
	
	
	$scope.addNew = function(){
		$scope.selected = null;
		$scope.add = "true";
		$scope.editCity = "";
		$scope.editState = "";
		$scope.editFirstName = "";
		$scope.editLastName = "";
		$scope.notClicked = false;
		$scope.isClicked = true;
		$scope.showButton = true
		$scope.showView = true;
		$scope.readOnly = false;
		
	}
	
	$scope.saveClick = function(){
		if ($scope.add = "true"){
			$scope.customers.push({
			firstname: $scope.editFirstName,
			lastname: $scope.editLastName,
			city: $scope.editCity,
			state: $scope.editState
			});
			$scope.notClicked = true;
			$scope.isClicked = false;
			$scope.showView = false;
			$scope.showButton = false;
			$scope.readOnly = true
		} else {
			alert("Working!")
		}
	}
	
	$scope.remove = function(index){
		console.log(index)
		console.log($scope.customers[index])
		$scope.customers.splice(index, 1);
	}
		
	
}

controllers.NavController = function($scope){
	$scope.currentLocation = function(){
		navigator.geolocation.getCurrentPosition(GetLocation);
		function GetLocation(location){
			$scope.calculate.From = location.coords.latitude + "," + location.coords.longitude;
			$scope.$apply();
		}
	}
	
	$scope.calculate = function (){	
		var geocoder = new google.maps.Geocoder();
		var process = new google.maps.DistanceMatrixService();
		var origin;
		var destination;
		var originDisp;
		var destinationDisp;
		geocoder.geocode({ 'address' : $scope.calculate.From}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				origin = results[0].geometry.location.A + "," + results[0].geometry.location.F;
				console.log(results)
				originDisp = results[0].formatted_address;
			} else if (status == "ZERO_RESULTS") {
				$scope.distance = "No results found, please try again.";
				$scope.duration = "";
				$scope.$apply();
			} else {
				alert("There was an error!" + " " + status);
			}
		geocoder.geocode ( { 'address' : $scope.calculate.To}, function (results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				destination = results[0].geometry.location.A + "," + results[0].geometry.location.F;
				destinationDisp = results[0].formatted_address;
				getDistance();		
			} else if (status == "ZERO_RESULTS") {
				$scope.distance = "No results found, please try again.";
				$scope.duration = "";
				$scope.$apply();	
			} else {
				alert("There was an error!" + " " + status);
			}
		});
		$scope.calculate.From = "";
		$scope.calculate.To = "";
	});
	
	function getDistance(){
		process.getDistanceMatrix({
			origins: [origin],
			destinations: [destination],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
		}, callback);
		
	function callback(response, status){
		if (status == google.maps.DistanceMatrixStatus.OK){
			$("#distText").html("<b>Distance from " + originDisp + " to " + destinationDisp +":</b>");
			$scope.distance = response.rows[0].elements[0].distance.text;
			$scope.duration = response.rows[0].elements[0].duration.text;
			$scope.$apply();
			$scope.calculate.From = "";
			$scope.calculate.To = "";
		} else {
			alert("There was an error!" + " " + status);
		}
	}	
		}	
	}	
}

controllers.EventController = function($scope){
	
}

app.controller(controllers);


app.config(function ($routeProvider){
	$routeProvider.when('/view1', {
		controller: 'SimpleController' ,
		templateUrl: 'View1.html'
	})
	.when('/view2', {
		controller: 'SimpleController',
		controller: 'NavController',
		templateUrl: 'View2.html'	
	})
	.when('/view3', {
		controller: 'NewController',
		templateUrl: 'View3.html'
	})
	.when('/view4', {
		controller: 'EventController',
		templateUrl: 'View4.html'
	})
	.otherwise({ 
		redirectTo: 'view1' 
	});
});
