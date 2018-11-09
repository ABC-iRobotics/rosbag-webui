'use strict'
/** @license MIT License (c) copyright 2010-2014 original author or authors */

/**
 * @param 
 * @return 
 * @module
 * @author Nagy Péter
 * @version 1.01.001
 */

  /**
   * @description require moduls which I use
   */
  
  var bodyParser  = require('body-parser');
  var express = require('express')
    , http = require('http')
    , https = require('https')
    // , compression = require('compression')
    , app = express()
    , Buffer = require("buffer").Buffer
    , q = require('q')
    , ServerInfo = require('./client/pub/js/classes/serverisalive/classes/server_info.js').createServerInfo({})
    , ROSManager = require("./client/pub/js/classes/rosManager/classes/rosManager").createROSManager({})
    , rosBag = require('rosbag')
    , FileManager = require('./pub/js/fileManager.js').createFileManager({});



  const config = require("./client/pub/js/classes/modelManager/classes/config.js");
  const jwt = require("./client/pub/js/classes/modelManager/node_modules/jsonwebtoken");
  const path = require("path");
  const UserManager = require(path.join(__dirname,"client","pub","js","classes","modelManager","classes","userManager.js")).createUserManager({});
  const fs = require("fs");


  /**
   * @description Logger inic.
   */
  var logParams={
    path:__dirname+"/pub/files/log/"
    ,file:"webserver.log"
    ,fileName:"test"
    ,extension:"log||text"
    ,fileSize:100000000
    ,currentFile:""
    //w||a
    // ,writeMod:"a"
    ,divide:"*".repeat(80)
    ,debug:false
  };
  const logger  = require('./pub/js/classes/logger.js').createLogger(logParams);

  /**
   * @description Debug option
   */
  const debug = false;

  /**
   * @description Static option
   */

  var options = {};
  // var options = {
  //   dotfiles: 'ignore',
  //   etag: false,
  //   extensions: ['htm', 'html'],
  //   index: false,
  //   maxAge: '1d',
  //   redirect: false,
  //   setHeaders: function (res, path, stat) {
  //     res.set('x-timestamp', Date.now())
  //   }
  // }

  // app.use(compression);
  app.use(express.static(__dirname + '/client',options));
  app.all((req,res,next)=>{
   //   //All http request 
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));

  /**
   * @description Static option
   */
  app.use(function(req, res, next) {
    logger.logWrite(true,'\r\n [x] Http request:'+req.method+req.url+req.path);
    if(debug){
      console.log('\r\nHttp request: \r\n - %s,\r\n - %s,\r\n - %s \r\n -----------------------------------------------',req.method,req.url,req.path); 
    }
    res.header("Access-Control-Allow-Origin", "*");
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware

    res.type('application/json');
    req.chance = Math.random();
    //All http request 
      if (
          req.url.replace(/^\s+|\s+$/g,'')!="/login" 
          && req.url.replace(/^\s+|\s+$/g,'')!="/logout" 
          && req.url.replace(/^\s+|\s+$/g,'')!="" 
          && req.method!='GET'
        ) {
        try {
          //MINIDG TRUE LESZ EMIATT 
          var token = null;

          if ("guest"=="guest") {
           token = jwt.sign({ "id":"124578" }, config.secretKey, {
              expiresIn: 86400 // expires in 24 hours
            });  
          }else{
            token = req.body.token;
          }
          
          jwt.verify(token, config.secretKey, function(err, decoded) {
            if (err){
              // res.statusCode = 307;
              res.clearCookie("rosManager");
              res.statusMessage = "[x] Sikertelen(1)!";
              res.redirect(307,"/logout");
              // res.send({status:true,data:{},msg:{}});
              res.end();
            }else{
              //Sikeres
            }
          });

      } catch (error) {
        // res.statusCode = 307;
        res.statusMessage = "[x] Sikertelen(2)!";
        res.redirect(307,"/logout");
        // res.send({status:true,data:{},msg:{}});
        res.end();
      }
    }else{
    }
    next();
  });

  /**
   * @description Erro 
   */
  app.use((err,request,response,next)=>{
    logger.logWrite(true,'\r\n [x] Hiba:'+err);
  });

  var HOST = process.env.HOST ? '0.0.0.0' : 'localhost';
  var PORT = process.env.PORT || 8080;

  // var username = process.env.USERNAME;
  // var userDnsDomain = process.env.USERDNSDOMAIN;
  // console.log("Környezeti változók!",process.env);
  // app.set('envVariable',process.env);
  
  /**
   * @description Logfajl tartalmanak kiolvasasa
   */
  app.post('/getLogContent', function (req, res) {

    if (debug) {
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('Query');
      console.log(req.query);
    }
    
    var data = req.body;
    var fileManagerParams = data;
    FileManager.setSettings(fileManagerParams);

    try {
      FileManager.getFileContent().then(
        function(response){


          if (response.status) {

            if(!res.headersSent){
                res.status(200).send({status:true,data:response.content,msg:response.msg});
                res.end();
            }
            
          }else{
            if(!res.headersSent){
              res.status(200).send({status:false,data:response.content,msg:response.msg});
              res.end();
            }
          }

        },function(error){
          res.status(200).send({status:false,data:error,msg:error.statck});
          res.end();
        }
      );
    
    } catch (error) {
      console.log("\r\n Hiba:"+error.stack);
    }

  });
  
  /**
   * @description 
   */
  app.post('/readROSBagFile',function(req,res,next){
    try {

      if(debug){
        console.log('Body');
        console.log(req.body);
        console.log('Params');
        console.log(req.params);
        console.log('query');
        console.log(req.query);
      }
      var promises =[];
      var promise = null;

      promise =  ROSManager.readROSBagFile(req.body.file);
      console.log(promise);
      promises.push(promise);


      var response = {"state":false,"msg":"","data":{}};
      var data = {};
      Promise.all(promises).then(function(values){

        var msgErr = "";
        var msg = "";
        var data = {"topics":[],"nodes":[]};
        values.forEach(function(value) {
          
          if (!value.state) {
            msgErr +="<br>"+value.msg;
          }else{
            data = value.data;
            msg = value.msg;
          } 

        });

        if (msgErr!="") {
          response = {"state":false,"msg":msgErr,"data":data};
        } else {
          response = {"state":true,"msg":msg,"data":data};  
        }
        res.statusCode = 200;
        res.statusMessage = "[x] A kfájl beolvasása sikeres !";
        res.send(response);
        res.end();
      });
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] HIba a fájl beolvasása során! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] HIba a fájl beolvasása során! <br>"+error;
      res.send(response);
      res.end();

     }
  });

  /**
   * @description 
   */
  app.post('/palyROSBagFile',function(req,res,next){ 

    if(debug){
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('query');
      console.log(req.query);
    }

    try{

      if(debug) logger.logWrite(true,'\r\n [x] startRecord lekérdezése:');
      var promises =[];
      var promise = null;
      var response = {"state":false,"msg":"","data":{}};
      promise  = ROSManager.palyROSBagFile(req.body.file);
      promises.push(promise);
  
      setTimeout(function(){
        promise = ROSManager.existsNode("/playROSbagFile");
        promises.push(promise);
      }, 1000);

      Promise.all(promises).then(function(values){

        var msgError = "";
        var msg = "";
        var data = {};
        values.forEach(function(value) {
          if (!value.state) {
            msgError +="<br>"+value.msg;
          }else{
            msg = value.msg;
            data = value.data;
          } 
        });

        if (msgError!="") {
          response = {"state":false,"msg":msgError,"data":{}};
        } else {
          response = {"state":true,"msg":msg,"data":data};  
        }

        res.statusCode = 200;
        res.statusMessage = "[x] Az indítás siekres volt!";
        res.send(response);
        res.end();
      });
      
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] [x] Hiba volt az indítás során <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] [x] Hiba volt az indítás során <br>"+error;
      res.send(response);
      res.end();

     }
   
  });

  /**
   * @description 
   */
  app.post('/getTopicsNodes',function(req,res,next){

     try {

      if(debug){
        console.log('Body');
        console.log(req.body);
        console.log('Params');
        console.log(req.params);
        console.log('query');
        console.log(req.query);
      }

      if(debug) logger.logWrite(true,'\r\n [x] getTopicsNodes lekérdezése:');

      var promises =[];
      var promise = null;
      promise =  ROSManager.getTopics({});
      promises.push(promise);

      promise =  ROSManager.getNodes({});
      promises.push(promise);

      var response = {"state":false,"msg":"","data":{}};

      Promise.all(promises).then(function(values){

        var msg = "";
        var data = {"topics":[],"nodes":[]};


        values.forEach(function(value) {
          if (!value.state) {
            msg +="<br>"+value.msg;
          }else{
            data[value.dataType].push(value.data[value.dataType]);
          } 
        });

        if (msg!="") {
          response = {"state":false,"msg":msg,"data":data};
        } else {
          response = {"state":true,"msg":"","data":data};  
        }
        res.statusCode = 200;
        res.statusMessage = "[x] A kérés (getTopicsNodes) sikeres volt!";
        res.send(response);
        res.end();
      });
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error;
      res.send(response);
      res.end();

     }
  });

  /**
   * @description 
   */
  app.post('/getTopics',function(req,res,next){
    try {

      if(debug){
        console.log('Body');
        console.log(req.body);
        console.log('Params');
        console.log(req.params);
        console.log('query');
        console.log(req.query);
      }
      if(debug) logger.logWrite(true,'\r\n [x] getTopics lekérdezése:');
      var promises =[];
      var promise = null;
      promise =  ROSManager.getTopics({});
      promises.push(promise);

      var response = {"state":false,"msg":"","data":{}};

      Promise.all(promises).then(function(values){

        var msg = "";
        var data = {"topics":[],"nodes":[]};


        values.forEach(function(value) {
          if (!value.state) {
            msg +="<br>"+value.msg;
          }else{
            data[value.dataType].push(value.data[value.dataType]);
          } 
        });

        if (msg!="") {
          response = {"state":false,"msg":msg,"data":data};
        } else {
          response = {"state":true,"msg":"","data":data};  
        }
        res.statusCode = 200;
        res.statusMessage = "[x] A kérés (getTopics) sikeres volt!";
        res.send(response);
        res.end();
      });
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error;
      res.send(response);
      res.end();

     }
  });

  /**
   * @description 
   */
  app.post('/getNodes',function(req,res,next){
    try {

      if(debug){
        console.log('Body');
        console.log(req.body);
        console.log('Params');
        console.log(req.params);
        console.log('query');
        console.log(req.query);
      }
      if(debug) logger.logWrite(true,'\r\n [x] getNodes lekérdezése:');
      var promises =[];
      var promise = null;
      promise =  ROSManager.getNodes({});
      promises.push(promise);

      var response = {"state":false,"msg":"","data":{}};

      Promise.all(promises).then(function(values){

        var msg = "";
        var data = {"topics":[],"nodes":[]};


        values.forEach(function(value) {
          if (!value.state) {
            msg +="<br>"+value.msg;
          }else{
            data[value.dataType].push(value.data[value.dataType]);
          } 
        });

        if (msg!="") {
          response = {"state":false,"msg":msg,"data":data};
        } else {
          response = {"state":true,"msg":"","data":data};  
        }
        res.statusCode = 200;
        res.statusMessage = "[x] A kérés (getNodes) sikeres volt!";
        res.send(response);
        res.end();
      });
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] Hiba az adatok lekérdezése során (getTopocs,getNodes)! <br>"+error;
      res.send(response);
      res.end();

     }

  });

  /**
   * @description 
   */
  app.post('/checkRecord',function(req,res,next){
    
    try {

      if(debug){
        console.log('Body');
        console.log(req.body);
        console.log('Params');
        console.log(req.params);
        console.log('query');
        console.log(req.query);
      }
      if(debug) logger.logWrite(true,'\r\n [x] Felvétel ellen.:');
      var promises =[];
      var promise = null;
      promise =  ROSManager.existsNode(req.body.node);
      promises.push(promise);

      var response = {"state":false,"msg":"","data":{}};
      var data = {};

      Promise.all(promises).then(function(values){

        var msgError = "";
        var msg = "";
        values.forEach(function(value) {
          if (!value.state) {
            msgError +="<br>"+value.msg;
            data = value.data;
          }else{
            msg +="<br>"+value.msg;
            data = value.data;
          } 
        });

        if (msgError!="") {
          response = {"state":false,"msg":msgError,"data":data};
        } else {
          response = {"state":true,"msg":msg,"data":data};  
        }

        res.statusCode = 200;
        res.statusMessage = "[x] A felvétel ellen. sikeresen megt!";
        res.send(response);
        res.end();
      });
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] Hiba az adatok lekérdezése során (checkRecord)! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] Hiba az adatok lekérdezése során (checkRecord)! <br>"+error;
      res.send(response);
      res.end();

     }
  });

  /**
   * @description 
   */
  app.post('/startRecord',function(req,res,next){ 

    if(debug){
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('query');
      console.log(req.query);
    }

    try{

      if(debug) logger.logWrite(true,'\r\n [x] startRecord lekérdezése:');
      var promises =[];
      var promise = null;
      var response = {"state":false,"msg":"","data":{}};
      promise  = ROSManager.startROSbagRecord(req.body.path,req.body.topics,req.body.nodes,req.body.fileName,false);
      promises.push(promise);
  
      setTimeout(function(){
        promise = ROSManager.existsNode("/rosManagerBag");
        promises.push(promise);
      }, 1000);

      Promise.all(promises).then(function(values){

        var msg = "";
        values.forEach(function(value) {
          if (!value.state) {
            msg +="<br>"+value.msg;
          }else{
          } 
        });

        if (msg!="") {
          response = {"state":false,"msg":msg,"data":{}};
        } else {
          response = {"state":true,"msg":"","data":{}};  
        }

        res.statusCode = 200;
        res.statusMessage = "[x] Az indítás siekres volt!";
        res.send(response);
        res.end();
      });
      
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] [x] Hiba volt az indítás során <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] [x] Hiba volt az indítás során <br>"+error;
      res.send(response);
      res.end();

     }
   
  });

  /**
   * @description 
   */
  app.post('/stopRecord',function(req,res,next){ 

    if(debug){
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('query');
      console.log(req.query);
    }
    
    try{

      if(debug) logger.logWrite(true,'\r\n [x] startRecord lekérdezése:');
      var promises =[];
      var promise = null;
      var response = {"state":false,"msg":"","data":{}};
      promise  = ROSManager.stopROSbagRecord(req.body.node);
      promises.push(promise);

      setTimeout(function(){
        promise = ROSManager.existsNode("/rosManagerBag");
        promises.push(promise);
      }, 1000);
      
      Promise.all(promises).then(function(values){

        var msg = "";
        var c = 0;
        values.forEach(function(value) {
          if (!value.state && c == 0) {
            msg +="<br>"+value.msg;
          }else{
          } 
          c++;
        });

        if (msg!="") {
          response = {"state":false,"msg":msg,"data":{}};
        } else {
          response = {"state":true,"msg":"","data":{}};  
        }

        res.statusCode = 200;
        res.statusMessage = "[x] A kérés (getTopicsNodes) sikeres volt!";
        res.send(response);
        res.end();
      });
      
       
     } catch (error) {
      
      var response = {"state":false,"msg":error,"data":{}};
      response.state = false;
      response.msg = "[x] A kérés (getTopicsNodes) sikeres volt! <br>"+error
      response.data = {};
      res.statusCode = 200;
      res.statusMessage = "[x] A kérés (getTopicsNodes) sikeres volt! <br>"+error;
      res.send(response);
      res.end();

     }
   
  });
   
  //#region User manag.
  /**
   * @description User karbantarto view.
  */
  app.post('/getUserView', function (req, res) {

    var data = req.body;
    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });


    UserManager.getView(data).then(
      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] Sikeres "+req.body.action+" view lekérése!";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a view lekérése során!";
          res.send({status:false,data:{},msg:response.msg});
        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba a view lekérése során!";
        res.send({status:false,data:error,msg:error});

      }
    );



  });

  /**
   * @description Remove user.
   */
  app.post('/deleteUser', function (req, res) {
     
    var data = req.body;
    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.deleteUser(data).then(

      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó sikeresn törölve lett.";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba felhasznalo törlése során!";
          res.send({status:false,data:{},msg:response.msg});
        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba felhasznalo törlése során!";
        res.send({status:false,data:error,msg:error});

      }
    );
  });

  /**
   * @description Update user.
   */
  app.post('/updateUser', function (req, res) {
    var data = req.body;
    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.updateUser(data).then(

      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó adatai sikeresen módosítva lettek.";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba felhasznalo adatainak módosítása során!";
          res.send({status:false,data:{},msg:response.msg});
        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba felhasznalo adatainak módosítása során!";
        res.send({status:false,data:error,msg:error});

      }
    );

  });
  
  /**
   * @description Insert user.
   */
  app.post('/insertUser', function (req, res) {
    
    var data = req.body;
    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.insertUser(data).then(

      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó rögzítése sikeres.";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba A felhasználó rögzítése során!";
          res.send({status:false,data:{},msg:response.msg});
        }
      },function(error){
        res.statusCode = 500;
        res.statusMessage = "[x] Hiba felhasznalo adatainak módosítása során!";
        res.send({status:false,data:error,msg:error});

      }
    );
    
  });
  
  /**
   * @description Az aktualis user adatait kerem le.
   */
  app.post('/getUserFromDB', function (req, res) {
    
    var userData = { 
      token:req.body.token
      ,email:req.body.email
      ,name:req.body.name
    };
    

    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });


    UserManager.getUserFromDB(userData).then(
      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó adaatainak lekérése sikeres volt (UserManager)!";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során (UserManager)!";
          res.send({status:false,data:{},msg:response.msg});

        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során! (UserManager)";
        res.send({status:false,data:error,msg:error.message});

      }
    );

  });

  /**
   * @description Ki listazza az osszes felhasznalot.
   */
  app.post('/getUsersFromDB', function (req, res) {
    
    var userData = { 
      token:req.body.token
      ,email:req.body.email
      ,name:req.body.name
    };

    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.getUsersFromDB(userData).then(
      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó adatainak lekérése sikeres volt (UserManager)!";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során (UserManager)!";
          res.send({status:false,data:{},msg:response.msg});

        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során! (UserManager)";
        res.send({status:false,data:error,msg:error.message});

      }
    );

  });

  /**
   * @description 
   */
  app.post('/getUserFromAD', function (req, res) {
    
    UserManager.setParams({  
      dbParams:{
        uriParams:{
        protocol: 'mongodb',
        host:"127.0.0.1",
        port:"27017",
        db:"exampleDb",
        userName: "",
        password: ""
        }
      }
    });



    // { token:req.body.token,
    //   email:req.body.email,
    //   name:req.body.name,
    // };
    var userData = req.body;

    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    // var c_userManager = UserManager.createUserManager({});
    UserManager.getUsersFromDB(userData).then(
      function(response){
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó adaatainak lekérése sikeres volt (UserManager)!";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során (UserManager)!";
          res.send({status:false,data:{},msg:response.msg});

        }
      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során! (UserManager)";
        res.send({status:false,data:error,msg:error.message});

      }
    );
    
  }); 

  // app.locals.user = {};//globalis itt
  app.post('/registration', function (req, res) {
  
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Passwords do not match.');
      err.status = 500;
      res.send("passwords dont match");
    }
  
    if (
      req.body.email 
      && req.body.username 
      && req.body.password 
    ){

      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      }

      UserManager.setParams({  
        dbParams:{
          uriParams:{
            protocol: 'mongodb',
            host:"127.0.0.1",
            port:"27017",
            db:"rosManager",
            userName: "",
            password: ""
          }
        }
      });
      
      UserManager.userRegistration(userData).then(function(response){
    
        if (response.status) {

          res.statusCode = 200;
          res.statusMessage = "[x] A felhasználó regisztrálása sikeres volt (UserManager)!";
          res.send({status:true,data:response.data,msg:response.msg});
          
        }else{
          
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a felhasználó regisztrációja során (UserManager)!";
          res.send({status:false,data:{},msg:"[x] Hiba a felhasználó regisztrációja során (UserManager):\r\n"+response.msg});

        }

      },function(error){

        res.statusCode = 500;
        res.statusMessage = "[x] Hiba a felhasználó regisztrációja során! (UserManager)";
        res.send({status:false,data:error,msg:"[x] Hiba a felhasználó regisztrációja során! (UserManager): \r\n"+error.message});
        
      });

    }else {
  
        /**
         * Vagy legyen sima response vissza adva majd megnezem
         * ha azt szeretnem hogy tovabbi muvele is legyen akkor next -tel engedhetem
         * return next(err);
         */
          var err = new Error('[x] Nem volt megfelelő paraméter a felhasználó regisztrálása során!');
          err.status = 500;
          res.statusCode = 500 ;
          res.statusMessage = "[x] Nem volt megfelelő paraméter a felhasználó regisztrálása során!";
          res.send({status:false,data:err,msg: err.message});
        
    }
  });

  /**
   * @description Authentication, auth. etc. 
   * LOGINCHECK
   */
  app.post('/login_cehck',function(req,res,next){

    if (debug) {
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('Query');
      console.log(req.query);
    }

    var authparams = req.body;

    response.res.status = true;
    response.res.data = info;
    res.status(200).send(response);
    res.end();
  });

  /**
   * @description Authentication, auth. etc. 
   * LOGIN
   */
  app.post('/login',function(req,res,next){
    if (debug) {
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('Query');
      console.log(req.query);
    }

    var userData = {
      username: req.body.username,
      password: req.body.password,
    }


    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.login(userData).then(
      
      function(response){
        if (response.status) {

            if (response.data.auth) {
              res.statusCode = 200;
              res.statusMessage = "[x] Sikeres autentikálás (200)!";
              res.send({status:true,data:response.data,msg:response.msg});
            }else{
              res.statusCode = 401 ;
              res.statusMessage = "[x] Sikeres autentikálás!(401)";
              res.send({status:true,data:response.data,msg:response.msg});
            }


        }else{
          res.statusCode = 500;
          res.statusMessage = "[x] Hiba az autentikáció során!";
          //  res.send({status:false,data:response.data,msg:"[x] Hiba a bejelentkezes során (UserManager): <br>\r\n"+response.msg});
          res.send({status:false,data:response.data,msg:response.msg});
        }

      },function(error){

          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a bejelentkezes során! (UserManager)";
          // res.send({status:false,data:response.data,msg:"[x] Hiba a bejelentkezes soran során! (UserManager): <br>\r\n"+error.message});
          res.send({status:false,data:response.data,msg:error.message});
        
      }
    );
  });

  /**
   * @description Authentication, auth. etc. 
   * LOGOUT
   */
  app.post('/logout',function(req,res,next){
    if (debug) {
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('Query');
      console.log(req.query);
    }
    //torolni kell a cookibol is!
    UserManager.setParams({  
      dbParams:{
        uriParams:{
          protocol: 'mongodb',
          host:"127.0.0.1",
          port:"27017",
          db:"rosManager",
          userName: "",
          password: ""
        }
      }
    });

    UserManager.logout().then(
      function(response){
        if (response.status) {

          res.status(200).send({status:true,data:{auth:false,token:null},msg:"Kijelentkezve"});      

        }else{

          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a felhasználó adatainak lejérése során (UserManager)!";
          res.send({status:true,data:{auth:false,token:null},msg:response.msg});

        }
      }
      ,function(error){

          res.statusCode = 500;
          res.statusMessage = "[x] Hiba a kijelent kezes soran!";
          res.send({status:true,data:{auth:false,token:null},msg:"[x] "+error.message});

      }
    );

  });

  //#endregion

  /**
   * @description ServerInfo 
   */
  app.post('/serverInfo',function(req,res,next){

    if(debug){
      console.log('Body');
      console.log(req.body);
      console.log('Params');
      console.log(req.params);
      console.log('query');
      console.log(req.query);
    }
    

    if(debug) logger.logWrite(true,'\r\n [x] ServerInfo lekérdezése:');
    var response = {res:{status:false,data:null}};
    var serverInfoParams = req.body;
    var serverInfoResponse = {};
    var a = ServerInfo.isAlive(serverInfoParams.hosts).then(function(info){

    // var serverIp = null;
      for (let index = 0; index < info.length; index++) {

        var _serverInfo = null;
        _serverInfo = info[index];
        var reg = /\./g;
        var serverIp = _serverInfo.ip.replace(reg, "_");

        var serverStatus = ((_serverInfo.alive)? 'Run' :'Stop');
        var path = './pub/files/log/server_'+serverIp+'_'+serverStatus+'.log';
        var serverName = ((_serverInfo.serverName)? _serverInfo.serverName : '?');
        var d = '-------------------------------------------------------';
        var date = new Date();

            if (!fs.existsSync(path)) {
              var fd = fs.openSync(path, 'a+');
              fs.writeSync(fd,'\r\n'+d+'\r\n'+date+'\r\n'+serverIp+'\r\n Állapota:'+serverStatus);
            }else{
              // 'w+' - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
              // 'a+' - Open file for reading and appending. The file is created if it does not exist.
              var fd = fs.openSync(path, 'a+');
              fs.writeSync(fd,'\r\n'+d+'\r\n'+date+'\r\n'+serverIp+'\r\n Állapota:'+serverStatus);
            }
          }

      if(debug) logger.logWrite(true,'\r\n [x] Sikeres');
      response.res.status = true;
      response.res.data = info;
      res.status(200).send(response);
      res.end();

    },function(error){

      if(debug) logger.logWrite(true,'\r\n [x] Sikertelen');
      response.res.status = false;
      response.res.data = error;
      res.status(200).send(response);
      res.end();

    });

  });

  /**
   * @description 
   * @param {*} ms 
   */
  function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
  }
 
  /**
   * @description Create server  http
   */
  var server = http.createServer(app);
  server.listen(PORT,HOST,function(err){
    logger.logWrite(true,'\r\n [x] Serever inicializálása:');
    if (err == true) {

    if(debug)    
      console.log('Error:server is not running and not listening on '+PORT+'!');

    logger.logWrite(true,'\r\n [x] Hiba:'+'Error:server is not running and not listening on '+PORT+'!');
    } else {
        if(debug){
        console.log('Dirname:  ',__dirname);
        console.log('Filename: ',__filename);
        console.log('Server is running and listening  on:'+PORT);
        console.log('Server is running and listening  on:'+HOST);
      }
    
    logger.logWrite(true,'\r\n [x] Sikeres:');
    logger.logWrite(true,'\r\n Dirname:'+__dirname+'\r\n Filename: '+__filename+'\r\n Server is running and listening  on:'+PORT);
    }
  });



