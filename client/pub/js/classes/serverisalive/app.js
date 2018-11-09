
'use strict'
/** @license MIT License (c) copyright 2010-2014 original author or authors */

/**
 * @param 
 * @return 
 * @module
 * @author Nagy Péter
 * @version 1.01.001
 */

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

var logParams={
    path:__dirname+"/public/files/log/"
    ,file:"serverInfo.log"
    ,fileName:"test"
    ,extension:"log||text"
    ,fileSize:10000
    ,currentFile:""
    //w||a
    // ,writeMod:"a"
    ,divide:"*".repeat(80)
  };
  
const logger  = require('./classes/logger.js').createLogger(logParams);
const q = require('q');


var serverInfoParams = {
    hosts:[{ip:'0.0.0.0', name:'??',alive:null,info:null},
			{ip:'0.0.0.0', name:'??',alive:null,info:null}
	],
    logger:logger
};

const ServerInfo = require('./classes/server_info').createServerInfo();
ServerInfo.isAlive(serverInfoParams.hosts).then(function(response){
    console.log('Response');
    console.log(response);
});
