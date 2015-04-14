var app = angular.module("app", ['ngRoute']);
var controllers = {};

controllers.HeaderController = function ($scope, $location){
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.url();
	};
}

controllers.SimpleController = function($scope, $location){
	$scope.customers = 
	[{name : 'Dave Adams' ,  city : 'Phoenix'} , 
	{name: 'Brad Baker' , city : 'Portland'} , 
	{name : 'Steve Cowls' , city : 'Houston'} , 
	{name : 'Kyle Davis' , city : 'Boston'} , 
	{name :'Robert Evans' , city : 'Boise'}]

	$scope.addCustomer = function () {	
		$scope.customers.push(
			{
				name: $scope.newCustomer.name,
				city: $scope.newCustomer.city
			});
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
		geocoder.geocode({ 'address' : $scope.calculate.From}, function(results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				origin = results[0].geometry.location.k + "," + results[0].geometry.location.D;
			} else if (status == "ZERO_RESULTS") {
				$scope.distance = "No results found, please try again.";
				$scope.$apply();
			} else {
				alert("There was an error!" + " " + status);
			}
		geocoder.geocode ( { 'address' : $scope.calculate.To}, function (results, status){
			if (status == google.maps.GeocoderStatus.OK) {
				destination = results[0].geometry.location.k + "," + results[0].geometry.location.D;
				getDistance();		
			} else if (status == "ZERO_RESULTS") {
				$scope.distance = "No results found, please try again.";
				$scope.$apply();	
			} else {
				alert("There was an error!" + " " + status);
			}
		});
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
			$scope.distance = response.rows[0].elements[0].distance.text;
			$scope.duration = response.rows[0].elements[0].duration.text;
			console.log(response.rows[0]);
			$scope.$apply();
		} else {
			alert("There was an error!" + " " + status);
		}
	}	
		}	
	}	
}

function myCtrl($scope, $window){
	$scope.module = {};
	$scope.module.group = {};
	$scope.module.group.items = [
	{name:'Sunny'},
	{name:'Mark'},
	{name:'John'},
	];
	$scope.openCategory = function($event, name) {
		$window.alert("Called " + name);
	}
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
	.otherwise({ 
		redirectTo: 'view1' 
	});
});