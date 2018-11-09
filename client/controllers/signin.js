ROSManager.controller('singinController', ['$scope', '$http', '$location','$cookies','auth', function ($scope, $http, $location,$cookies,auth) {

  /*Inicializálása*/
  $scope.init = function () {
    $scope.debug = false;
    var cookieDataObject = null;
    var cookieDataObject = $cookies.getObject(auth.cookieKey);

    if (typeof(cookieDataObject)!='undefined') {
      if ((!(auth.auth) && cookieDataObject.auth)){
        auth.auth  = cookieDataObject.auth;
        auth.token = cookieDataObject.token;
        auth.user.name = cookieDataObject.user.name;
        auth.user.data = cookieDataObject.user.data;
        //itt az elozöz kellene
        // console.log(window.history);
        $location.url('/main_page');
      }else if((auth.auth && cookieDataObject.auth)){
        $location.url('/main_page');
      } 
    }else{

    }

    $scope.imageUrl = "../images/";
    $scope.baseUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/";

  };    

  $scope.init();

  if($scope.debug)
  console.log('Loade singinController!');

  /**
 * Jquery:exists check
 ---------------------------------------------------------------------------- */     
  jQuery.fn.exists = function(){return jQuery(this).length>0;}


     
 /**
  * Jquery:dialog plugin
  ---------------------------------------------------------------------------- */ 
  jQuery.fn.aDialog = function(adat,title,html){
      if ($(".ui-dialog").exists()) {
        $(".ui-dialog").css("z-index","100");
      }
          $(this).text(adat);
          $(this).html(html);	
          $(this).dialog(
          {
              'title':title,
              'autoOpen':false,
              'draggable':false,
              
              'modal':true,
              'resizable':false,
              'buttons':{
                  'Ok':{
                          text:'OK',
                          id:'ok_gomb',
                          click:function(e){
                              $(this).dialog('close');
                              $(this).dialog( "destroy" );
                              $(this).empty();
                              if ($(".ui-dialog").exists()) {
                                  $(".ui-dialog").css("z-index","101");
                              }
                          }
                      }
              },
              'dialogClass':'alert',
              // 'open': function(event, ui) {
              //     $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
              //  },
              'closeOnEscape':true,
              'close':function(){
                  if ($(".ui-dialog").exists()) {
                  $(".ui-dialog").css("z-index","101");
                  }
              },
          //'closeOnEscape':true,
              'width':'auto',
              'minHeight':220
          });

          $(this).dialog('open');
          return this;
  }

  // $(function() {

  //   $('#login-form-link').click(function(e) {
  //   $("#login-form").delay(100).fadeIn(100);

  //   $("#register-form").fadeOut(100);
  //     $('#register-form-link').removeClass('active');
  //     $(this).addClass('active');
  //     e.preventDefault();
  //   });
  //   $('#register-form-link').click(function(e) {
  //     $("#register-form").delay(100).fadeIn(100);
  //       $("#login-form").fadeOut(100);
  //     $('#login-form-link').removeClass('active');
  //     $(this).addClass('active');
  //     e.preventDefault();
  //   });

  // });

  /**
  * Bejelentkezes(login): AD es DB
  ---------------------------------------------------------------------------- */ 

  // auth.user.name = window.loggedUser;
  $scope.signin = function (e) {
console.log("Beje");
    var data = {};
    var response = {
      status:false,
      data:{},
      msg:String
    };
    
    //#region   getData
    $("#login-form").find("input").not("#login-submit").each(function(index,element){

    
        var $obj = $(element);
        if ($obj.val() != "") {
          data[$obj.attr('id')] = $obj.val();
        }else{
          var t = "Hiba";
          var u = " [x] Kérem adjon meg minden szukseges adatot!";
          var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
          response.status = true;
          return false;
        }

        if (element.getAttribute('type')=='checkbox') {
          data[$obj.attr('id')] = element.checked;      
        }

      });
      //#endregion

      /**
       *Hiba eseten a 400 clien 500 server sikere 200 redirect 300
      **/

      if (!(response.status)) {
          $http.post('/login',data).then(
            function(response){
              
              var t = "";
              var u = "";
              var uzenetDialog  = "";
      
              if (response.status) {
                auth.token = response.data.data.token;
                auth.auth  = response.data.data.auth;
                auth.user.name  = response.data.data.user.username;
                auth.user.data  = response.data.data.user;
                window.auth = auth;
                var cookieExp = new Date();
                // cookieExp.setDate(cookieExp.getDate() + 7);
                $cookies.putObject(auth.cookieKey, auth,{});
                $location.url('/main_page');
              }else{
                auth.token = response.data.data.token;
                auth.auth  = response.data.data.auth;
                auth.user.name  = null
                auth.user.data  = null;
                window.auth = auth;
                t = "Hiba....";
                u = '<span class="hiba" ></span>'+
                        '<br/><span class="hiba" >'+response.data.msg+'</span>';
                uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
              }

              
            },function(error){
              auth.token = null;
              auth.auth  = false;
              auth.user.name  = null
              auth.user.data  = null;
              window.auth = auth;
              var t = "Hiba....";
              var u = '<span class="hiba" ></span>'+
                      '<br/><span class="hiba" >'+error.data.msg+'</span>';
              var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            }
          );
          
      }
  }

  $scope.registration = function (e) {

    var data = {};
    var response = {status:false,msg:String};

    $("#register-form").find("input").not("#register-submit").each(function(index,element){
      var $obj = $(element);
      if ($obj.val()!="") {
        data[$obj.attr('id')] = $obj.val();
      }else{
        var t = "Hiba";
        var u = " [x] Kérem adjon meg minden szukseges adatot!";
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        response.status = true;
        return false;
      }

    });


    if (!(response.status)) {
      if (data.password === data.confirmPassword) {
        $http.post('/registration',data).then(
          
          function(response){
            
            var t = "";
            var u = "";
            var uzenetDialog  = "";
    
            if (response.status) {
              auth.token = null;
              auth.auth  = false;
              t = "Üzenet....";
              u = '<span class="hiba" ></span>'+
                      '<br/><span class="hiba" >'+response.data.msg+'</span>'+
                      '<br/><span class="hiba" >Most már bejelentkezetett!</span>';
            }else{
              auth.token = null;
              auth.auth  = false;
              t = "Hiba....";
              u = '<span class="hiba" ></span>'+
                      '<br/><span class="hiba" >'+response.data.msg+'</span>';
            }
            uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            
          },function(error){
            auth.token = null;
            auth.auth  = false;
            var t = "Hiba....";
            var u = '<span class="hiba" ></span>'+
                    '<br/><span class="hiba" >'+error.data.msg+'</span>';
                    
            var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
          }
        );

      }else{
        
        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" > [x] A két jelszó nem egyezik meg!</span>';
                
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
       
      }
    }
  }
  
}])
  