ROSManager.controller('users',['$scope','$http','$location','$routeParams','$timeout','$interval','$compile','auth',function($scope,$http,$location,$routeParams,$timeout,$interval,$compile,auth){
  /*Inicializálása*/
  $scope.init = function () {
    $scope.debug = false;
    if (!(auth.auth)) $location.url('/signin');
    $scope.imageUrl = "../images/";
    $scope.baseUrl = $location.protocol()+"://"+$location.host()+":"+$location.port()+"/";


    $scope.dataTableParams= {

      tableId:"users_dataTable"
      ,tableName:"User"
      ,description:"Felhasználók adatai"
      ,ajaxPage:"getUserView"
      ,columns : [
        {"data":"_id","name":"_id","attr":[{"alias":false}]}
        ,{"name":"username","attr":[{"alias":false}]}
        ,{"name":"displayName","attr":[{"alias":false}]}
        // ,{"name":"department","attr":[{"alias":false}]}
        ,{"name":"email","attr":[{"alias":false}]}
        ,{"name":"modDate","attr":[{"alias":false}]}
        ,{"name":"modUser","attr":[{"alias":false}]}
        ,{"name":"updated","attr":[{"alias":false}]}
        ,{"name":"modify","attr":[{"alias":false}]}
      ], 
      columnDefs :[
        {"data":"_id","name":"_id","title": "ID","visible":true,"orderable":true, "searchable": true, "targets": 0, "defaultContent":"x"}
        ,{"data":"username","name":"username","title": "Felhasználónév","visible":true,"orderable":true, "searchable": true, "targets": 1, "defaultContent":"w"}
        ,{"data":"displayName","name":"displayName","title": "Felhasználónév","visible":true,"orderable":true, "searchable": true, "targets": 2, "defaultContent":"w"}
        // ,{"data":"department","name":"department","title": "Osztály","visible":true,"orderable":true, "searchable": true, "targets": 3, "defaultContent":""}
        ,{"data":"email","name":"email","title": "Email","visible":true,"orderable":true, "searchable": true, "targets": 3, "defaultContent":""}
        ,{"data":"modDate","name":"modDate","title": "Módosítás időpontja","visible":true,"orderable":true, "searchable": true, "targets": 4, "defaultContent":""
        ,"render":function(data, type, full, met){
          return new Date(data);
        }}
        ,{"data":"modUser","name":"modUser","title": "Módosító felhasználó","visible":true,"orderable":true, "searchable": true, "targets": 5, "defaultContent":""}
        ,{"data":"updated","name":"updated","title": "Feltöltés ideje","visible":true,"orderable":true, "searchable": true, "targets": 6, "defaultContent":"",
        "render":function(data, type, full, met){
          return new Date(data);
        }}
        ,{"data":"muvelet"
          ,"name":"muvelet"
          ,"title": "Műveletek <br/><input type=\"button\" value=\"+\" class=\"controller btn btn-primary\" alt=\"4\" data-action=\"insert\"  id=\"insertButton\" style=\"height:10px;width:40px;\"/>"
          ,"sortable":false
          ,"searchable":false
          ,"targets": 7
          ,'render':function(data, type, full, met){
              
              data ="123";
              var imgs = '';
              var img ={
                1:{'src': $scope.imageUrl +'edit.png','id':'','class':'controller','data-action':'update'}
                ,2:{'src': $scope.imageUrl +'drop.png','id':'','class':'controller','data-action':'delete'}
                ,3:{'src': $scope.imageUrl +'view.png','id':'','class':'controller','data-action':'view'}
                ,4:{'src': $scope.imageUrl +'view.png','id':'','class':'controller','data-action':'insert'}
              };
              
              for (var i = 0; i<data.length; i++) {
                //ha az ertek 1 akkor mehet a pipa
                // if (full[9]==1 && img[(i+1)]['data-action']=="delete" ) {
                //   imgs+='<img src="'+ $scope.imageUrl +'pipa.png" alt="'+(i+1)+'" id="'+img[(i+1)].id+'" class="'+img[(i+1)].class+'" data-action="'+img[(i+1)]['data-action']+'"/>';
                // }else{
                  imgs += '<img src="'+img[(i+1)].src+'" alt="'+(i+1)+'" id="'+img[(i+1)].id+'" class="'+img[(i+1)].class+'" data-action="'+img[(i+1)]['data-action']+'" />';
                // }
              }

              // $compile(imgs)($scope);
              return imgs;

          }
        }
      ]
    };


  };
  $scope.init();

  if($scope.debug)
      console.log("Load Menu1!");

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

  /**
   * Jquery:tabs
   ---------------------------------------------------------------------------- */ 
  $( ".m_tabs" ).tabs({ active: 0 });
  $( ".sortable" ).sortable({ 
      axis: "x"
      ,cursor:"pointer"
  });

  if ($scope.debug) 
    console.log("Load Felhasználok osztályok karbantartása!");


  /**
   * DataTable
   ---------------------------------------------------------------------------- */
  $scope.getDataTable = function(o_data){

    var h_lec	=	'';
    var f_lec	=	'';
    var _db = 0;
    var columns = $scope.dataTableParams.columns;
    var columnDefs = $scope.dataTableParams.columnDefs;
    var tableId = $scope.dataTableParams.tableId;
    var tableData = o_data;


    for (key in columns) {
      h_lec	+= '<th>'+columns[key].name.trim()+'</th>';
      f_lec	+= '<td>'+columns[key].name.trim()+'</td>';
      _db++;
    }

    var dataTable	=	$('<table id="'+tableId+'" class="display dataTable">'+
                      '<thead ><tr>'+h_lec+'</tr></thead>'+
                      '<tbody></tbody></table>').appendTo($("#resultList"));

    dataTable.dataTable({
      // "processing": true
      // ,"serverSide": true
      // "language": { "url": "./jqtbllng_HU.inc"}	
      // "language": { "url": "./jqtbllng_HU.inc"}	
      // "columns":columns
      "columnDefs": columnDefs 
      //,scrollX:true
      //,fixedColumns:{
      //  leftColumns:0
      //  ,rightColumns:1
      //}
        ,"rowId":"_id"
        ,data:tableData
      ,"initComplete": function(settings, json) {
        if (parseInt(settings._iRecordsDisplay)<0) {
          var u = "<span>Nincs adatok a megadott feltételek alapján</span>";
          var t = "Üzenet....";
          var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        }else{
          //HA KELL A LEGELSO TABLA BETOLTODESRE VALAMIT CSINALNI
        }
      }
      ,"drawCallback":function(){
        $scope.setEvent();
      }
      //,"autoWidth":false
      //,"scrollX":true
      ,"order":[[0,"desc"]]
      ,'dom': "Blfrtip"         
      ,"buttons": [
          {
            extend: "excelHtml5",
            text: "Excel",
            customize: function (xlsx) {
              //var sheet = xlsx.xl.worksheets["sheet1.xml"];
            },
            exportOptions: {
                columns: [0,1,2,3,4,5,6,7]
            }
          },
          {
          text: "PDF",
          action: function(e,dt,node,config){
              var u = '<span class="hiba" >Fejlesztés alatt!</span>'+
                        '<br/><span class="hiba" >Kérem keresse  a rendszerfelügyeletet!</span>';
              var t = "Hiba....";
              var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            }
          }
        ]
    });
  }

  /**
   * ViewDialog:karbantarto feluletek eloallitsa a setEvent-tol kapot adatokkal
   ---------------------------------------------------------------------------- */
  $scope.getViewDialog = function(o_params){

    var response = o_params.response;
    var action = o_params.action;
    if ($(".ui-dialog").exists()) {
      $(".ui-dialog").css("z-index","100");
    }

    var viewDialog = (($("#vDialog").exists())? $('#vDialog'):$('<div id="vDialog">').appendTo("body"));
    var t = "";
    var u = "";
    var _id = $("#hiddenData").find("#_id").val();

    switch (action) {
      case "view":
        t = "Felhasználó adatai....";
        u = response.data.html
        viewDialog.html(u);

        var element = $("#viewContener").children().find('input,select,textarea').attr('disabled',true);
        element.filter(":not(#modifyPassword)").css({"background": "#bab6b2"});
        viewDialog.dialog({
          'buttons':{
            'OK':{
              text:'OK',
              id:'ok_gomb',
              click:function(e){
                $(this).dialog('close');
                $(this).empty();
                $(".ui-dialog").css("z-index","101");
              }
            }
          }
          ,'width':'auto'
          ,'title':t
          ,'modal':true
          ,'dialogClass':'alert'
        });

        break;
      case "insert":    

        t = "Felhasználó adatainak";
        u = response.data.html
        viewDialog.html(u);
        


        var element = $("#viewContener").children().find("[disabled='disabled']").attr('disabled',true);
        element.filter(":not(#modifyPassword)").css({"background": "#bab6b2"});
        
        viewDialog.dialog({
          'title':t+" felvitele",
          'dialogClass':'alert',
          'closeOnEscape':false,
            'close':function(){},
            'open': function(event, ui) {
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            },
          'width':'auto',
          'minHeight':220,
          'modal':true,
          'resizable':false,
          'buttons':{
            'Rögzítés':{
              text:'Rögzítés',
              id:'rogzites_gomb',
              click:function(e){

                if (!$("#viewForm")[0].checkValidity()) {
                  var t = "Hiba";
                  var u = " <span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x] Hibás email formátum!</span>"+
                  "<br><span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">Kérem adja meg ismételten!</span>";
                  var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
                  return false;
                }

                var data = {};
                var mandantoryError = false;
                var mandantoryErrorText = "";
                var _id = $("#hiddenData").find("#_id").val();





                $("#viewContener").find("input,select,textarea").not("#login-submit").each(function(index,element){
                  // console.log(element.tagName);
                    var $obj = $(element);
                    if (element.tagName=="INPUT" ) {
                      if ($obj.val() != "") {
                        data[$obj.attr('id')] = $obj.val();
                      }else{
                        if ($obj.data("mandantory")) {
                          mandantoryError = true;  
                          mandantoryErrorText +="<br/> <span style=\"float:left;\"> - "+ $obj.data("mandantoryerrortext")+"</span>";
                        }
                      }
                      if (element.getAttribute('type')=='checkbox') {
                        data[$obj.attr('id')] = element.checked;      
                      }
                    }else if(element.tagName=="SELECT") {
                      // $(element).find('option.show:selected').data('id');
                      data[$obj.attr('id')] = $(element).find('option:selected').data('id');
                    }else if(element.tagName=="TEXTAREA") {
                      data[$obj.attr('id')] = $obj.val();
                    }
                });

                
                if (mandantoryError) {
                  var t = "Hiba";
                  var u = " <span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x] Kérem adjon meg minden szukseges adatokat:"+mandantoryErrorText+"</span>";
                  var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
                  return false;
                }


                data.modUser = auth.user.name;
                $scope.insertUser({_id:_id,data:data});
                // console.log(data);
                // return false;
                $(this).dialog('close');

              }
            },
            'Mégse':{
              text:'Mégse',
              id:'megse_gomb',
              click:function(e){
                $(this).dialog('close');
                $(this).empty();
                if ($(".ui-dialog").exists()) {
                  $(".ui-dialog").css("z-index","101");
                }
              }
            },
            'Reset':{
              text:'Alaphelyzet',
              id:'reset_gomb',
              click:function(e){
                $("#insertButton").click();
              }
            }
          }
        });

        break;
      case "update":
        t = "Felhasználó ";
        u = response.data.html

        viewDialog.html(u);
        var element = $("#userPassword").children().find('input,select,textarea');
        element.filter("#password,#passwordConfirm").css({"background": "#bab6b2"});
        viewDialog.dialog({
          'title':t + " adatainak módosítása",
          'dialogClass':'alert',
          'closeOnEscape':false,
          'close':function(){},
          'open': function(event, ui) {
              $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
          },
          'width':'auto',
          'minHeight':220,
          'modal':true,
          'resizable':false,
          'buttons':{
            'Rögzítés':{
              text:'Módosítás',
              id:'rogzites_gomb',
              click:function(e){


                if (!$("#viewForm")[0].checkValidity()) {
                  var t = "Hiba";
                  var u = " <span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x] Hibás email formátum!</span>"+
                  "<br><span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">Kérem adja meg ismételten!</span>";
                  var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
                  return false;
                }

                var data = {};
                var mandantoryError = false;
                var mandantoryErrorText = "";
                var _id = $("#hiddenData").find("#_id").val();
                var passwordChanged = (($("#hiddenData").find("#passwordChanged").val()=="true")? true:false);
                var elements = $("#viewContener").find("input,select,textarea").not("#login-submit,#password,#passwordConfirm");

                if(passwordChanged && $("input[type=password]").eq(0).val()!=$("input[type=password]").eq(1).val()){
                  var t = "Hiba";
                  var u = "<span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x]A megadott jelszavak nem egyeznek meg!</span>"+
                          "<!-- <br/><span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x] Kérem ismételten adja meg!</span> -->"
                  var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
                  return false;
                }else if(passwordChanged){
                  elements = $("#viewContener").find("input,select,textarea").not("#login-submit");
                }

                elements.each(function(index,element){
                  var $obj = $(element);
                  if (element.tagName=="INPUT") {
                    if ($obj.val() != "") {
                      data[$obj.attr('id')] = $obj.val();
                    }else{
                      if ($obj.data("mandantory")) {
                        mandantoryError = true;  
                        mandantoryErrorText +="<br/> <span style=\"float:left;\"> - "+ $obj.data("mandantoryerrortext")+"</span>";
                      }
                    }
                    if (element.getAttribute('type')=='checkbox') {
                      data[$obj.attr('id')] = element.checked;      
                    }
                    
                  }else if(element.tagName=="SELECT") {
                    // $(element).find('option.show:selected').data('id');
                    data[$obj.attr('id')] = $(element).find('option:selected').data('id');
                  
                  }else if(element.tagName=="TEXTAREA") {
                    data[$obj.attr('id')] = $obj.val();
                  }
                });

                if (mandantoryError) {
                  var t = "Hiba";
                  var u = " <span class=\"hiba\" style=\"display:block;width:100%;clear:left;text-align:center;\">[x] Kérem adjon meg minden szukseges adatokat:"+mandantoryErrorText+"</span>";
                  var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
                  return false;
                }

                data.modUser = auth.user.name;
                data.modDate = new Date().toString();
                $scope.updateUser({_id:_id,data:data});
                $(this).dialog('close');

              }
            },
            'Mégse':{
              text:'Mégse',
              id:'megse_gomb',
              click:function(e){
                $(this).dialog('close');
                $(this).empty();
                if ($(".ui-dialog").exists()) {
                $(".ui-dialog").css("z-index","101");
                }
              }
            },
            'Reset':{
              text:'Alaphelyzet',
              id:'reset_gomb',
              click:function(e){
                var _id = $("#hiddenData").find("#_id").val();
                $("table tr").filter("#"+_id).find("td:last").find("[data-action='update']").click();
              }
            }
          }
        });
        break;
      case "delete":
        t = "Felhasználó adatainak törlése";
        u = response.data.html+'<span class="hiba" style="display:block;width:100%;clear:left;text-align:center;">Biztosan törli a felhasználót!</span>'
        
        viewDialog.html(u);
        var element = $("#viewContener").children().find('input,select,textarea').attr('disabled',true);
        element.filter(":not(#modifyPassword)").css({"background": "#bab6b2"});
        viewDialog.dialog({
          'title':t,
          'dialogClass':'alert',
          'closeOnEscape':true,
          'close':function(){},
          'width':'auto',
          'minHeight':220,
          'modal':true,
          'resizable':false,
          'buttons':{
            'Igen':{
                text:'Igen',
                id:'igen_gomb',
                click:function(e){
                  if ($(".ui-dialog").exists()) {
                    $(".ui-dialog").css("z-index","101");
                  }
                  var _id = $("#hiddenData").find("#_id").val();
                  $scope.deleteUser({_id:_id});
                  $(this).dialog('close');
                }
              },
            'Nem':{
              text:'Nem',
              id:'nem_gomb',
              click:function(e){
                $(this).dialog('close');
                }
              }
          }
        });

        break;

      default:
        break;
    }

    $("#modifyPassword").on("click",function(e){

      e.stopImmediatePropagation();
      e.stopPropagation();
      e.cancelBubble = false;
      $("#userPassword #password").attr("disabled",false).css({"background": ""});
      $("#userPassword #passwordConfirm").attr("disabled",false).css({"background": ""});
      $(this).toggleClass("hide");
      $("#cancelPassword").toggleClass("hide");      
      $("#passwordChanged").val(true);

    });

    $("#cancelPassword").on("click",function(e){
      
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.cancelBubble = false;
      $("#userPassword #password").attr("disabled",true).css({"background": "#bab6b2"}).val("");
      $("#userPassword #passwordConfirm").attr("disabled",true).css({"background": "#bab6b2"}).val("");
      $(this).toggleClass("hide");
      $("#modifyPassword").toggleClass("hide");
      $("#passwordChanged").val(false);

    });

   

    //Toggle csatolt fajlok menu
    // $('#userPassword legend:first').addClass('toggle_link color_green');
    // $('#userPassword legend:first').on('click',function(e){
    //   e.stopImmediatePropagation();
    //   e.stopPropagation();
    //   e.cancelBubble = false;
    //   $(this).children().toggleClass('toggle_down');
    //   $(this).children().toggleClass('toggle_up');
    //   $(this).toggleClass('color_green');
    //   $('#userPassword div').toggle('fast');
    // });

    // $('#userOther legend:first').addClass('toggle_link color_green');
    // $('#userOther legend:first').on('click',function(e){
    //   e.stopImmediatePropagation();
    //   e.stopPropagation();
    //   e.cancelBubble = false;
    //   $(this).children().toggleClass('toggle_down');
    //   $(this).children().toggleClass('toggle_up');
    //   $(this).toggleClass('color_green');
    //   $('#userOther div').toggle('fast');
    // });

    return viewDialog;

  }

  /**
   * SetEvent:dataTable draw esemenye soran az event handelereket a kivant elemekhez  
   * rendeli
   ---------------------------------------------------------------------------- */
  $scope.setEvent = function(o_params){

    

    $(".controller").on("click",function(e){
      try {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.cancelBubble = false;
  
        var obj = $(this);
        var actRow = obj.parents("tr");
        var data = {
          action:obj.data("action"),
          _id:((obj.attr("id")!="insertButton")? actRow.attr("id"):""),
          token:auth.token
        };
  
        $.when(
          $.ajax({
            url: $scope.baseUrl+$scope.dataTableParams.ajaxPage,
            data:data,
            type:'post',
            //processData:false,
            // contentType:false,
            dataType:"json",
            async:false,
            error: function(error){  // error handling
              var t = "Hiba....";
              var u = '<span class="hiba" ></span>'+
                      '<br/><span class="hiba" >'+error.responseText+'</span>';
              uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
            },
            success: function(adatok){
              //itt a felületnek kellmajd vissza jönnie
              // if(!(jQuery.isEmptyObject(adatok.table))){
              // }else{
              // }
            }
          })
        ).then(function(response, textStatus, jqXHR){
          if (response.status) {
            $scope.getViewDialog({response:response,action:data.action});
          }else{
            var t = "Hiba....";
            var u = '<span class="hiba" ></span>'+
                    '<br/><span class="hiba" >'+response.data.msg+'</span>';
            uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
          }
  
        });//ajax
  
        
      } catch (error) {
        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+error+'</span>';
        uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
     
    });  
  }

  /**
   *  Felhasznalok lekerdezese,valamint a karbantarto felulet elkeszitese
   ---------------------------------------------------------------------------- */ 
  $scope.getUsers = function(){

    var data = { 
      token:auth.token,
      email:"",
      name:""
    };

    var that = this;
    var t = "";
    var u = "";
    var uzenetDialog = {};

    $http.post("/getUsersFromDB",data).then(function(response){

      if (response.status) {

        if($("#users_dataTable").exists()){
          $("#usersContener").find("#resultList").empty();
        }


        var dataTable = $scope.getDataTable(response.data.data);
      }else{

        t = "Hiba....";
        u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
        uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
    },function(error){
      t = "Hiba....";
      u = '<span class="hiba" ></span>'+
              '<br/><span class="hiba" >'+error.data.msg+'</span>';
              
      
      uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
    });

  }

  $scope.insertUser = function (o_params) {
    var data = $.extend({_id:"",token:auth.token,data:""},o_params);

    $http.post("/insertUser",data).then(function(response){

      if (response.status) {
        var t = "Üzenet...";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        $scope.getUsers();
        
      }else{
        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+error.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
    },function(error){
      var t = "Hiba....";
      var u = '<span class="hiba" ></span>'+
              '<br/><span class="hiba" >'+error.data.msg+'</span>';
      var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
    });
  }

  $scope.updateUser = function(o_params){

    var data = $.extend({_id:"",token:auth.token,data:""},o_params);
    $http.post("/updateUser",data).then(function(response){

      if (response.status) {

        var t = "Üzenet...";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        $scope.getUsers();
        
      }else{
        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+error.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
    },function(error){
      var t = "Hiba....";
      var u = '<span class="hiba" ></span>'+
              '<br/><span class="hiba" >'+error.data.msg+'</span>';
      var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
    });

  }

  $scope.deleteUser = function(o_params){

    var data = $.extend({_id:"",token:auth.token},o_params);
    $http.post("/deleteUser",data).then(function(response){

      if (response.status) {

        var t = "Üzenet...";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
        $scope.getUsers();
      }else{

        var t = "Hiba....";
        var u = '<span class="hiba" ></span>'+
                '<br/><span class="hiba" >'+response.data.msg+'</span>';
        var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
      }
    },function(error){

      var t = "Hiba....";
      var u = '<span class="hiba" ></span>'+
              '<br/><span class="hiba" >'+error.data.msg+'</span>';
      var uzenetDialog = (($("#uzenet").exists())? $('#uzenet').aDialog('',t,u) :$('<div id="uzenet">').appendTo("body").aDialog('',t,u));
    });


  }

  if(auth.auth){
    $scope.getUsers();
  }

}]);
