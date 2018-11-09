'use strict'
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/**
 * Pants module.
 * @module 
 * @see module:my/shirt
 */
/**
 * @param nincs
 * @return nincs
 * @module logger
 * @see module
 * @author Nagy Péter
 * @version 1.01.001
 */


/*Dev. 1.01.002-ben stream lesz!*/
const fs = require("fs");
const p = require("path");
const q = require('q');

//????????????
// Object.defineProperty(exports, "__esModule", {
//     value: true
// });
/**
 * 
 */
class logger{
    /**
     * 
     * @param {*} loggerParams 
     * @description  logger modul.
     */
    constructor(loggerParams){

        this.settings = Object.assign({
            "path":".",
            "file":"",
            "fileName":"test",
            "extension":"log,text",
            "fileSize":100000000,
            "currentFile":"",
            "writeMod":"w",
            "divide":"*".repeat(80),
            "debug":false
        },loggerParams);
        
        this.response = {status:false,msg:{}};
        this.fs = fs;
        this.path = p;
        this.q = q;
        this.settings.path = p.normalize(this.settings.path);

        this.settings.file = ((this.settings.file=="")? this.settings.fileName+"."+this.settings.extension.split(",")[1] : this.settings.file);
        this.settings.currentFile = this.settings.file;

        this.debug = this.settings.debug;
    }

    /**
     * @description  
     */
    setSettings (params) {
        this.settings = Object.assign(this.settings, params)
    }

    /**
     * @description  
     */
    getDate(){
        // var date = new Date();
        var date = new Date()
        return date;
    }
    
    /**
     * 
     * @param {*} append 
     * @param {*} content 
     */
    logWrite(append,content){
        if(this.debug) console.log("\r\n [x] Logger:\r\n"+content);
            var res = true;
            var that = this;
            var deffered = this.q.defer();
            try {

                this.settings.writeMod  =   ((append)? "a" : this.settings.writeMod);
                if (!(this.checkFile(this.settings.currentFile))){
                    if(this.debug) console.log("\r\n [x] Dirname:",__dirname);
                    if(this.debug) console.log("\r\n [x] Path:"+this.settings.path+this.settings.currentFile);
                    res = false;
                }else{
                    // this.stream = fs.createWriteStream(log_file_path, {flags: 'a', encoding: 'utf8', mode: 0666});
                    // this.stream.write("\n");
                    // this.write = function(text) { this.stream.write(text); };
                    fs.open(this.settings.path+this.settings.currentFile, this.settings.writeMod, (err, fd) => {
                        if (err) {
                            if (err.code === 'EEXIST') {
                                if(this.debug) console.error('A fájl létezik');
                                res = false;
                            }else{
                                res = false;
                            }
                        }
                        
                        fs.write(fd,"\r\n "+that.settings.divide+"\r\n "+content+"\r\n "+that.settings.divide,"","utf8",(err,written,string)=>{
                            if (err) {
                                if(this.debug) console.error('myfile already exists');
                                res = false;
                                deffered.resolve({res:{status:false,msg:'\r\n [x] A logba történő írás sikertelen!'}});
                            }else{
                                deffered.resolve({res:{status:true,msg:'\r\n [x] A logba történő írás sikeresen megtörtént!'}});
                            }
                        });  

                    });
                }
                
            } catch (error) {
                if(this.debug) console.error(error);
                res = false;
                deffered.resolve({res:{status:false,msg:'\r\n [x] A logba történő írás sikeresen megtörtént!'}});
            }
        return deffered.promise;
        // return this.reponse;// ||res
    }
       
    /**
     * @description checkFile
     */
    checkFile(file){

        var res = true;
        if(this.settings.currentFile == "" && file!=""){
            this.settings.currentFile = file;
        }else if(this.settings.currentFile != "" && file != ""){
            this.settings.currentFile = file;
        }

        var checkExists = (( this.settings.writeMod=="a" )? this.checkFileExists() : true);
        var checkExtension = false;
        var checkSize = true;

        if (checkExists) {
            
            checkExtension = this.checkFileExtension();
            if (checkExtension && this.checkFileExists()) {
                checkSize = this.checkFileSize();    
            }

        }

        if(checkExists && checkExtension && checkSize){
            res = true;
        }else{
            var erroMsg = "Hibás fájl!";
            if (!checkExists) {
                erroMsg += "\r\n [x] A fájl nem létezik!";
            }
            if (!checkExtension) {
                erroMsg += "\r\n [x] A fájl kiterjezsztése nem megfelelő!";
            }
            if (!checkSize) {
                erroMsg += "\r\n [x] A fájl mérete nem megfelelő!";
            }
            console.log(erroMsg);
            res = false;
        }
        return res;
    }

    /**
     * @description checkFileExists
     */
    checkFileExists(){
        var res=true;
        if (!(fs.existsSync(this.settings.path+this.settings.file))) {
            res = false;
        }
        return res;
    }

    /**
     * @description checkFileExtension
     */
    checkFileExtension(){

        var res = true;
        var extension = this.settings.file.substr((this.settings.file.lastIndexOf('.') +1));
        var ext = new RegExp(eval("/("+this.settings.extension+")$/ig"));
        if (!(ext.test(extension))) {
            res = false;
        }

        return res;
    }

    /**
     * @description
     */
    getfileInfo(){
    }

    /**
     * @description checkFileSize
     */
    checkFileSize(){

        //Dev. ha nagyobb akkor lehetne  archíválni.
        var res = true;
        var file_info = fs.lstatSync(this.settings.path+this.settings.currentFile);
        var file_size = file_info.size;

        if (this.settings.fileSize<file_size) {
            
            if (this.settings.currentFile.split("_").length === 1) {
                var splitFilename = this.settings.currentFile.split(".");
                this.settings.currentFile = splitFilename[0]+"_1."+splitFilename[1];
            }else{
                var splitFilename = this.settings.currentFile.split(".");
                var counter = parseInt(splitFilename[0].split("_")[1]);
                this.settings.currentFile = splitFilename[0].split("_")[0]+"_"+(counter+1)+"."+splitFilename[1];
            }

            // res=false;
        }else{
        }
        return res;
    }
}




// This source code is licensed under the Apache License, Version 2.0,
// found in the LICENSE file in the root directory of this source tree.
// You may not use this file except in compliance with the License.
exports.logger  =  logger;
exports.createLogger = function(loggerParams) {
  return new logger(loggerParams);
};