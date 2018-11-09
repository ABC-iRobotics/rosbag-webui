
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
 *require moduls which I use
 ---------------------------------------------------------------------------- */
//!npm install ./package.zip
// be kell a global vagy a local mappaba másolni npm list or npm list -g

// q:promiss. aszinkron kezelesehez
const q = require('q');
const fs = require("fs");
const path = require('path');//ez default
// activedirectory2: AD modul az AD authentikaciohoz
const ActiveDirectory = require('activedirectory2');
// titkositas itt lehetne a nodejs cypt def moduljat is hasznali
const bcrypt = require(path.join(__dirname, '../node_modules/bcyrpt', 'index.js'));
//json web token
const jwt = require("jsonwebtoken");
// Token ( session cookie ) kezeles
const cookie = require('cookie');
// adatbazis kezelo
const mongoose = require("mongoose");

//Logger modul felparmeterezese ez lesz azAuthentication default loggere

var logParams = {
    path:__dirname+"/../public/files/log/"
    ,file:"karbantarto.log"
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

/**
 *MongoDB models
 ---------------------------------------------------------------------------- */
const User = require("./models/user.js");
const Department = require("./models/department.js");
const config = require("./config.js");

/**
 * MongoDB schema karbantarto
 **/
class karbantarto{

/**
 * Authentication modul konstruktora
 *
 ---------------------------------------------------------------------------- */
    constructor(o_userManagerParams){

        try {

            //ezzel atmenetileg ki lehet kapcsolni a CA
            // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

            this.settings = Object.assign({
                _id:null
                ,dbParams:{
                    uriParams:{
                    protocol: 'mongodb',
                    host:"127.0.0.1",
                    port:"27017",
                    db:"rosManager",
                    userName: "",
                    password: ""
                }
               },
            },
            o_userManagerParams);

            if ( this.settings.logger == null ) {
                this.logger = logger;
            }else{
                this.logger = this.settings.logger;
            }

            this.response = {
                status:false,
                msg:{},
                data:{}
            };

            //a szukseges nodulok
            this.bcrypt = bcrypt;
            this.q = q;
            this.User = User;
            this.Department = Department;
            this.response = {};
            this.mongoose = mongoose;
            this.db = null;
            this.config = config;
            this.debug = false;

            this.logger.logWrite(true,"\r\n [x] Az auth. modul ini.sikeresen megtörtént ("+logger.getDate()+").");

        } catch (error) {
            logger.logWrite(true,"\r\n [x] Hiba a auth ini.-kor!\r\n"+error);
        }
    }

    getConnectionString(){

        /**
         * 1.mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
         * To connect to a single node replica set, specify the replicaSet option.
         * 2.mongoose.connect('mongodb://host1:port1/?replicaSet=rsName');
         * */


        //igy is lehet urit de van egyszerubb
        //mongoose.connect('mongodb://username:password@host:port/database?options...');
        //  var url = this.settings.dbParams.uriParams.protocol+"://"+
        //            this.settings.dbParams.uriParams.userName+":"+
        //            this.settings.dbParams.uriParams.password+"@"+
        //            this.settings.dbParams.uriParams.host;

        //2.itt  csak parameter lesz a user passwrod stb
        //mongoose.connect('mongodb://localhost/myapp');
        //ha local akkor nem kell a port
        //This is the minimum needed to connect the myapp database running locally on the default port (27017).
        //If the local connection fails then try using 127.0.0.1 instead of localhost. Sometimes issues may arise when the local hostname has been changed.

        //!!Localhost eseten itt 127.0.0.1

        try {
            var url = this.settings.dbParams.uriParams.protocol+"://"+
            this.settings.dbParams.uriParams.host+"/"+this.settings.dbParams.uriParams.db;    
        } catch (error) {
            if(this.debug) console.log("Hiba a connectionString"+error.message);
        }
        
        return url;
    }

    setParams(params){
        Object.assign(this.settings,params);
    }

    setDb(){
        // Output - 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting (soucre)
        /**
         * Connection.prototype.readyState
            Connection ready state

            0 = disconnected
            1 = connected
            2 = connecting
            3 = disconnecting
            Each state change emits its associated event name.

            Example
            conn.on('connected', callback);
            conn.on('disconnected', callback);

            A full list of options can be found on the MongoDB Node.js driver docs for connect(). Mongoose passes options to the driver without modification, modulo a few exceptions that are explained below.
            •bufferCommands - This is a mongoose-specific option (not passed to the MongoDB driver) that disables mongoose's buffering mechanism
            •user/pass - The username and password for authentication. These options are mongoose-specific, they are equivalent to the MongoDB driver's auth.user and auth.password options.
            •autoIndex - By default, mongoose will automatically build indexes defined in your schema when it connects. This is great for development, but not ideal for large production deployments, because index builds can cause performance degradation. If you set autoIndex to false, mongoose will not automatically build indexes for any model associated with this connection.
            •dbName - Specifies which database to connect to and overrides any database specified in the connection string. If you're using the mongodb+srv syntax to connect to MongoDB Atlas, you should use dbName to specify the database because you currently cannot in the connection string.

            Below are some of the options that are important for tuning mongoose.
            •autoReconnect - The underlying MongoDB driver will automatically try to reconnect when it loses connection to MongoDB. Unless you are an extremely advanced user that wants to manage their own connection pool, do not set this option to false.
            •reconnectTries - If you're connected to a single server or mongos proxy (as opposed to a replica set), the MongoDB driver will try to reconnect every reconnectInterval milliseconds for reconnectTries times, and give up afterward. When the driver gives up, the mongoose connection emits a reconnectFailed event. This option does nothing for replica set connections.
            •reconnectInterval - See reconnectTries
            •promiseLibrary - sets the underlying driver's promise library
            •poolSize - The maximum number of sockets the MongoDB driver will keep open for this connection. By default, poolSize is 5. Keep in mind that, as of MongoDB 3.4, MongoDB only allows one operation per socket at a time, so you may want to increase this if you find you have a few slow queries that are blocking faster queries from proceeding.
            •bufferMaxEntries - The MongoDB driver also has its own buffering mechanism that kicks in when the driver is disconnected. Set this option to 0 and set bufferCommands to false on your schemas if you want your database operations to fail immediately when the driver is not connected, as opposed to waiting for reconnection.

            Example:
            const options = {
                useMongoClient: true,
                autoIndex: false, // Don't build indexes
                reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
                reconnectInterval: 500, // Reconnect every 500ms
                poolSize: 10, // Maintain up to 10 socket connections
                // If not connected, return errors immediately rather than waiting for reconnect
                bufferMaxEntries: 0
            };

        *
        *
        */

        //mongoose.connection.close()

        try {

            var deffered = this.q.defer();
            var that = this;
            if(this.mongoose.connection.readyState == 0 || this.mongoose.connection.readyState == 3){
                // mongoose.connect('mongodb://localhost:27017/test?connectTimeoutMS=1000&bufferCommands=false');
                var uri = this.getConnectionString();
                var options =  {
                    socketTimeoutMS: 0,
                    keepAlive: true,
                    connectTimeoutMS: 1000,
                    // Note that mongoose will **not** pull `bufferCommands` from the query string
                    autoIndex: false, // Don't build indexes
                    reconnectTries: 1,
                    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
                    reconnectInterval: 500, // Reconnect every 500ms
                    poolSize: 10, // Maintain up to 10 socket connections
                    // If not connected, return errors immediately rather than waiting for reconnect
                    bufferMaxEntries: 0
                };
    
                //calling
                // mongoose.connect(uri, options, function(error) {
                //     // Check error in initial connection. There is no 2nd param to the callback.
                //   });
    
                //   // Or using promises
                //   mongoose.connect(uri, options).then(
                //     () => { /* ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
                //     err => { /*handle initial connection error */ }
                //   );
    
                this.db = mongoose.connect(uri, options).then(
                    () => {
                        if(that.debug) console.log("Sikeres kapcsolat");
                        deffered.resolve({
                            status:true,
                            msg:"Sikeres kapcsolat!",
                            data:{}
                        });
                    },
                    err => {
                        if(that.debug) console.log("Sikertelen kapcsolat");
                        if(that.debug) console.log(err);
                        deffered.resolve({
                            status:false,
                            msg:"Sikertelen (adatbázis kap.)!",
                            data:{}
                        });
                    }
                );
    
            }else{
            
                if(this.debug) console.log("A kapcsolat letezik");
                deffered.resolve({
                    status:true,
                    msg:"Kapcsolat létezik!",
                    data:{}
                });

            }
            
        } catch (error) {
            
            if(that.debug) console.log(error.message);
            if(that.debug) console.log(error);
            deffered.resolve({
                status:false,
                msg:error.message,
                data:error
            });

        }

        return deffered.promise;
    }

/**
 *
 ---------------------------------------------------------------------------- */
    getView(o_params){
        
        this.settings._action =  o_params.action;
        this.settings._id =  o_params._id;

        switch (action) {
           case 'view':
              response = this.view({'action':'view'});
              break;
           case 'insert':
              response = this.view({'action':'insert'});
              break;
           case 'update':
              response = this.view({'view_mode':'update'});
              break;
           case 'delete':
              response = this.delete();
              break;
           default:
           break;
        }
        return response;
    }
    
/**
 *
 ---------------------------------------------------------------------------- */
    view(o_params){
    }


}

exports.UserManager = UserManager
exports.createUserManager = function (o_userManagerParams) {
  return new UserManager(o_userManagerParams)
}
