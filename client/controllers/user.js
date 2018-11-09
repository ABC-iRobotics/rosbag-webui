ROSManager.controller('userController',['$scope','$http','$location','$routeParams','auth',function($scope,$http,$location,$routeParams,auth){

  /*Inicializálása*/
  $scope.init = function () {
    
    $scope.debug = false;
    if (!(auth.auth))
    $location.url('/signin');
    $scope.imageUrl = "../images/";
    $scope.baseUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/";

  };    
  $scope.init();

  if ($scope.debug) console.log('Load userController!');

  $scope.user = {
    name:""
    ,img:$scope.imageUrl+'img_avatar_m.png'
    ,description:""
    
  };

  $scope.getUserDataDB = function(){

    var data = {
                token:auth.token, 
                email:"",
                name:""
              };

    $http.post('/getUserFromDB',data).then(
      
      function(response){

        var t = "";
        var u = "";
        var uzenetDialog  = "";

        if (response.status) {
          
          $scope.user = {
            name:response.data.data.username,
            img:"../images/img_avatar_m.png",
            email:response.data.data.email,
            division:"none",
            description:"...."
          };

        }else{
          t = "Hiba....";
          u = '<span class="hiba" ></span>'+
                  '<br/><span class="hiba" >'+response.data.msg+'</span>';
          uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        }

        
      },function(error){

        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+error.data.msg+'</span>';
                
        if ($(".ui-dialog").exists()) {
            $(".ui-dialog").css("z-index","100");
        } 
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
    );

  }

  if(auth.auth){
    $scope.getUserDataDB();
  }

}]);
