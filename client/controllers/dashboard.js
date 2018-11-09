ROSManager.controller('dashboard',["$templateCache",'$scope','$http','$location','$routeParams','$timeout','$interval','auth','$rootScope','$q','$route',function($templateCache,$scope,$http,$location,$routeParams,$timeout,$interval,auth,$rootScope,$q,$route){
    
    /**
     * @description Script allomanyok betoltese
     */
    $scope.getScript = function(ajaxParam = null,scriptName){
        var deffered = $q.defer();
        try {
            if (ajaxParam == null) {
                ajaxParam = {
                    "url":".",
                    // default: false for same-domain requests, true for cross-domain requests
                    // ,"crossDomain":true
                    "methode":"GET",
                    "dataType":"script",
                    // "statusCode":{404:function(){
                    // },
                    "succes":function(data,textStatus,jqXHR){
                    },
                    "error":function(jqXHR,textStatus,errorThrown){
                        deffered
                        .resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba a script fájl betöltése során\r\n Hiba:"+errorThrown,
                            "data":{}
                        });
                    }
                };
            } else {
            }

            $.ajax(ajaxParams).then(function(data){
                deffered
                .resolve({
                    "state":true,
                    "msg":"\r\n [x] A kért script fájl sikeresen betöltődött",
                    "data":{}
                });

            },function(error){
                deffered
                .resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba a script fájl betöltése során\r\n Hiba:"+error,
                    "data":{}
                });
            })
            
        } catch (error) {
            deffered
            .resolve({
                "state":false,
                "msg":"\r\n [x] Hiba a script fájl betöltése során\r\n Hiba:"+error.stack,
                "data":{}
            });
        }
        
        return deffered.promise;
    }
    
    /**
     * @description a feluelt inicializalasa
     */
    $scope.init = function () {
     
        var deffered = $q.defer();
        $scope.debug = false;
        if (!(auth.auth)) $location.url('/signin');

        try {
            //#region CHARTS & DOUNUGHT
            //itt ki kell a chartokat nullazni 
            $scope.chartData = {
                labels: ["ROSMASTER1","ROSMASTER2"],
                datasets: [
                    {
                        data: [100, 445, 483, 503, 689, 692, 634],
                        },
                        {
                        data: [100, 10, 10, 503, 689, 692, 634],
                        }
                ]
            };
            
            var chLine = document.getElementById("ros-chart");
            if (chLine) {
                new Chart(chLine, {
                type: 'bar',
                data: $scope.chartData,
                options: {
                    scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                    },
                    legend: {
                        display: false
                    }
                }
                });
            }

            var chLine = document.getElementById("topic-chart");
            if (chLine) {
                new Chart(chLine, {
                type: 'bar',
                data: $scope.chartData,
                options: {
                    scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                    },
                    legend: {
                        display: false
                    }
                }
                });
            }

            //#endregion

            //#region dashboard params
            $scope.dashBoardParams = {
                "masters":{
                    "icon":"icon-layers",
                    "master":[
                        {
                            "ROS_MASTER_URI":"//np164u3f-virtual-machine:11311/",
                            "ROS_HOSTNAME":"localhost",
                            "ROS_MASTER_PORT":11311,
                            "state":false,
                            "icon":"icon_layers",
                            "description":"..."
                        },
                
                    ]
                },
                "topics":{
                    "icon":"icon-doc",
                    "topic":[
                        {
                            "topicName":"topicName",
                            "topicState":false,
                            "topicType":"std_msgs/String",
                            "description":"..."
                        }
                    ]},
                "nodes":{
                    "icon":"icon-share",
                    "node":[ 
                        {
                            "nodeName":"nodeName",
                            "nodeState":false,
                            "description":"..."
                        }
                    ]},    
                "rosBags":{
                    "icon":"icon-docs",
                    "defaultPath":"",
                    "bag":[]
                },
                
            };
            //#endregion
            
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
     * @description itt lehet betoltenia ext. script allomanyokat
     */
    //#region base js jQuery plugins etc
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
    

    /**
     * sajnos nem minde bongeszo tamogatja nativan a promise ezert ide meg kell adni mindig 
     * ezzel le lehet ellen hogy lehet-e hasznalni
     * if(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1){
     *  //here
     * }
     * var promise1 = new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('foo');
        }, 300);
        });

        promise1.then(function(value) {
        console.log(value);
        // expected output: "foo"
        });

        console.log(promise1);

        *********************


        return new Promise(function(resolve, reject) {
        doSomething(function cb(good) {
            if (good)
                resolve();
            else
                reject();
            });
        });
    */

    /**
     * @description part of responsive jQuery dialog 
     * run function on all dialog opens
     */
    $(document).on("dialogopen", ".ui-dialog", function (event, ui) {
        fluidDialog();
    });

    /**
     * @description part of responsive jQuery dialog 
     * emove window resize namespace
     */
    $(document).on("dialogclose", ".ui-dialog", function (event, ui) {
        $(window).off("resize.responsive");
    });
    /**
     * @description part of responsive jQuery dialog 
     */
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

    /**
     * @description Confirmation dialog 
     * sajnos nem lehet a nativ Promiset hasznalni
     * @param {*} question 
     * @param {*} buttons 
     */
    function confirmation(question,buttons=null) {

        var defer = $.Deferred();
        if ( buttons == null || buttons == "" ){
            buttons={
                "Yes": function () {
                    $(this).dialog("close");
                    defer.resolve(true);//this text 'true' can be anything. But for this usage, it should be true or false.
                    
                },
                "No": function () {
                    $(this).dialog("close");
                    defer.resolve(false);//this text 'false' can be anything. But for this usage, it should be true or false.
                    
                }
            }

        }

        var uzenetDialog  = "";
        if (!$("#uzenet").exists()) 
            uzenetDialog  = $('<div id="uzenet">')
                            .appendTo("body")
                            .html(question)
                            .dialog({
                                "autoOpen": true,
                                "modal": true,
                                "title": 'Confirmation',
                                "buttons":buttons ,
                                close: function () {
                                    $(this).remove();
                                }
                            });
        return defer.promise();
    }
    
    //example
    // var question = "Do you want to start a war?";
    // confirmation(question,"").then(function (answer) {
    //     var ansbool = answer;
    //     if(ansbool){

    //          alert("this is obviously " + ansbool);//TRUE
    //     } else {
    //          alert("and then there is " + ansbool);//FALSE
    //     }
    // });
    //#endregion

    $scope.reloadPage = function(){

        $scope.dashBoardParams.masters.master.push({
            "ROS_MASTER_URI":"http://np164u3f-virtual-machine:11311/",
            "ROS_HOSTNAME":"localhost",
            "ROS_MASTER_PORT":11311,
            "state":false,
            "icon":"icon_layers",
            "description":"..."
        });

        var chLine = document.getElementById("ros-chart");
        $scope.chartData = {
            labels: ["S", "M", "T", "W", "T", "F", "S"],
            datasets: [
                {
                data: [100, 445, 483, 503, 689, 692, 634],
                },
                {
                data: [100, 10, 10, 503, 689, 692, 634],
                }

            ]
        };

        if (chLine) {
            new Chart(chLine, {
            type: 'bar',
            data: $scope.chartData,
            "options": {
                "scales": {
                  "xAxes": [{
                    "barPercentage": 0.4,
                    "categoryPercentage": 0.5
                  }],
                  "yAxes": [{
                    "ticks": {
                      "beginAtZero": true
                    }
                  }]
                },
                legend: {
                  display: false
                }
              }
            // options: {
            //     scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero: false
            //         }
            //     }]
            //     },
            //     legend: {
            //         display: false
            //     }
            // }

            });
        }
        
        //ehhez kell
        /**
         * You are using ngRoute in that way you have to use the $routeProvider.
         *  The $stateProvider is based on ui-router. Please check this runnable 
         * fiddle and switch to $routeProver or use ui-router in combination with $stateProvier.
         *
         ngRoute configuration

            This is a runnable fiddle of ngRoute implementation.

            angular.module('demoApp', ['ngRoute'])
            .config(['$routeProvider', function( $routeProvider) {

            // Define routes 
            $routeProvider.when('/homepage', { 
                templateUrl: 'partial/homepage.html',
                controller: HomePageCtrl
                }).when('/users', { 
                templateUrl: 'partial/users.html',
                controller: UsersListCtrl
                }).when('/contacts',{ 
                templateUrl: 'partial/contacts.html',
                controller: ContactPageCtrl
                }).otherwise({
                redirectTo: 'homepage'
                });
            }
            ]);

            ui-router configuration

            This is a runnable fiddle of ui-route implementation.

            var myApp = angular.module("myApp",["ui.router"])
            .config(function ($stateProvider, $urlRouterProvider){
                $stateProvider.state("state1", {
                    url: "#",
                    template: "<p>State 1</p>",
                    controller: "Ctrl1"
                }).state("state2", {
                    url: "#",
                    template: "<p>State 2</p>",
                    controller: "Ctrl2"
                });
            });
         */
        //ezt csk stateProviderrel lehet hasznalni
        // $state.transitionTo($state.current, $stateParams, {
        //     reload: true,
        //     inherit: false,
        //     notify: true
        // });
        // $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
        // $route.reload();
        // var currentPageTemplate = $route.current.templateUrl;
        // $templateCache.remove(currentPageTemplate);
        //  $route.reload();
        
    };

    $scope.init().then(function(data){  
       
        // var taskTimer = $interval($scope.reloadPage,1000);
        // $scope.$on('$destroy', function () { $interval.cancel(taskTimer); });

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