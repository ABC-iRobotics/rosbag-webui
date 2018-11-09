ROSManager.controller('rosbag',["$templateCache",'$scope','$http','$location','$routeParams','$timeout','$interval','auth','$rootScope','$q','$route',function($templateCache,$scope,$http,$location,$routeParams,$timeout,$interval,auth,$rootScope,$q,$route){

    /**
     * @description a feluelt inicializalasa
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
    $scope.fileManager = function(param){
        this.settings = $.extend({
            fileExtension:"bag",
            fileSize:1000000,
            filePath:$scope.rosBagFilesPath
        },param);

        /**
         *
         */
        this.checkExtension = function(file){
            var extension = file.substr((file.lastIndexOf('.') +1));
            var ext = new RegExp(eval("/("+this.settings.fileExtension+")$/ig"));
            if (ext.test(extension)) {
                return true;
            }else{
                $("#file").val("");
                $('#ufile').val("");
                $('.form-control').text("");
                return false;
            }
        }
        /**
         *
         */
        this.checkFileSize = function(file_size){
            if (file_size<this.settings.fileSize) {
                return true;
            }else{
                $("#file").val("");
                $('#ufile').val("");
                $('.form-control').text("");
                return false;
            }
        }
        /**
         *
         */

        this.getErroDialog =function( adatok){
            var msg="<span class=\"uzenet\">"+adatok.hiba+"</span>";
            $("#msgModalTitle").html("Hiba");
            $("#msgForm").html(msg);
            $("#msgBtn").click();

        }

        //#region old getErroDialog
        // this.getErroDialog =function( adatok , msg ){

        //     if ($(".ui-dialog").exists()) {
        //         $(".ui-dialog").css("z-index","100");
        //     }
        //     var errorDialog  = "";
        //     if ($("#erroDialog").exists()) {
        //         errorDialog  = $('#erroDialog');
        //     }else{
        //         errorDialog  = $('<div id="erroDialog">').appendTo("body");
        //     }
        //     var uzenet='<span class="uzenet">'+adatok.hiba+'</span>'+'';

        //     errorDialog.html(uzenet)
        //         .dialog({'title':'Hiba',
        //                 'autoOpen':true,
        //                 'resizable':false,
        //                 'dialogClass':'alert',
        //                 'closeOnEscape':true,
        //                 'close':function(){
        //                     if ($(".ui-dialog").exists()) {
        //                     $(".ui-dialog").css("z-index","101");
        //                     }
        //                     },
        //                 'open': function(event, ui) {
        //                     $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
        //                     },
        //                     'buttons':{
        //                     'Ok':{
        //                     text:'OK',
        //                     id:'ok_gomb',
        //                     click:function(e){
        //                         $(this).dialog('close');
        //                         $(this).dialog( "destroy" );
        //                         $(this).empty();
        //                         if ($(".ui-dialog").exists()) {
        //                         $(".ui-dialog").css("z-index","101");
        //                         }
        //                     }
        //                     }
        //                     },
        //                     "draggable":false,
        //                     "width": "auto", // overcomes width:'auto' and maxWidth bug
        //                     "maxWidth": 600,
        //                     "height": "auto",
        //                     "modal": true,
        //                     "fluid": true, //new option
        //                     "resizable":false
        //                 });
        //     errorDialog.dialog('option','width','600');
        //     return errorDialog;
        // }
        //#endregion

        /**
         *
         */
        this.fileOpen = function(errorDialog = false){

            var deffered = $q.defer();
            var that    = this;
            try {

                //a feltoltendo fajl ellen  is le lehene itt
                var data	= new FormData();
                var file = $('#file-dialog')[0].files;
                var file_name = file[0].name.replace(/\\/g, '/').replace(/.*\//, '');//string
                var file_size = file[0].size;//num
                var file_type = file[0].type;


                var msg = "\r\n [x] Hiba:";
                if (this.settings.fileExtension!="") {
                    if(!this.checkExtension(file_name)){
                        var h_adatok = {"hiba":"Nem megfelelő a fájl kiterjesztése !</br>Az engedélyezett kiterjesztés "+this.settings.fileExtension+"</br>Kérem megfelelő fájlt válasszon!"};
                        if(errorDialog){
                            this.getErroDialog(h_adatok);
                        }
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba:\r\n Nem megfelelő a fájl kiterjesztése !</br>Az engedélyezett kiterjesztés "+this.settings.fileExtension+"</br>Kérem megfelelő fájlt válasszon!",
                            "data":h_adatok
                        });
                    }
                }

                if (this.settings.fileSize!=""){
                    if(!this.checkFileSize(file_size)){
                        var h_adatok = {"hiba":"Nem megfelelő a fájl mérete !</br>Az engedélyezett méret "+this.settings.fileSize+" az ön "+file_size+"</br>Kérem megfelelő fájlt válasszon!"};
                        if (errorDialog) {
                            this.getErroDialog(h_adatok);
                        }
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba:\r\n Nem megfelelő a fájl mérete !</br>Az engedélyezett méret "+this.settings.fileSize+" az ön "+file_size+"</br>Kérem megfelelő fájlt válasszon!",
                            "data":h_adatok
                        });

                    }
                }
                deffered.resolve({
                    "state":true,
                    "msg":"\r\n [x] A fájl ellen és megnyitása megtörtént.",
                    "data":{}
                });

            } catch (error) {
                var h_adatok = {"hiba": "[x] Hiba a fájl megnyitása során!\r\n Hiba:"+error.stack};
                deffered.resolve({
                    "state":false,
                    "msg":" [x] Hiba a fájl megnyitása során!\r\n Hiba:"+error.stack,
                    "data":h_adatok
                });
            }

            return deffered.promise;
        }

    }

    /**
     * @description a feluelt inicializalasa
     */
    $scope.init = function () {

        var deffered = $q.defer();
        $scope.debug = false;
        if (!(auth.auth)) $location.url('/signin');

        $scope.rosBagFilesPath = "/home/np164u3f/Develops/rosManager/bagfiles/";
        $scope.topics = [];
        $scope.nodes  = [];
        $scope.fullData  = [];
        $scope.splitData = [];
        $scope.aktData = [];

        //sec nsec
        $scope.aktTime = [];
        $scope.chart = null;
        $scope.amChartData = [];
        $scope.startOffset =[];
        try {



            /**
             * set Event handler
             */
            //file open/upload
            $('.file-upload-browse').on('click', function() {
                var file = $(this).parent().parent().parent().find('.file-upload-default');
                file.trigger('click');
            });


            $('.file-upload-default').on('change', function() {

                var path = $(this).val().replace(/C:\\fakepath\\/i, $scope.rosBagFilesPath);
                $(this).parent().find('.form-control').val(path);

                var f = new $scope.fileManager({});
                f.fileOpen(false).then(function(data){
                    if (data.state) {

                        var file = $('#file-dialog')[0].files;
                        var file_name = file[0].name.replace(/\\/g, '/').replace(/.*\//, '');//string
                        var file_size = file[0].size;//num
                        var file_type = file[0].type;
                        var params = {"size":file_size,"name":file_name,"type":file_type,"fullPath":$scope.rosBagFilesPath+file_name}
                      
                        $scope.readROSBagFile(params);

                    }else{
                        f.getErroDialog(data.data);
                    }

                },function(error){

                    f.getErroDialog({"hiba":"[x] A fájl nem  megfelelő:"+error});

                });


            });


            //itt ki kell a chartokat nullazni
            /**
             *
             */

         
          
            // $scope.chart = AmCharts.makeChart( "timelineChart", {
            //     "type": "gantt",
            //     "theme": "light",
            //     "marginRight": 10,
            //     "period": "fff",//ms
            //     "dataDateFormat":"JJ:NN:SS",
            //     "balloonDateFormat": "JJ:NN:SS",
            //     //[{period:'fff',format:'JJ:NN:SS'},
            //     // {period:'ss',format:'JJ:NN:SS'},
            //     // {period:'mm',format:'JJ:NN'},
            //     // {period:'hh',format:'JJ:NN'},
            //     // {period:'DD',format:'MMM DD'},
            //     // {period:'WW',format:'MMM DD'},
            //     // {period:'MM',format:'MMM'},
            //     // {period:'YYYY',format:'YYYY'}]
            //     // "balloonDateFormat": "NN:SS:QQQ",
            //     // [ {
            //     //   "period": "ss",
            //     //   "format": "NN:SS"
            //     // }, {
            //     //   "period": "fff",
            //     //   "format": "NN:SS:QQQ"
            //     // } ],

            //     "columnWidth": 0.5,
            //     "valueAxis": {
            //         "type": "datetime"
            //     },
            //     "brightnessStep": 10,
            //     "graph": {
            //         "fillAlphas": 1,
            //         // "balloonText": "<b>[[task]]</b>: [[open]] [[value]]",
            //         "showBalloon": false 
            //     },
            //     "rotate": true,
            //     "categoryField": "category",
            //     "segmentsField": "segments",
            //     "colorField": "color",
            //     "startDate": "00-00-00",
            //     "startField": "start",
            //     "endField": "end",
            //     "durationField": "duration",
            //     "dataProvider":
            //     [
            
            //     ],
            //     // "chartScrollbar": {},
            //     "valueScrollbar": {
            //         "autoGridCount":true
            //     },
            //     "chartCursor": {
            //         "cursorColor":"#55bb76",
            //         "valueBalloonsEnabled": true,
            //         "cursorAlpha": 0,
            //         "valueLineAlpha":0.5,
            //         "valueLineBalloonEnabled": true,
            //         "valueLineEnabled": true,
            //         "zoomable":false,
            //         "valueZoomable":true
            //     },
            //     // "chartCursor": {
			// 	// 	"valueBalloonsEnabled": false,
			// 	// 	"cursorAlpha": 0.1,
			// 	// 	"valueLineBalloonEnabled": true,
			// 	// 	"valueLineEnabled": true,
			// 	// 	"fullWidth": true
			// 	// },
            //      "export": {
            //          "enabled": false,
            //          "divId": "exportdiv"

            //     }
            // } );

            // function handleClick(event)
            // {

            //     console.log(event);
            //     alert(event.item.category + ": " + event.item.values.value);
            // }
            // $scope.chart.addListener("clickGraphItem", handleClick);



          


                deffered.resolve({
                    "sate":true,
                    "msg":"\r\n [x] Sikeres inicializálás!",
                    "data":{}
                });

        } catch (error) {
            deffered.resolve({
                "sate":false,
                "msg":"\r\n [x] Hiba az inizializálás során!\r\n"+error.stack,
                "data":{}
            });
        }

        return deffered.promise;
    }

    //#region  base js jQuery plugins etc
    /**
     * @description itt lehet betoltenia ext. script allomanyokat
     */
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
    // $(function () {
    //     $('#rosbagRecordModal').modal('toggle');
    //  });


    //A $().modal is not a fucntion  why??????????

    /**
     * @description
     */
    $scope.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * @description
     */
    if(!Object.keys) Object.keys = function(o){
        if (o !== Object(o))
             throw new TypeError('Object.keys called on non-object');
        var ret=[],p;
        for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
        return ret;
    }

    /**
     * @description
     */
    $scope.splitToTopics = function(fullData){

        var splitData = {};
        var amChartData = {};
        angular.forEach(fullData, function(value, key) {

            if (splitData.hasOwnProperty(value.topic)) {
                splitData[value.topic][splitData[value.topic].length] = value;
            }else{
                splitData[value.topic] = [];
                splitData[value.topic][0] = value;
            }

        });




        console.log("Splitdata");
        var topics = Object.keys(splitData);
        // console.log(splitData);
        // console.log("Topikok");
        // console.log(topics);

        $scope.topics = topics;
        $scope.splitData = splitData;
        // console.log("Topic tartalom példa:");
        // console.log(splitData["/turtle1/cmd_vel"][0].message);
        $("#rosBagRawDataContener").empty();
        // $("#rosBagRawDataContener").html("<pre id=\"singleRawData\" style=\"color:#dae3ed;\">" + JSON.stringify(splitData["/turtle1/cmd_vel"][0].message,null,2)+ "</pre>");
        // $("#rosBagRawDataContener").html("<pre id=\"singleRawData\" style=\"color:#dae3ed;\">" + JSON.stringify(splitData["/turtle1/color_sensor"][0].message,null,2)+ "</pre>");


       //ezzel megkapom hogy melyik  topic az offset ehhez kell a tobbit beallitani
       var offsetTopic = {"topic":null,"sec":null,"nsec":null};
       var beginData = {};
       angular.forEach(splitData, function(value, key) {
            if (offsetTopic.sec == null) {
                offsetTopic.sec = value[0].timestamp.sec;
                offsetTopic.nsec = value[0].timestamp.nsec;
                offsetTopic.topic = key;
            }
            if(offsetTopic.sec>value[0]){
                offsetTopic.sec = value[0].timestamp.sec;
                offsetTopic.nsec = value[0].timestamp.nsec;
                offsetTopic.topic = key;
            }

            beginData[key] = {"topic":key,"sec":value[0].timestamp.sec,"nsec":value[0].timestamp.nsec};

        });

        // console.log("OffsetTopic");
        // console.log(offsetTopic);
        // console.log("Kezedeti adatok!");
        // console.log(beginData);



        var offsetTopics = {};
        angular.forEach(beginData, function(value, key) {
            //key name value object.
            //var offsetTopic = {"topic":null,"sec":null,"nsec":null};
            var start = ((value.sec-offsetTopic.sec)*1000)//offser sec
            var duration = (value.nsec*0.000001);
            offsetTopics[key] = {
                "start":start,
                "duration":duration,
                "color":"#727d6f",
                "task":null,
                "nsec":value.nsec,
                "sec":value.sec
            };

        });

        console.log("Kezdeti topic offset");
        console.log(offsetTopics);

        /*

                        [
                            {
                                "category": "/turtle1/cmd_vel",
                                "segments":
                                [   {
                                        "start": 0,
                                        "duration": 0.1,
                                        "color": "#46615e",
                                        "task": "/turtle1/cmd_vel #1",
                                    }
                                ]
                            }
                        ]

        */
        //itt kell majd az amCharthoz kialakitani és számolni egyesével melyhez a topics valaint
        var amChartData = [];
        angular.forEach(topics, function(topic, index) {
            var color = $scope.getRandomColor();
            amChartData[amChartData.length] = {"category":topic,"segments":[]};
            angular.forEach(splitData[topic], function(value, key) {

                var segmentsLength = amChartData[amChartData.length-1].segments.length;
                var start = null;
                var duration = null;
                    start = (((value.timestamp.sec-offsetTopics[topic].sec)*1000)+offsetTopics[topic].start)//offser sec
                    duration = (value.timestamp.nsec*0.000001);

                    // console.log("Topic:",topic,"Value.timestam:",value.timestamp.sec,"OffsetTopics:",offsetTopics[topic].sec,"Külömbség:",value.timestamp.sec-offsetTopics[topic].sec)
                amChartData[amChartData.length-1].segments[segmentsLength] = {
                    "start": start,
                    "duration": duration,
                    "color": color,
                    "task": topic+" #"+segmentsLength,
                    "sec":value.timestamp.sec,
                    "nsec":value.timestamp.nsec
                }

            });
            //value topic name key 0,1 indexek
        });

        // console.log("Data for amChartData");
        // console.log(amChartData);

        $scope.amChartData = amChartData;
        // var chart;
        // var xAxis;
        // var yAxis;
        // // AmCharts.ready(function () {
        //     // console.log(chart);
        //     var chartCursor = new AmCharts.ChartCursor();

        //     chartCursor.cursorColor = "#55bb76";
        //     chartCursor.valueBalloonsEnabled = true;
        //     chartCursor.cursorAlpha = 0;
        //     chartCursor.valueLineAlpha = 0.5;
        //     chartCursor.valueLineBalloonEnabled = true;
    
        //     chartCursor.valueLineEnabled = true;
        //     chartCursor.zoomable = false;
        //     chartCursor.valueZoomable = true;
        //     chartCursor.cursorPosition = "mouse";
        //     chartCursor.leaveAfterTouch = true;
        //     chartCursor.leaveCursor = true;
        //     console.log(chartCursor);
    
    
        //     chartCursor.addListener("moved", function(){
        //         // {type:"moved", x:Number, y:Number, zooming:Boolean, chart:AmChart}
        //         console.log("Moving");
        //     });

        //     //Gantt
        //     chart = new AmCharts.AmGanttChart();
        //     chart.type = "gantt";
        //     chart.theme = "light";
        //     chart.period = "fff";
        //     chart.dataDateFormat = "JJ:NN:SS";
        //     chart.columnWidth = 0.5;

        //     // xAxis = new AmCharts.ValueAxis();
        //     // xAxis.type = "dateTime";
        //     // xAxis.position = "bottom";
        //     // xAxis.axisAlpha = 0;
        //     // // xAxis.minMaxMultiplayer = 1.2;
        //     // xAxis.autoGridCount = true;
        //     // chart.addValueAxis(xAxis);

        //     chart.segmentsField="segments";
        //     chart.colorField="color";
        //     chart.startDate = "00:00:00";
        //     chart.startField = "start";
        //     chart.endField = "end";
        //     chart.durationField ="duration";

        //     chart.columnWidth=0.5;
        //     // chart.pathToImages = "https://www.amcharts.com/lib/3/images/";
        //      chart.dataProvider = $scope.amChartData;
    
        //      var graph = new AmCharts.AmGraph();
        //     //  graph.valueField = "visits";
        //      graph.type = "column";
        //      chart.addGraph( graph );
        //     chart.addChartCursor(chartCursor);
        //     // $scope.chart.clear();
        //     // $scope.chart = null;
        //     $scope.chart = chart.write("timelineChart");

        // // });
       
       
     













        //ezt meg kellnézni
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//https://stackoverflow.com/questions/47586237/how-to-make-amchart-follow-synchronize-with-video-element
        // https://stackoverflow.com/questions/51264998/amcharts-chartcursor-show-at-last-position
// //New data array
// var NewChartData = [];

// //Adding new data to array
// NewChartData.push(JSON.parse(D));

// //Setting the new data to the graph
// chart.dataProvider = NewChartData;

// //Updating the graph to show the new data
// chart.validateData();

        var chart = AmCharts.makeChart( "timelineChart", {
            "type": "gantt",
            "theme": "light",
            "marginRight": 10,
            "period": "fff",//ms
            "dataDateFormat":"JJ:NN:SS",
            "categoryAxis": {
                "gridPosition": "start"
              },
            // "balloonDateFormat": "JJ:NN:SS",
            
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

                // "id"      : "rosTimelineGraph",
                // "title"   : "File",
                // "type"    : "column",
                 "valueField"  : "sec",
                "fillAlphas"  : 1,
                // "balloonText": "<b>[[task]]</b>: [[open]] [[value]]",
                
                // accessibleLabel
                /*
                periodSpan
	            Number	1	This property can be used by step graphs - you can set how many periods one horizontal line should span.
                */
                /*
                type
                    String	line	Type of the graph. Possible values are: "line", "column", "step", "smoothedLine", 
                    "candlestick", "ohlc". XY and Radar charts can only display "line" type graphs.

                */
                /*
                clear()			Clears the chart area, intervals, etc.

                */


                /*
                makeChart(container, config, delay)
                    container - id of a DIV or reference of the container element - config contains the whole setup for the chart -
                    delay in milliseconds to delay the initiation 
                    of the chart	chart instance	This method allows to create charts with a single config.

                */
                /*
                removeGraph(graph)	graph - instance of AmGraph		Removes graph from the chart.
                */

                /*
                showGraph(graph)	graph - instance of AmGraph		Show the graph (if it is hidden). Usually this method
                is called from the Legend, when you click on the legend marker.
                */



                /*
                http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#zoomToCategoryValues
                zoomToCategoryValues(start, end)
                    start - category value, String \\ end - category value, String		Zooms the chart by the value of the category axis.
                zoomToDates(start, end)	start - start date, Date object \\ end - end date, Date object		Zooms the chart from one date to another.
                zoomToIndexes(start, end)	start - start index, Number \\ end - end index, Number		Zooms the chart by the index of the category.

                */
                /*
                click
                http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#clickGraphItem
                http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#clickGraph
                */
                /*
                drawn
                http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#drawn
                    {type:"drawn", chart:AmChart}	Fired every time chart is drawn or re-drawn - graph toggle, chart area resize, etc.

                Please note, that this event will not fire on zoom. Use "zoomed" event instead to catch those events.

                */

                /*http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#init
                init	{type:"init", chart:AmChart}	Dispatched when chart is build for the first time.
                */

                /*http://docs.amcharts.com/3/javascriptstockchart/AmGanttChart#rightClickGraphItem
                rightClickGraphItem	{type:"rightClickGraphItem", graph:AmGraph, item:GraphDataItem, index:Number,
                chart:AmChart, event:MouseEvent}	Dispatched when user right-clicks on the data item (column/bullet)
                */
                // periodSpan
                // showHandOnHover Boolean	false

                "showBalloon": false 
            },
            "rotate": true,
            "categoryField": "category",
            "segmentsField": "segments",
            "colorField": "color",
            "startDate": "00-00-00",
            "startField": "start",
            "endField": "end",
            "durationField": "duration",
            "dataProvider":$scope.amChartData,
            
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
                "valueZoomable":true,
                //Possible values are: start, middle, mouse.
                "cursorPosition":"mouse",
                //leaveAfterTouch	Boolean	true
                "leaveAfterTouch":true,
                //leaveCursor	Boolean	false
                "leaveCursor":true,

            },
            // "chartCursor": {
            // 	"valueBalloonsEnabled": false,
            // 	"cursorAlpha": 0.1,
            // 	"valueLineBalloonEnabled": true,
            // 	"valueLineEnabled": true,
            // 	"fullWidth": true
            // },
             "export": {
                 "enabled": false,
                 "divId": "exportdiv"
            }
        } );

        function handleClick(event)
        {
                            // event.stopPropagation();
                            // event.stopImmediatePropagation();
                            // event.cancelBubble = false;

            console.log(event);
            alert(event.item.category + ": " + event.item.values.value);
        }
        chart.addListener("clickGraphItem", handleClick);
        // chart.addListener("clickGraph", handleClick);
        chart.addListener("rightClickGraphItem", handleClick);

        //  chart.removeChartCursor();
        //  chart.addChartCursor(chartCursor);

    }

    /**
     * @description
     */
    $scope.readROSBagFile = function(file={"size":10000,"name":"test.bag","type":"bag","fullPath":"./test.bag"}){
        var that = this;

        try {

            var params = {file};
            params.token = auth.token;

            var options = {
                "url": '/readROSBagFile',
                "method": 'POST',
                "data":params,
                // "timeout":40000
            };

            $("#msgModalTitle").html("Beolvasás folyamatban!");

                var content =   "<div>"+
                                    "<div class=\"dot-opacity-loader\" >"+
                                        "<span></span>"+
                                        "<span></span>"+
                                        "<span></span>"+
                                    "</div>"+
                                "</div>";

                $("#msgForm").html(content);
                $("#msgModalBtn").toggleClass("d-none");
                $("#msgBtn").click();

                
            $scope.sleep(500).then(function(){
                $http(options).then(function(response){
                                
                    $scope.fullData = response.data.data;
                    if (response.data.state){
                        $("#msgModalTitle").html("Üzenet");
                        var msg="<span class=\"hiba\">"+response.data.msg+"</span>";
                        $("#msgForm").html(msg);
                        $scope.splitToTopics($scope.fullData);
                    } else {
                        $("#msgModalTitle").html("Hiba");
                        var msg="<span class=\"hiba\">A fájl beolvasása sikertelen!<br>"+response.data.msg+"</span>";
                        $("#msgForm").html(msg);
                    }
                    $("#msgModalBtn").toggleClass("d-none");
                },function(error){
                    $("#msgModalTitle").html("Hiba");
                    var msg="<span class=\"hiba\">A fájl beolvasása sikertelen!<br>"+error+"</span>";
                    $("#msgForm").html(msg);
                    $("#msgModalBtn").toggleClass("d-none");
                });
            });

        } catch (error) {
            $("#msgModalTitle").html("Hiba");
            var msg="<span class=\"hiba\">A felvétel indítása sikertelen!<br>Hiba:"+error+"</span>";
            $("#msgForm").html(msg);
            $("#msgModalBtn").toggleClass("d-none");
        }

    }

    /**
     * @description
     */
    $scope.StartStopRecord = function($event){

        $event.stopPropagation();
        $event.stopImmediatePropagation();
        $event.cancelBubble = false;
        try {
            var btn = $event.target;
            var $btn = $($event.target);
            var record = $(btn).data("record");
            var redBtn = $(btn).hasClass("red-btn");

            if(!record && !redBtn){

                var params = {};
                params.token = auth.token;

                var options = {
                    "url": '/getTopicsNodes',
                    "method": 'POST',
                    "data":params,
                    // "timeout":40000
                };

                $http(options).then(function(response){
                    if (response.data.state) {
                      
                        var topics ='<div class="col-md-6">'+
                                    '<h5 class="card-text">Topics</h5>'+
                                    '<div class="form-group">';
                        var topicsCheckbox = "";
                        var topicNumber = response.data.data.topics.length;

                        if (topicNumber > 0) {
                            angular.forEach(response.data.data.topics[0], function(value, key) {
                                if (value!="") {
                                    topicsCheckbox+='<div class="form-check">'+
                                                        '<label class="form-check-label">'+
                                                        '<input type="checkbox" id="topic_'+ value +'" data-topic="'+ value +'" class="form-check-input">'+
                                                            value+
                                                        '<i class="input-helper"></i></label>'+
                                                    '</div>';
                                }
                            });
                        }

                        topics += topicsCheckbox +
                                '   </div>'+
                                '</div>'
                        var nodes = '<div class="col-md-6">'+
                                    '<h5 class="card-text">Nodes</h5>'+
                                    '<div class="form-group">';
                        var nodesCheckbox = "";
                        var nodeNumber = response.data.data.nodes.length;

                        if (nodeNumber>0) {
                            angular.forEach(response.data.data.nodes[0], function(value, key) {
                                if (value!="") {
                                    nodesCheckbox+='<div class="form-check">'+
                                                        '<label class="form-check-label">'+
                                                        '<input type="checkbox" id="node_'+ value +'" data-node="'+ value +'" class="form-check-input">'+
                                                            value+
                                                            '<i class="input-helper"></i>'+
                                                        '</label>'+
                                                    '</div>';
                                }
                            });
                        }

                        nodes += nodesCheckbox +
                            '   </div>'+
                            '</div>'

                        $("#topicsNodesContener").html(topics+nodes);
                        $("#starHBtn").click();

                    } else {
                        var msg = "<span class=\"hiba\">"+response.data.msg+"</span>";
                        $("#msgModalTitle").html("Hiba");
                        $("#msgForm").html(msg);
                        $("#msgBtn").click();
                    }
                },function(error){
                    var msg = "<span class=\"hiba\">"+error+"</span>";
                    $("#msgModalTitle").html("Hiba");
                    $("#msgForm").html(msg);
                    $("#msgBtn").click();
                });


            }else{
                $("#rosbagStopRecordForm").html("<span>Biztosan leállítja a felvételt</san>");
                $("#stopHBtn").click();
            }

        } catch (error) {
            $("#msgModalTitle").html("Hiba");
            var msg = "<span class=\"hiba\">Hiba a felvétel elindítás során!</span>";
            $("#msgForm").html(msg);
            $("#msgBtn").click();
        }

    };

    /**
     * @description
     */
    $scope.startROSBagRecord = function($event,obj){
        var that = this;
        // $event.stopPropagation();
        // $event.stopImmediatePropagation();
        // $event.cancelBubble = false;

        try {

            var topics = "";
            var nodes  = "";
            var fileName = $("#fileName").val();
            var record = {};
            var redBtn = {};

            var checkedTopics = $("input[id^=topic_]:checked");
            var s = "";
            if (checkedTopics.length>0) {
                angular.forEach(checkedTopics, function(value, key) {
                    topics += s + value.getAttribute("data-topic");
                    s = " ";
                });
            }

            var checkedNodes = $("input[id^=node_]:checked");
            s = "";
            if (checkedNodes.length>0) {
                angular.forEach(checkedNodes, function(value, key) {
                    nodes += s + value.getAttribute("data-node");
                    s = " ";
                });
            }

            if ((checkedTopics.length>0 || checkedNodes.length>0) && fileName!="") {

                var params = {"path":$scope.rosBagFilesPath,"topics":topics,"nodes":nodes,"fileName":fileName};
                params.token = auth.token;

                var options = {
                    "url": '/startRecord',
                    "method": 'POST',
                    "data":params,
                    // "timeout":40000
                };

                $http(options).then(function(response){

                    if (response.data.state) {
                        $("#rosbagRecordBtn").data("record",true);
                        document.getElementById("rosbagRecordBtn").setAttribute("data-record",true);
                        $("#rosbagRecordBtn").toggleClass("red-btn");
                        $(".loader").toggleClass("d-none");
                        record = $("#rosbagRecordBtn").data("record");
                        redBtn = $("#rosbagRecordBtn").hasClass("red-btn");
                        $("#msgModalTitle").html("Üzenet");
                        var msg = "<span class=\"hiba\">A felvétel sikeresen elindúlt!</span>";
                        $("#msgForm").html(msg);
                        $("#msgBtn").click();
                    } else {


                        if (response.data.data.recordExists) { 
                            $("#msgModalTitle").html("Hiba");
                            var msg = "<span class=\"hiba\">Már fut egy felvétel!</span>";
                            $("#msgForm").html(msg);
                            $("#msgBtn").click();
                            $("#rosbagRecordBtn").data("record",true);
                            document.getElementById("rosbagRecordBtn").setAttribute("data-record",true);
                            record = $("#rosbagRecordBtn").data("record");
                            redBtn = $("#rosbagRecordBtn").hasClass("red-btn");

                        } else {

                            $("#msgModalTitle").html("Hiba");
                            var msg = "<span class=\"hiba\">A felvétel indítása sikertelen!</span>";
                            $("#msgForm").html(msg);
                            $("#msgBtn").click();
                            $("#rosbagRecordBtn").data("record",false);
                            document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
                            $("#rosbagRecordBtn").toggleClass("red-btn");
                            $(".loader").toggleClass("d-none");
                            record = $("#rosbagRecordBtn").data("record");
                            redBtn = $("#rosbagRecordBtn").hasClass("red-btn");

                        }


                    }
                },function(error){
                    $("#msgModalTitle").html("Hiba");
                        var msg = "<span class=\"hiba\">A felvétel indítása sikertelen!<br>"+error+"</span>";
                        $("#msgForm").html(msg);
                        $("#msgBtn").click();
                        $("#rosbagRecordBtn").data("record",false);
                        document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
                        $("#rosbagRecordBtn").toggleClass("red-btn");
                        $(".loader").toggleClass("d-none");
                        record = $("#rosbagRecordBtn").data("record");
                        redBtn = $("#rosbagRecordBtn").hasClass("red-btn");
                });
            } else {

                $("#msgModalTitle").html("Hiba");
                var msg = "<span class=\"hiba\">A felvétel indítása sikertelen!<br>Nem adott meg minden adatot!</span>";
                $("#msgForm").html(msg);
                $("#msgBtn").click();
                $("#rosbagRecordBtn").data("record",false);
                document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
                $("#rosbagRecordBtn").toggleClass("red-btn");
                $(".loader").toggleClass("d-none");
                record = $("#rosbagRecordBtn").data("record");
                redBtn = $("#rosbagRecordBtn").hasClass("red-btn");

            }

        } catch (error) {
            $("#msgModalTitle").html("Hiba");
            var msg = "<span class=\"hiba\">A felvétel indítása sikertelen!<br>Hiba:"+error+"</span>";
            $("#msgForm").html(msg);
            $("#msgBtn").click();
            $("#rosbagRecordBtn").data("record",false);
            document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
            $("#rosbagRecordBtn").toggleClass("red-btn");
            $(".loader").toggleClass("d-none");
            record = $("#rosbagRecordBtn").data("record");
            redBtn = $("#rosbagRecordBtn").hasClass("red-btn");

        }


    }

    /**
     * @description
     */
    $scope.resetForm = function($event){

        $event.stopPropagation();
        $event.stopImmediatePropagation();
        $event.cancelBubble = false;

        var that = this;
        var element = $($event.target);
        var formId = element.data("form");
        console.log(formId);
        $("#"+formId)[0].reset();

    }

    /**
     * @description
     */
    $scope.stopROSBagRecord = function($event,obj){


        try {
            var params = {"node":"rosManagerBag"};
            params.token = auth.token;

            var options = {
                "url": '/stopRecord',
                "method": 'POST',
                "data":params,
                // "timeout":40000
            };

            $http(options).then(function(response){
                if (response.data.state) {
                    $("#msgModalTitle").html("Üzenet");
                    var msg="<span class=\"hiba\">A felvétel sikeresen leállt!</span>";
                    $("#msgForm").html(msg);
                    $("#msgBtn").click();
                    $("#rosbagRecordBtn").data("record",false);
                    document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
                    $("#rosbagRecordBtn").toggleClass("red-btn");
                    $(".loader").toggleClass("d-none");
                    record = $("#rosbagRecordBtn").data("record");
                    redBtn = $("#rosbagRecordBtn").hasClass("red-btn");
                } else {

                    $("#msgModalTitle").html("Hiba");
                    var msg="<span class=\"hiba\">A felvétel leállítása sikertelen!<br>"+response.data.msg+"</span>";
                    $("#msgForm").html(msg);
                    $("#msgBtn").click();
                }
            },function(error){
                $("#msgModalTitle").html("Hiba");
                var msg="<span class=\"hiba\">A felvétel leállítása sikertelen!<br>"+error+"</span>";
                $("#msgForm").html(msg);
                $("#msgBtn").click();
            });
        } catch (error) {
            $("#msgModalTitle").html("Hiba");
            var msg="<span class=\"hiba\">A felvétel leállítása sikertelen!<br>"+error+"</span>";
            $("#msgForm").html(msg);
            $("#msgBtn").click();
        }

    }
    //#endregion
    
    /**
     * @description a feluelt inicializalasa
     */
    $scope.reloadPage = function(){
      
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

    /**
     * @description ezzel ellen hogy fut e mar felvetel
     */
    $scope.checkRecord = function(){

        try {
            var params = {"node":"/rosManagerBag"};
            params.token = auth.token;

            var options = {
                "url": '/checkRecord',
                "method": 'POST',
                "data":params,
                // "timeout":40000
            };

            var record = {};
            var redBtn = {};
            $http(options).then(function(response){
                if (response.data.state) {
                //ha létetik akkor piros true valamit a lodert is be kell rakin
                    $("#rosbagRecordBtn").data("record",true);
                    document.getElementById("rosbagRecordBtn").setAttribute("data-record",true);
                    if(!$("#rosbagRecordBtn").hasClass("red-btn")){
                        $("#rosbagRecordBtn").toggleClass("red-btn");
                    }
                    if($(".loader").hasClass("d-none")){
                        $(".loader").toggleClass("d-none");
                    }
                    record = $("#rosbagRecordBtn").data("record");
                    redBtn = $("#rosbagRecordBtn").hasClass("red-btn");
                } else {

                    if (response.data.data.nodes.length==0) {
                        $("#msgModalTitle").html("Hiba");
                        var msg="<span class=\"hiba\">A felvétel ellenörzése sikertelen!<br>"+response.data.msg+"</span>";
                        $("#msgForm").html(msg);
                        $("#msgBtn").click();    
                    }else{
                        document.getElementById("rosbagRecordBtn").setAttribute("data-record",false);
                        if($("#rosbagRecordBtn").hasClass("red-btn")){
                            $("#rosbagRecordBtn").toggleClass("red-btn");
                        }
                        if(!$(".loader").hasClass("d-none")){
                            $(".loader").toggleClass("d-none");
                        }
                        record = $("#rosbagRecordBtn").data("record");
                        redBtn = $("#rosbagRecordBtn").hasClass("red-btn");

                    }
                    
                    
                }
            },function(error){
                $("#msgModalTitle").html("Hiba");
                var msg="<span class=\"hiba\">A felvétel ellenörzése sikertelen!<br>"+error+"</span>";
                $("#msgForm").html(msg);
                $("#msgBtn").click();
            });
        } catch (error) {
            $("#msgModalTitle").html("Hiba");
            var msg="<span class=\"hiba\">A felvétel ellenörzése sikertelen!<br>"+error+"</span>";
            $("#msgForm").html(msg);
            $("#msgBtn").click();
        }



    }

    /**
     * 
     */
    $scope.sleep = function(ms){
        return new Promise(resolve=>setTimeout(resolve,ms));
    }
    /**
     * @description Init.
     */




    if ((auth.auth)){
        $scope.init().then(function(data){
            /**
             * Ezzel tudom idoziteni
             */
            // var taskTimer = $interval($scope.reloadPage,1000);
            // $scope.$on('$destroy', function () { $interval.cancel(taskTimer); });
            $(document).ready(function(){
                $scope.sleep(200).then(function(){
                    $scope.checkRecord();
                });

            })
            

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
    }else{
        $location.url('/signin');
    }
    

}]);