ROSManager.controller('nodes',['$scope','$http','$location','$routeParams','$timeout','$interval','auth','$rootScope','$q',function($scope,$http,$location,$routeParams,$timeout,$interval,auth,$rootScope,$q){
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
        var chart = AmCharts.makeChart( "timelineChart", {
            "type": "gantt",
            "theme": "light",
            "marginRight": 10,
            "period": "fff",//ms
            "dataDateFormat":"JJ:NN:SS",
            "balloonDateFormat": "JJ:NN:SS",
            //[{period:'fff',format:'JJ:NN:SS'},
            // {period:'ss',format:'JJ:NN:SS'},
            // {period:'mm',format:'JJ:NN'},
            // {period:'hh',format:'JJ:NN'},
            // {period:'DD',format:'MMM DD'},
            // {period:'WW',format:'MMM DD'},
            // {period:'MM',format:'MMM'},
            // {period:'YYYY',format:'YYYY'}]
            // "balloonDateFormat": "NN:SS:QQQ",
            // [ {
            //   "period": "ss",
            //   "format": "NN:SS"
            // }, {
            //   "period": "fff",
            //   "format": "NN:SS:QQQ"
            // } ],

            "columnWidth": 0.5,
            "valueAxis": {
                "type": "datetime"
            },
            "brightnessStep": 10,
            "graph": {
                "fillAlphas": 1,
                "balloonText": "<b>[[task]]</b>: [[open]] [[value]]"
            },
            "rotate": true,
            "categoryField": "category",
            "segmentsField": "segments",
            "colorField": "color",
            "startDate": "00-00-00",
            "startField": "start",
            "endField": "end",
            "durationField": "duration",
            "dataProvider": 
            [ 
                {
                    "category": "/turtle1/cmd_vel",
                    "segments": 
                    [   {
                            "start": 0,
                            "duration": 0.1,
                            "color": "#46615e",
                            "task": "Task #1"
                        }, {
                            "start": 0.2,
                            "duration": 0.1,
                            "color": "#727d6f",
                            "task": "Task #2"
                        },{
                            "start": 0.5,
                            "duration": 0.4,
                            "color": "#727d6f",
                            "task": "Task #3"
                        } ,
                        {
                            "start": 0.51,
                            "duration": 0.01,
                            "color": "#727d6f",
                            "task": "Task #4"
                        } ,
                        {
                            "start": 0.6,
                            "duration": 0.8,
                            "color": "#727d6f",
                            "task": "Task #5"
                        } 
                    ]
                },
                {
                    "category": "/turtle1/cmd_vel1",
                    "segments": 
                    [   {
                            "start": 0,
                            "duration": 0.1,
                            "color": "#46615e",
                            "task": "Task #1"
                        }, {
                            "start": 0.2,
                            "duration": 0.1,
                            "color": "#727d6f",
                            "task": "Task #2"
                        },{
                            "start": 0.5,
                            "duration": 0.4,
                            "color": "#727d6f",
                            "task": "Task #3"
                        } ,
                        {
                            "start": 0.51,
                            "duration": 0.01,
                            "color": "#727d6f",
                            "task": "Task #4"
                        } ,
                        {
                            "start": 0.6,
                            "duration": 0.8,
                            "color": "#727d6f",
                            "task": "Task #5"
                        } 
                    ]
                }
            ],
            // "chartScrollbar": {},
            "valueScrollbar": {
                "autoGridCount":true
            },
            "chartCursor": {
                "cursorColor":"#55bb76",
                "valueBalloonsEnabled": true,
                "cursorAlpha": 0,
                "valueLineAlpha":0.5,
                "valueLineBalloonEnabled": true,
                "valueLineEnabled": true,
                "zoomable":false,
                "valueZoomable":true
            },
            // "chartCursor": {
            // 	"valueBalloonsEnabled": false,
            // 	"cursorAlpha": 0.1,
            // 	"valueLineBalloonEnabled": true,
            // 	"valueLineEnabled": true,
            // 	"fullWidth": true
            // },
            // "export": {
            //     "enabled": true,
            //     "divId": "exportdiv"

            // }
        } );




 
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