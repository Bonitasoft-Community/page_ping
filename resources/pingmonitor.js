'use strict';
/**
 *
 */

(function() {


var appCommand = angular.module('pingmonitor', ['googlechart', 'ui.bootstrap','ngSanitize', 'ngModal']);






// --------------------------------------------------------------------------
//
// Controler Ping
//
// --------------------------------------------------------------------------

// Ping the server
appCommand.controller('PingControler',
	function ( $http, $scope,$sce ) {

	this.pingdate='';
	this.pinginfo='';
	this.listevents='';
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
						self.listevents		= jsonResult.listevents;
						
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

	<!-- properties -->
	this.propsFirstName='';
	this.saveProps = function() {
		var self=this;
		var param={ 'firstname': this.propsFirstName };
					  
		var json= angular.toJson(param, true);
		$http.get( '?page=custompage_ping&action=saveprops&jsonparam='+json )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.listevents		= jsonResult.listevents;
						alert('Properties saved');
				})
				.error( function() {
					alert('an error occure');
					});
	}
	
	this.loadProps =function() {
		var self=this;
		$http.get( '?page=custompage_ping&action=loadprops' )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.propsFirstName = jsonResult.firstname;
						self.listevents		= jsonResult.listevents;

				})
				.error( function() {
					alert('an error occure');
					});
	}
	this.loadProps();

	
	<!-- Manage the event -->
	this.getListEvents = function ( listevents ) {
		return $sce.trustAsHtml(  listevents );
	}
	<!-- Manage the Modal -->
	this.isshowDialog=false;
	this.openDialog = function()
	{
		this.isshowDialog=true;
	};
	this.closeDialog = function()
	{
		this.isshowDialog=false;
	}

});



})();