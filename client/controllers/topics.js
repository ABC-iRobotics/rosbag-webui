ROSManager.controller('topics',['$scope','$http','$location','$routeParams','$timeout','$interval','auth','$rootScope','$q',function($scope,$http,$location,$routeParams,$timeout,$interval,auth,$rootScope,$q){
    /*Inicializálása*/
    $scope.init = function () {

        var deffered = $q.defer();
        $scope.debug = false;
        if (!(auth.auth)) $location.url('/signin');
        try {
            deffered.resolve({
                "sate":true,
                "msg":"\r\n [x] Sikeres inicializálás!",
                "data":{}
            });
        } catch (error) {
            deffered.resolve({
                "sate":false,
                "msg":"\r\n [x] Hiba az inizializálás során!\r\n"+erro.stack,
                "data":{}
            });
        }
        
        return deffered.promise;
    }

     /**
      * @description Jquery:exists check
      */     
     jQuery.fn.exists = function(){return jQuery(this).length>0;}
        
     /**
      * @description Jquery:dialog plugin
      */ 
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
                 
                 'buttons':{
                     'Ok':{
                             text:'OK',
                             id:'ok_gomb',
                             click:function(e){
                                 $(this).empty();
                                 $(this).dialog('close');
                                 $(this).dialog( "destroy" );
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
                "draggable":false,
                "width": "auto", // overcomes width:'auto' and maxWidth bug
                "maxWidth": 600,
                "height": "auto",
                "modal": true,
                "fluid": true, //new option
                "resizable":false,
              
             });
 
             $(this).dialog('open');
             return this;
     }

    // run function on all dialog opens
    $(document).on("dialogopen", ".ui-dialog", function (event, ui) {
        fluidDialog();
    });

    // remove window resize namespace
    $(document).on("dialogclose", ".ui-dialog", function (event, ui) {
        $(window).off("resize.responsive");
    });

    function fluidDialog() {
        var $visible = $(".ui-dialog:visible");
        // each open dialog
        $visible.each(function () {
            var $this = $(this);
            var dialog =$this.find(".ui-dialog-content").data("ui-dialog");
            // if fluid option == true
            if (dialog.options.maxWidth && dialog.options.width) {
                // fix maxWidth bug
                $this.css("max-width", dialog.options.maxWidth);
                //reposition dialog
                dialog.option("position", dialog.options.position);
            }

            if (dialog.options.fluid) {
                // namespace window resize
                $(window).on("resize.responsive", function () {
                    var wWidth = $(window).width();
                    // check window width against dialog width
                    if (wWidth < dialog.options.maxWidth + 50) {
                        // keep dialog from filling entire screen
                        $this.css("width", "90%");
                        
                    }
                //reposition dialog
                dialog.option("position", dialog.options.position);
                });
            }

        });
    }


    $scope.init().then(function(data){  
        var t = "Info....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba">'+data.msg+'</span>';

        if ($(".ui-dialog").exists()) {
            $(".ui-dialog").css("z-index","100");
        } 

        var uzenetDialog  = "";
        if ($("#uzenet").exists()) {
            uzenetDialog  = $('#uzenet').aDialog('',t,u);
        }else{
            uzenetDialog  = $('<div id="uzenet">').appendTo("body").aDialog('',t,u);
        }
        $("span.hiba").focus().click();
    },function(error){
        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba">'+erro.msg+'</span>';

        if ($(".ui-dialog").exists()) {
            $(".ui-dialog").css("z-index","100");
        } 

        var uzenetDialog  = "";
        if ($("#uzenet").exists()) {
            uzenetDialog  = $('#uzenet').aDialog('',t,u);
        }else{
            uzenetDialog  = $('<div id="uzenet">').appendTo("body").aDialog('',t,u);
        }
        $("span.hiba").focus().click();
    })
}]);