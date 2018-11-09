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
 * @module MessageBroker
 * @see module
 * @author Nagy Péter
 * @version 1.01.001
 */


/*Dev. 1.01.002-ben stream lesz!*/
const fs = require("fs");
const p = require("path");
const q = require('q');

class FileManager{

    constructor(loggerParams){

        this.settings = Object.assign({

            path:"."
            ,file:""
            ,fileName:"test"
            ,extension:"log,text"
            ,fileSize:100000000

            ,currentFile:""
            ,writeMod:"w"
            ,divide:"*".repeat(80)

            ,debug:false
            ,charSet:"utf8"
            ,token:""

        },loggerParams);


        this.settings.current
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
     *@description set params
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
     * @description
     */
    getFileContent(){

        var that = this;
        var content = "";
        var deffered = this.q.defer();

        try {

            if (this.checkFileExists()) {
                // console.log("Realpath:"+this.fs.realpathSync(this.settings.currentFile));
                content = this.fs.readFileSync(this.settings.currentFile,this.settings.charSet);
                deffered.resolve({status:true,msg:'\r\n [x] A sikeres fájl olvasás!',content:content});
            } else {
                deffered.resolve({status:false,msg:"\r\n [x] Hiba a fájl tartalmának beolvasása során:Nem létezik a fájl:"+this.settings.currentFile,content:""});
            }

        } catch (error) {

            if(this.debug) console.log("\r\n [x] Hiba a fájl tartalmának beolvasása során!"+error.stack);
            deffered.resolve({status:false,msg:"\r\n [x] Hiba a fájl tartalmának beolvasása során!"+error.stack,content:""});

        }

        return deffered.promise;

    }



       
    /**
     *@description checkFile:meret,kitejesztes,letezik ellen, de lehet egyesevel is
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
        var res = true;
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
exports.FileManager  =  FileManager;
exports.createFileManager = function(fileManagerParams) {
  return new FileManager(fileManagerParams);
};