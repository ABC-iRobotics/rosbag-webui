'use strict'
/**
 * @param 
 * @return 
 * @author Nagy Péter
 * @version 1.01.001
 * @license MIT License (c) copyright 2010-2014 original author or authors 
 */

// var params={
//     hosts:[{ip:'192.168.1.105',name:'Saját'}]
// }

const ping = require('ping');
const fs = require("fs");
const p = require("path");
const q = require("q");

var logParams={
    path:__dirname+"/../public/files/log/"
    ,file:"serverInfo.log"
    ,fileName:"test"
    ,extension:"log||text"
    ,fileSize:100000000
    ,currentFile:""
    //w||a
    // ,writeMod:"a"
    ,divide:"*".repeat(80)
    ,debug:false
  };
const logger  = require('./logger.js').createLogger(logParams);

class ServerInfo{
    constructor(params){

        this.settings = Object.assign({
            hosts:[{ip:'0.0.0.0', description:'', serverName:'??', name:'??', alive:false, info:null},
                   {ip:'0.0.0.0', description:'', serverName:'??', name:'??', alive:false, info:null}],
            logger:null
        },params);

        if (this.settings.logger===null) {
            this.logger=logger;
        }else{
            this.logger=this.settings.logger;
        }

        this.response = {status: false,msg:{},error:{}};
        this.ping = ping;
        this.q = q;
        this.p = p;
        this.logger.logWrite(true,"\r\n [x] A serverInfo ini.sikeresen megtörtént ("+logger.getDate()+").");

    }

    setParams(o_params){
       Object.assign(this.settings,o_params);
    }

    ini(params){
        this.settings = Object.assign({
            hosts:[{ip:'0.0.0.0', description:'', serverName:'??', name:'??', alive:false, info:null},
                   {ip:'0.0.0.0', description:'', serverName:'??', name:'??', alive:false, info:null}],
            logger:null
        },params);
    }

    getInfo(host){
        var deffered = this.q.defer();
        this.ping.promise.probe(host.ip,{timeout:1}).then(function(info){
            host.alive = info.alive;
            host.info  = info;
            deffered.resolve(host);
        });
        return deffered.promise;
    }

    isAlive(_hosts){

        process.once('SIGINT', function() { process.exit(0)});
        var deffered = [this.q.defer()];
        var hosts = ((_hosts && Array.isArray(_hosts))? _hosts : this.settings.hosts);
        var that = this;
        var promises = [];
        if (hosts && Array.isArray(hosts)) {
            
            hosts = _hosts;
            for (let index = 0; index < _hosts.length; index++) {
                var promise =  this.getInfo(hosts[index]);
                promises.push(promise);
            }

            Promise.all(promises).then(function(value){
                logger.logWrite(true,'\r\n [x] Az adatok lekérdezése sikeresen megtörtént!');
                deffered[0].resolve(value);
            });

        } else {
            logger.logWrite(true,'\r\n [x] Hiba: Nincs host megadva!');
        }

        return deffered[0].promise;

    }
}

exports.ServerInfo = ServerInfo;
exports.createServerInfo = function(serverInfoParams) {
  return new ServerInfo(serverInfoParams);
};
