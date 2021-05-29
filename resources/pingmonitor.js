'use strict';
/**
 *
 */

(function() {


var appCommand = angular.module('pingmonitor', ['googlechart','ui.bootstrap','ngSanitize', 'ngModal', 'ngMaterial', 'toaster', 'ngAnimate', 'ngCookies']); 


/* Material : for the autocomplete
 * need 
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js"></script>

  <!-- Angular Material Library -->
  <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js">
 */



// --------------------------------------------------------------------------
//
// Controler Ping
//
// --------------------------------------------------------------------------

// Ping the server
appCommand.controller('PingControler',
  
	function ( $http, $scope,$sce,$filter, toaster, $cookies  ) { // 

	this.pingdate='';
	this.pinginfo='';
	this.listevents='';
	this.inprogress=false;
	
	this.getHttpConfig = function () {
		var additionalHeaders = {};
		var csrfToken = $cookies.get('X-Bonita-API-Token');
		if (csrfToken) {
			additionalHeaders ['X-Bonita-API-Token'] = csrfToken;
		}
		var config= {"headers": additionalHeaders};
		console.log("GetHttpConfig : "+angular.toJson( config));
		return config;
	}

	this.ping = function()
	{
		
		this.pinginfo="Hello";
		
		var self=this;
		self.inprogress=true;
		// 7.6 : the server force a cache on all URL, so to bypass the cache, then create a different URL
		var d = new Date();
		
		$http.get( '?page=custompage_ping&action=ping&t='+d.getTime(), this.getHttpConfig() )
				.success( function ( jsonResult, statusHttp, headers, config ) {
					// connection is lost ?
					if (statusHttp==401 || typeof jsonResult === 'string') {
						console.log("Redirected to the login page !");
						window.location.reload();
					}
					console.log("history",jsonResult);
					self.pingdate 		= jsonResult.pingcurrentdate;
					self.pinginfo 		= jsonResult.pingserverinfo;
					self.listprocesses	= jsonResult.listprocesses;
					self.listusers		= jsonResult.listusers;
					self.listevents		= jsonResult.listevents;
					
					$scope.chartObject		 	= JSON.parse(jsonResult.chartObject);
	
					self.inprogress=false;
					console.log("toast");
					toaster.pop("success", "Information received", "");
					console.log("toast done");
						
				})
				.error( function() {
					self.inprogress=false;
					});
				
	}


	// -----------------------------------------------------------------------------------------
	//  										Autocomplete
	// -----------------------------------------------------------------------------------------
	this.autocomplete={};
	
	this.queryUser = function(searchText) {
		var self=this;
		console.log("QueryUser HTTP CALL["+searchText+"]");
		
		self.autocomplete.inprogress=true;
		self.autocomplete.search = searchText;
		self.inprogress=true;
		
		var param={ 'userfilter' :  self.autocomplete.search};
		
		var json = encodeURI( angular.toJson( param, false));
		// 7.6 : the server force a cache on all URL, so to bypass the cache, then create a different URL
		var d = new Date();
		
		return $http.get( '?page=custompage_ping&action=queryusers&paramjson='+json+'&t='+d.getTime(), this.getHttpConfig() )
		.then( function ( jsonResult, statusHttp, headers, config ) {
			// connection is lost ?
			if (statusHttp==401 || typeof jsonResult === 'string') {
				console.log("Redirected to the login page !");
				window.location.reload();
			}
			console.log("QueryUser HTTP SUCCESS.1 - result= "+angular.toJson(jsonResult, false));
			self.autocomplete.inprogress=false;
		 	self.autocomplete.listUsers =  jsonResult.data.listUsers;
			console.log("QueryUser HTTP SUCCESS length="+self.autocomplete.listUsers.length);
			self.inprogress=false;
	
			return self.autocomplete.listUsers;
		},  function ( jsonResult ) {
		console.log("QueryUser HTTP THEN");
		});

	  };
	  
	// -----------------------------------------------------------------------------------------
	//  										Excel
	// -----------------------------------------------------------------------------------------

	this.exportData = function () 
	{  
		//Start*To Export SearchTable data in excel  
	// create XLS template with your field.  
		var mystyle = {         
        headers:true,        
			columns: [  
			{ columnid: 'name', title: 'Name'},
			{ columnid: 'version', title: 'Version'},
			{ columnid: 'state', title: 'State'},
			{ columnid: 'deployeddate', title: 'Deployed date'},
			],         
		};  
	
        //get current system date.         
        var date = new Date();  
        $scope.CurrentDateTime = $filter('date')(new Date().getTime(), 'MM/dd/yyyy HH:mm:ss');          
		var trackingJson = this.listprocesses
        //Create XLS format using alasql.js file.  
        alasql('SELECT * INTO XLS("Process_' + $scope.CurrentDateTime + '.xls",?) FROM ?', [mystyle, trackingJson]);  
    };
    

	// -----------------------------------------------------------------------------------------
	//  										Properties
	// -----------------------------------------------------------------------------------------
	this.propsFirstName='';
	this.saveProps = function() {
		var self=this;
		self.inprogress=true;
		
		var param={ 'firstname': this.propsFirstName };
		var json = encodeURI( angular.toJson( param, false));
		
		// 7.6 : the server force a cache on all URL, so to bypass the cache, then create a different URL
		var d = new Date();
		
		$http.get( '?page=custompage_ping&action=saveprops&paramjson='+json +'&t='+d.getTime(), this.getHttpConfig() )
				.success( function ( jsonResult, statusHttp, headers, config ) {
					// connection is lost ?
					if (statusHttp==401 || typeof jsonResult === 'string') {
						console.log("Redirected to the login page !");
						window.location.reload();
					}
					console.log("history",jsonResult);
					self.listevents		= jsonResult.listevents;
					self.inprogress=false;
	

					toaster.pop('success', "Properties saved", "");
					
				})
				.error( function() {
					self.inprogress=false;
					});
	}
	
	this.loadProps =function() {
		var self=this;
		self.inprogress=true;
		
		// 7.6 : the server force a cache on all URL, so to bypass the cache, then create a different URL
		var d = new Date();
		
		$http.get( '?page=custompage_ping&action=loadprops&t='+d.getTime(), this.getHttpConfig() )
				.success( function ( jsonResult, statusHttp, headers, config ) {
					// connection is lost ?
					if (statusHttp==401 || typeof jsonResult === 'string') {
						console.log("Redirected to the login page !");
						window.location.reload();
					}
					console.log("history",jsonResult);
					self.propsFirstName = jsonResult.firstname;
					self.listevents		= jsonResult.listevents;
					self.inprogress		= false;
		
				})
				.error( function() {
					self.inprogress		= false;
					});
	}
	this.loadProps();

	
	// Manage the event 
	this.getListEvents = function ( listevents ) {
		return $sce.trustAsHtml(  listevents );		
	}
	// Manage the Modal 
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