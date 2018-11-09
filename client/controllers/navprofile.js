// var dynamic_navbar=angular.module('dynamic_navbar');//AngularJS applications cannot be nested within each other.
ROSManager.controller('navProfile',['$scope','$http','$location','$routeParams','$cookies','auth','withAuthentication','navBarParams',function($scope,$http,$location,$routeParams,$cookies,auth,withAuthentication,navBarParams){
    
  /*Inicializálása*/
    $scope.init = function () {
       $scope.withAuthentication = withAuthentication;
       $scope.debug = false;
       $scope.imageUrl = "../images/";
       $scope.baseUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/";
    };    

    $scope.init();
  
    if ( $scope.debug) 
      console.log('Profile loaded!');
    $scope.logOut = function($event){


      console.log($event);
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      $event.cancelBubble = true;
  
      $http.post('/logout',{token:auth.token}).then(
        function(response){
          try {
            
            if (response.status) {
              $cookies.remove(auth.cookieKey);
              auth.token = response.data.data.token;
              auth.auth  = response.data.data.auth;
              auth.user.name = null;
              auth.user.data = null;
              window.auth = auth;
              $location.url('/signin');
              
            }else{
    
              var t = "Hiba....";
              var u = '<span class="hiba" ></span>'+
                      '<br/><span class="hiba" >'+response.data.msg+'</span>';
                      
              if ($(".ui-dialog").exists()) {
                  $(".ui-dialog").css("z-index","100");
              } 
              var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
              $cookies.remove(auth.cookieKey);
              auth.token = null;
              auth.auth  = false;
              auth.user.name = null;
              auth.user.data = null;
              window.auth = auth;
              $location.url('/signin');
    
            }        
            
          } catch (error) {
            var t = "Hiba....";
            var u = '<span class="hiba" ></span>'+
                    '<br/><span class="hiba" >'+error+'</span>';
                    
            if ($(".ui-dialog").exists()) {
                $(".ui-dialog").css("z-index","100");
            } 
  
            var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            auth.token = null;
            auth.auth  = false;
            auth.user.name = null;
            auth.user.data = null;
            window.auth = auth;
            $location.url('/signin');
          }
  
        },function(error){
  
          try {
            var t = "Hiba....";
            var u = '<span class="hiba" ></span>'+
                    '<br/><span class="hiba" >'+error.data.msg+'</span>';
                    
            if ($(".ui-dialog").exists()) {
                $(".ui-dialog").css("z-index","100");
            } 
            var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            auth.token = null;
            auth.auth  = false;
            auth.user.name = null;
            auth.user.data = null;
            window.auth = auth;
            $location.url('/signin');
            
          } catch (error) {
  
            var t = "Hiba....";
            var u = '<span class="hiba" ></span>'+
                    '<br/><span class="hiba" >'+error+'</span>';
                    
            if ($(".ui-dialog").exists()) {
                $(".ui-dialog").css("z-index","100");
            } 
            var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            auth.token = null;
            auth.auth  = false;
            auth.user.name = null;
            auth.user.data = null;
            window.auth = auth;
            $location.url('/signin');
  
          }
        }
      );
    }
    
    $(".dropdown-toggle,ul,li,a,div[ng-include]").on("click",function(e){
      console.log("CLICK ul");
      e.preventDefault();
    });
  
  }]);
  