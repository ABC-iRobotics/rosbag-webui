// var dynamic_navbar=angular.module('dynamic_navbar');//AngularJS applications cannot be nested within each other.
ROSManager.controller('navController',['$scope','$http','$location','$routeParams','$cookies','auth','withAuthentication','navBarParams',function($scope,$http,$location,$routeParams,$cookies,auth,withAuthentication,navBarParams){
  /*Inicializálása*/
  $scope.init = function () {
     $scope.withAuthentication = withAuthentication;
     $scope.debug = false;
     $scope.imageUrl = "../images/";
     $scope.baseUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/";

  };    
  $scope.init();

  if ( $scope.debug) 
    console.log('Navbar loaded!');
  
  /**
  *set Active
  *https://stackoverflow.com/questions/16199418/how-to-set-bootstrap-navbar-active-class-with-angular-js
  */
  $scope.isActive = function (viewLocation) {
    // console.log('isActive','view:',viewLocation,'location:', $location.path());
      return viewLocation === '#'+$location.path();
  };
  $scope.page_name = 'Dashboard';
  $scope.menu =  [
    {"link":'#/dasboard',"title":'Dashboard',"icon":"icon-screen-desktop"}
    ,{"link":'#/topics',"title":"Topics","icon":"icon-doc"}
    ,{"link":'#/nodes',"title":"Nodes","icon":"icon-share"}
    ,{"link":'#/rosbag',"title":'ROSbag',"icon":"icon-bag"}
  ];
  $scope.logout = {"content":"Logout","link":"#/logout","icon":"icon-logout"};
  $scope.settings = {"content":'Settings',"link":"#/settings","icon":"icon-settings"};

}]);
