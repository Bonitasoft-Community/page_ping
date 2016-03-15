'use strict';
/**
 *
 */

(function() {


var appCommand = angular.module('pingmonitor', ['googlechart', 'ui.bootstrap']);






// --------------------------------------------------------------------------
//
// Controler Ping
//
// --------------------------------------------------------------------------

// Ping the server
appCommand.controller('PingControler',
	function ( $http, $scope ) {

	this.pingdate='';
	this.pinginfo='';
	$('#collectwait').hide();
	this.ping = function()
	{
		$('#collectbtn').hide();
		$('#collectwait').show();
		this.pinginfo="Hello";
		
		var self=this;

		$http.get( '?page=custompage_ping&action=ping' )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.pingdate 		= jsonResult.pingcurrentdate;
						self.pinginfo 		= jsonResult.pingserverinfo;
						self.listprocesses	= jsonResult.listprocesses;
						self.listusers		= jsonResult.listusers;
						$scope.chartObject		 	= JSON.parse(jsonResult.chartObject);
								
						$('#collectbtn').show();
						$('#collectwait').hide();
				})
				.error( function() {
					alert('an error occure');
						$('#collectbtn').show();
						$('#collectwait').hide();
					});
				
	}



});



})();