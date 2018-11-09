ROSManager.controller('logoutController',['$scope','$http','$location','$routeParams','auth',function($scope,$http,$location,$routeParams,auth){
  /*Inicializálása*/
  $scope.init = function () {
    $scope.debug = true;
    if (!(auth.auth)){
      $location.url('/signin');
    }
  };    
  $scope.init();

  if($scope.debug)
    console.log('Logout!');
    
  $http.post('/logout',data).then(
    function(response){
      
      var t = "";
      var u = "";
      var uzenetDialog  = "";

      if (response.status) {
        
        t = "Üzenet....";
        u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>'+
                '<br/><span class="hiba" >Itt át kell majd irányítani!</span>';
        $location.url('/main_page')

      }else{
        t = "Hiba....";
        u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
      }

      auth.token = response.data.data.token;
      auth.auth  = response.data.data.auth;
      uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      
    },function(error){

      var t = "Hiba....";
      var u = '<span class="hiba" ></span>'+
              '<br/><span class="hiba" >'+error.data.msg+'</span>';
              
      if ($(".ui-dialog").exists()) {
          $(".ui-dialog").css("z-index","100");
      } 
      var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      auth.token = null;
      auth.auth  = false;
    }
  );
    
}]);
    