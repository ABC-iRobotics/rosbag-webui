
"use strict"
    /** @license MIT License (c) copyright 2010-2014 original author or authors */

    /**
     * @param 
     * @return 
     * @module
     * @author Nagy Péter
     * @version 1.01.001
     */

    /**
     *require moduls which I use
    */
    const q = require("q");
    const rosBag = require("rosbag");
    const fs = require("fs");
    const cmd = require("shelljs")

    var logParams = {
    path:__dirname+"/../public/files/log/"
        ,file:"rosManager.log"
        ,fileName:"rosManager"
        ,extension:"log||text"
        ,fileSize:100000000
        ,currentFile:""
        //w||a
        // ,writeMod:"a"
        ,divide:"*".repeat(80)
        ,debug:false
    };
    const logger  = require("./logger.js").createLogger(logParams);

    const net = require("net");
    //#region  forexample check server is alive
    /*1. check server is alive
        var net = require('net');
        var hosts = [['google.com', 80], ['stackoverflow.com', 80], ['google.com', 444]];
        hosts.forEach(function(item) {
            var sock = new net.Socket();
            sock.setTimeout(2500);
            sock.on('connect', function() {
                console.log(item[0]+':'+item[1]+' is up.');
                sock.destroy();
            }).on('error', function(e) {
                console.log(item[0]+':'+item[1]+' is down: ' + e.message);
            }).on('timeout', function(e) {
                console.log(item[0]+':'+item[1]+' is down: timeout');
            }).connect(item[1], item[0]);
        });

    */

    /* 2.
    var net = require('net');
    var Promise = require('bluebird');

    function checkConnection(host, port, timeout) {
        return new Promise(function(resolve, reject) {
            timeout = timeout || 10000;     // default of 10 seconds
            var timer = setTimeout(function() {
                reject("timeout");
                socket.end();
            }, timeout);
            var socket = net.createConnection(port, host, function() {
                clearTimeout(timer);
                resolve();
                socket.end();
            });
            socket.on('error', function(err) {
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    checkConnection("example1.com", 8080).then(function() {
        // successful
    }, function(err) {
        // error
    })
    */

    /*3.
    var serverInfoParams = {
        hosts:[
            {ip:'0.0.0.0', name:'ROSMASTER',alive:null,info:null},
            {ip:'np164u3f-virtual-machine', name:'np164u3f-virtual-machine:40871',alive:null,info:null}
        ],
        logger:logger
    };
    // ./classes/server_info
    const ServerInfo = require('../../serverisalive/classes/server_info').createServerInfo();
    ServerInfo.isAlive(serverInfoParams.hosts).then(function(response){
        console.log('Response');
        console.log(response);
    });
    */
    //#endregion


    /**
     * 
     */
    class ROSManager{
    
        /**
         * @param {*} params 
         */
        constructor(params){
            try{

                this.settings = Object.assign({
                "cores":[{"host":"np164u3f-virtual-machine","port":11311,"timeout":10000}],
                "nodes":{},
                "topics":{},
                "rosbags":{
                "actBags":[],
                "files":[{"path":"","topics":[]}],
                "sourceFolderPath":".",
                "destinationFolderPath":"."
                },
                "callBack":new function(p){
                },
                "logger":null,
                "debug":false,
                "messages":[]
                },params);

                if (this.settings.logger === null) {
                    this.logger = logger;
                }else{
                    this.logger = this.settings.logger;
                }
            
                this.response = {"status": false,"msg":{},"error":{}};
                this.q = q;
                this.rosBag = rosBag;
                this.fs = fs;
                this.conn = null;
                this.logger = logger;
                this.cmd = cmd;
                this.net = net;
                this.logger.logWrite(true,"\r\n [x] A rosManager ini. sikeresen megtörtént ("+logger.getDate()+").");
                
                //it's need to close conenction
                this.sleepTime = 500; //ms
                this.debug = this.settings.debug;

            }catch(error){
                logger.logWrite(true,"\r\n [x] Hiba a rosManager ini.-kor!\r\n"+error);
            }
        }

        /**
         * @description
         */
        setParams(params){
            try {
                Object.assign(this.settings,params);    
            } catch (error) {
                if (debug)
                {
                    console.log("\r\n [x] Hiba a pareméterek beállítása során!\r\n"+error.stack);
                }
                if (logger!=null) 
                {
                    logger.logWrite(true,"\r\n [x] Hiba a connection string generálás során !\r\n"+error.stack);
                }
            }
        }

        /**
         * 
         * @param {*} host 
         * @param {*} port 
         * @param {*} timeout 
         * @description
         */
        
        checkROSMaster(host=null, port=null, timeout=null) {

            if (host===null) {
                host=this.settings.cores[0].host;
            }
            if (port===null) {
                port=this.settings.cores[0].port;
            }
            if (timeout===null) {
                timeout=this.settings.cores[0].timeout;
            }

            return new Promise(function(resolve, reject) {
                timeout = timeout || 10000;     // default of 10 seconds
                var timer = setTimeout(function() {
                    reject("timeout");
                    socket.end();
                }, timeout);
                var socket = net.createConnection(port, host, function() {
                    clearTimeout(timer);
                    resolve({"state":true,"msg":"\r\n [x] A ROSMaster alapota running!","data":{}});
                    socket.end();
                });
                socket.on('error', function(err) {
                    clearTimeout(timer);
                    reject({"state":false,"msg":"\r\n [x] A ROSMaster alapota not running!","data":err});
                });
            });

        }

        /**
         * 
         * @param {*} host 
         * @param {*} port 
         * @description
         */
        startROSMaster(host=null,port=null){

            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {
                // $export ROS_MASTER_URI=http://YourPC:1234/
                // $roscore -p 1234
                var a = cmd.exec('roscore', {silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az ROSMaster indítása a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                    if ((code=1 && stderr.includes("ERROR")) || stderr.includes("cannot run") ) {
                        that.logger.logWrite("\r\n [x] Hiba a ROSMaster indítása során!"+stderr);
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba a ROSMaster indítása során!"+stderr,
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!="" && !stderr.includes("cannot run")){
                        that.logger.logWrite("\r\n [x] A ROSMaster indítása sikeresen megt.!");
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] A ROSMaster indítása sikeresen megt.!",
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                    }else{
                        that.logger.logWrite("\r\n [x] Hiba a ROSMaster indítása során!"+stderr);
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba a ROSMaster indítása során!"+stderr,
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                        
                    }
                });
                
            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba a ROSMaster indítása során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba a ROSMaster indítása során!"+error,
                    "data":[]
                });
            }
            return deffered.promise;
        }
        /**
         * @description
         */
        stopROSCore(){
        //command killall -9 roscore
        }

        /**
         * @description
         */
        stopROSMaster(){

            //command killall -9 rosmaster

            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {
                // $export ROS_MASTER_URI=http://YourPC:1234/
                // $roscore -p 1234

                var a = cmd.exec('killall -9 rosmaster', {silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az ROSMaster leállítása a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                    if ((code=1 && stderr.includes("ERROR")) || stderr.includes("cannot run") ) {
                        that.logger.logWrite("\r\n [x] Hiba a ROSMaster leállítása során!"+stderr);
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba a ROSMaster leállítása során!"+stderr,
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!="" && !stderr.includes("cannot run")){
                        that.logger.logWrite("\r\n [x] A ROSMaster leállítása sikeresen megt.!");
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] A ROSMaster leállítása sikeresen megt.!",
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                    }else if(code===false&&stdout==""&& stderr==""){
                        that.logger.logWrite("\r\n [x] A ROSMaster leállítása sikeresen megtörtén!",);
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] A ROSMaster leállítása sikeresen megtörtén!",
                            "data":{"code":code,"stdout":stdout,"stderr":stderr}
                        });
                        that.logger.logWrite("\r\n [x] Hiba a ROSMaster leállítása során!"+stderr);
                    }
                });

                
            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba a ROSMaster leállítása során!"+error);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba a ROSMaster leállítása során!"+error.stack,
                    "data":[]
                });
            }

            return deffered.promise;
        }
        
        /**
         * 
         * @param {*} file 
         * @param {*} extensions 
         */
        checkFileExtension(file,extensions){

            var res = true;
            var extension = file.substr((file.lastIndexOf('.') +1));
            var ext = new RegExp(eval("/("+extensions+")$/ig"));
            if (!(ext.test(extension))) {
                res = false;
            }
            return res;

        }

        /**
         * 
         * @param {*} file 
         */
        addFiles(file){
            this.settings.rosbags.files.push(file);
        }

        /**
         * @description itt kinyerem a filokat ha tallozhato lesz akkor a ide lesz felmásolva a fájl és kész
         */
        getRosBagFiles(sourcePath = null,extensions = "bag||txt",callback = this.addFiles()){
            
            var that = this;
            var deffered = $q.defer();

            if (sourcePath == null) {
                sourcePath = this.settings.rosbags.sourceFolderPath;
            }
            
            try {

                if (!fs.existsSync(sourcePath)){
                    if (this.settings.debug){
                        console.log("\r\n [x] A rosbag forrás mappa nem létezik\r\n "+ sourcePath);    
                    }

                    if (logger != null){
                        logger.logWrite(true,"\r\n [x] A rosbag forrás mappa nem létezik\r\n "+ sourcePath);
                    }

                    return;
                }
            
                var files = fs.readdirSync(sourcePath);

                for(var i = 0; i<files.length; i++){

                    var filename = path.join(sourcePath,files[i]);
                    var stat = fs.lstatSync(filename);

                    if (stat.isDirectory()){
                        getRosBagFiles(filename,extensions,callback); 
                    }
                    else if (checkFileExtension(filename)){
                        callback(filename)
                    } 
                    else {
                        if (this.settings.debug) {
                            console.log("\r\n [x] Nem megfelelő fájlformátum \r\n "+ sourcePath);    
                        }
                        if (logger != null) {
                            logger.logWrite(true,"\r\n [x] Nem megfelelő fájlformátum \r\n "+ sourcePath);
                        } 
                    }
                }
                deffered.resolve({
                    "state":true,
                    "msg":"\r\n [x] Az  fileok kiolvasása sikeresen megtörtént!",
                    "data":this.settings.rosbags.files
                });
            } catch (error) {

                if (debug){
                    console.log("\r\n [x] Hiba a pareméterek beállítása során!\r\n"+error.stack);
                }
                if (logger!=null) {
                    logger.logWrite(true,"\r\n [x] Hiba a connection string generálás során !\r\n"+error.stack);
                }
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Az  fájlok kiolvasása sikertelen!\r\n Hiba:"+error.stack,
                    "data":this.settings.rosbags.files
                });
            }
            return deffered.promise;
        }

        /**
         * 
         * @param {*} bags 
         * @description
         * @deprecated not us.
         */

        getROSBagTopics(file){
            var that = this;
            var deffered = $q.defer();
            try {

                /**
                 * Itt csak a rosbag.js sel kiolvasom és bele teszem a topicok tartalmat 
                 * 
                 */
                
            } catch (error) {

                if (debug){
                    console.log("\r\n [x] Hiba a pareméterek beállítása során!\r\n"+error.stack);
                }
                if (logger!=null) {
                    logger.logWrite(true,"\r\n [x] Hiba a connection string generálás során !\r\n"+error.stack);
                }
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Az  fájlok kiolvasása sikertelen!\r\n Hiba:"+error.stack,
                    "data":this.settings.rosbags.files
                });
                
            }

            return deffered.promise;

        }

        /**
         * @description
         */
        getTopics(){

            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {

                var a = cmd.exec('rostopic list', {silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az adatok (topics) lekérése a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba az adatok (topics) lekérése során! "+stderr,
                            "data":{"topics":[]},
                            "dataType":"topics"
                        });
                        that.logger.logWrite("\r\n [x] Hiba az adatok (topics) lekérése során! "+stderr);

                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!=""){
                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var topics = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] Az adatok (topics) lekérése sikeresen megtörtént!"+topics);
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] Az adatok lekérése sikeresen megtörtént!",
                            "data":{"topics":topics},
                            "dataType":"topics"
                        });
                    }
                });

                
            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba az adatok (topics) lekérése során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba az adatok (topics) lekérése során!"+error,
                    "data":{"topics":[]},
                    "dataType":"topics"
                });
            }

            return deffered.promise;
        }

        /**
         * @description
         */
        getNodes(){
            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();
            try {

                var result = cmd.exec('rosnode list',{silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során! "+stderr,
                            "data":{"nodes":[]},
                            "dataType":"nodes"
                        });
                        that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!során! "+stderr);

                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!=""){
                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var nodes = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése sikeresen megtörtént!"+nodes);
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] Az adatok lekérése sikeresen megtörtént!",
                            "data":{"nodes":nodes},
                            "dataType":"nodes"
                        });
                    }
                });

            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során!"+error,
                    "data":{"nodes":[]},
                    "dataType":"nodes"
                });
            }
            return deffered.promise;
        }

        /**
         * @description
         */
        getNodes(){
            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();
            try {

                var result = cmd.exec('rosnode list',{silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során! "+stderr,
                            "data":{"nodes":[]},
                            "dataType":"nodes"
                        });
                        that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!során! "+stderr);

                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!=""){
                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var nodes = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése sikeresen megtörtént!"+nodes);
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] Az adatok lekérése sikeresen megtörtént!",
                            "data":{"nodes":nodes},
                            "dataType":"nodes"
                        });
                    }
                });

            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során!"+error,
                    "data":{"nodes":[]},
                    "dataType":"nodes"
                });
            }
            return deffered.promise;
        }

        /**
         * 
         * @param {*} node 
         */
        existsNode(node){
            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();
            try {

                var result = cmd.exec('rosnode list',{silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése a köv ered.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során! "+stderr,
                            "data":{"nodes":[],"recordExists":false},
                            "dataType":"nodes"
                        });
                        that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!során! "+stderr);

                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!=""){

                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var nodes = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] Az adatok (nodes) lekérése sikeresen megtörtént!"+nodes);
                        var nodeExists = nodes.indexOf(node);
                        if (nodeExists!=-1) {
                            deffered.resolve({
                                "state":true,
                                "msg":"\r\n [x] A node létezik",
                                "data":{"nodes":nodes,"recordExists":true},
                                "dataType":"nodes"
                            });    
                        } else {
                            deffered.resolve({
                                "state":false,
                                "msg":"\r\n [x] A node nem lézik",
                                "data":{"nodes":nodes,"recordExists":false},
                                "dataType":"nodes"
                            });    
                            
                        }
                        
                    }
                });

            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba az adatok (nodes) lekérése során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba az adatok (nodes) lekérése során!"+error,
                    "data":{"nodes":[],"recordExists":false},
                    "dataType":"nodes"
                });
            }
            return deffered.promise;
        }

        /**
         * 
         * @param {*} file 
         * @description
         */
        async  getMessages(file){
            var that = this;
            var deffered = that.q.defer();
            try{
                // default set read all or { topics: ["/turtle1/cmd_vel"] }
                const bag = await this.rosBag.open(`${file.fullPath}`);
                    await bag.readMessages( {},(result) => {

                that.settings.messages.push(result);
                });

                deffered.resolve({
                    "state":true,
                    "msg":"\r\n [x] A fájl beolvasása sikeresen végetért!",
                    "data":{}
                })

            }catch (error) {
                deffered.resolve({
                    "state":true,
                    "msg":"\r\n [x] A fájl beolvasása sikertelen!"+error.stack,
                    "data":{}
                })
            }
            // const bagOptions = {
            
            //     // an optional array of topics used to filter down
            //     // which data records will be read
            //     // the default is all records on all topics
            //     topics?: Array<string>,
            
            //     // an optional Time instance used to filter data records
            //     // to only those which start on or after the given start time
            //     // the default is undefined which will apply no filter
            //     startTime?: Time,
            
            //     // an optional Time instance used to filter data records
            //     // to only those which end on or before the given end time
            //     // the default is undefined which will apply no filter
            //     endTime? Time,
            
            //     // decompression callbacks:
            //     // if your bag is compressed you can supply a callback to decompress it
            //     // based on the compression type. The callback should accept a buffer of compressed bytes
            //     // and return a buffer of uncompressed bytes.  For examples on how to decompress lz4 and bz2 compressed bags
            //     // please see the tests here: https://github.com/cruise-automation/rosbag.js/blob/master/test/rosbag.js#L139
            //     // The decompression callback is also passed the uncompressedByteLength which is stored in the bag.
            //     // This byte length can be used with some decompression libraries to increase decompression efficiency.
            //     decompress?: {|
            //       bz2?: (buffer: Buffer, uncompressedByteLength: number) => Buffer,
            //       lz4?: (buffer: Buffer, uncompressedByteLength: number) => Buffer,
            //     |}
            
            //     // by default the individual parsed binary messages will be parsed based on their [ROS message definition](http://wiki.ros.org/msg)
            //     // if you set noParse to true the read operation will skip the message parsing step
            //     noParse?: boolean
            //   }

            return deffered.promise;
        }
        /**
         * 
         * @param {*} file 
         * @description
         */
        readROSBagFile(file){
            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {
                
                that.settings.messages = [];
                this.getMessages(file).then(function(data){
                    var messageData = null;
                    messageData = that.settings.messages;
                    that.settings.messages.forEach(function(element) {
                        var json = JSON.stringify(element);
                    });
                    deffered.resolve({
                        "state":true,
                        "msg":"\r\n [x] A fájl beolvasása sikeresen megtörtént!<br> Beolvasott fájl:"+file.fullPath+"<br><br>Beolvasott üzenetek száma:"+messageData.length,
                        "data":messageData
                    });
                },function(error){
                    deffered.resolve({
                        "state":false,
                        "msg":"\r\n [x] A fájl beolvasása sikertelen!",
                        "data":null
                    });

                });
            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba a fájl beolvasása során!"+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba a fájl beolvasása során!"+error.stack,
                    "data":{}
                });
            }
            return deffered.promise;
        }

        /**
         * 
         * @param {*} path 
         * @param {*} topics 
         * @param {*} nodes 
         * @param {*} all 
         * @description
         */
        startROSbagRecord(path = ".",topics = "test",nodes = "test",fileName ="test", all = false){
            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {
                //rosbag record  topics name -- node name -O path filename  __name:rosManagerBag 
                // 'rosbag record' + topics + '  -O '+name+'.bag __name:=rosManagerBag'
                // console.log('rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag &');
                
                var result = cmd.exec('rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag',{silent:true}, function(code, stdout, stderr) {
                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] A rosbag felvétel ered:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":" [x] Hiba rosbag record indítása során!"+
                            'rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag'+
                            stderr,
                            "data":{"recordExists":false}
                        });

                        that.logger.logWrite("\r\n [x] Hiba rosbag record indítása során!"+'rosbag record' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag'+stderr);
                    
                    } else if(code!=1 && !stderr.includes("ERROR") && !stderr.includes("Unknown")  && stdout!=""){
                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var nodes = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] rosbag record idítása sikeresne megtörtént!"+nodes);
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] A rosbag record idítása sikeresne megtörtént!",
                            "data":{"recordExists":true}
                        });
                    }else{
                        deffered.resolve({
                            "state":false,
                            "msg":" [x] Hiba rosbag record indítása során!"+
                            'rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag'+
                            stderr,
                            "data":{"recordExists":false}
                        });

                        that.logger.logWrite("\r\n [x] Hiba rosbag record indítása során!"+'rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+path+fileName+'.bag __name:=rosManagerBag'+stderr);
                    }   
                });
                /**
                 * Ez itt nem jo mert mindig igaz lesz. De most csak igy lesz jo
                 */
                deffered.resolve({
                    "state":true,
                    "msg":"\r\n [x] A rosbag record idítása lehet hogy sikeres!",
                    "data":{"recordExists":true}
                });

            } catch (error) {
                that.logger.logWrite("\r\n [x] Hiba rosbag record indítása során!"+'rosbag record' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+fileName+'.bag __name:=rosManagerBag'+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba rosbag record indítása során!"+'rosbag record ' + ((topics!="")? topics:"") +((nodes!="")?' --node='+nodes: "")+ '  -O '+fileName+'.bag __name:=rosManagerBag'+error.stack,
                    "data":{"recordExists":false}
                });
            }
            return deffered.promise;
        }

        /**
         * 
         * @param {*} node 
         * @description
         */
        stopROSbagRecord(node){

            var that = this;
            //deprecated: used native Promise
            var deffered = that.q.defer();

            try {

                var a = cmd.exec('rosnode kill '+node, {silent:true}, function(code, stdout, stderr) {

                    if (that.settings.debug) {
                        that.logger.logWrite("\r\n [x] A  felvétel leállításának  erd.:");
                        that.logger.logWrite("-Exit code:"+ code);
                        that.logger.logWrite('-Program output:'+ stdout);
                        that.logger.logWrite('-Program stderr:'+stderr);
                        that.logger.logWrite('-TypeOf:'+typeof(stderr));
                    }
                
                    if (code=1 && stderr.includes("ERROR")) {
                        
                        deffered.resolve({
                            "state":false,
                            "msg":"\r\n [x] Hiba a felvétel leállítása, a node ("+node+") törlése során! "+stderr,
                            "data":{}
                            
                        });
                        that.logger.logWrite("\r\n [x] Hiba a felvétel leállítása, a node ("+node+") törlése során! "+stderr);

                    } else if(code!=1 && !stderr.includes("ERROR") && stdout!=""){
                        var patt1 = /\n/;
                        var result = stdout.search(patt1);
                        var topics = stdout.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
                        that.logger.logWrite("\r\n [x] Hiba a felvétel leállítása, a node ("+node+") törlése során! ");
                        deffered.resolve({
                            "state":true,
                            "msg":"\r\n [x] A a felvétel leállítása,a node ("+node+") törlése sikeresne megtörtént! ",
                            "data":{}
                        });
                    }
                });

                
            } catch (error) {
                that.logger.logWrite("\r\n[x] Hiba a felvétel leállítása, a node ("+node+") törlése során! "+error.stack);
                deffered.resolve({
                    "state":false,
                    "msg":"\r\n [x] Hiba a felvétel leállítása, a node ("+node+") törlése során! "+error,
                    "data":{}
                });
            }

            return deffered.promise;
        }

        /**
         * @description
         */
        sleep(ms){
            return new Promise(resolve=>setTimeout(resolve,ms));
        }

    }

    exports.ROSManager  =  ROSManager;
    exports.createROSManager = function(ROSManagerParams) {
    return new ROSManager(ROSManagerParams);
    };