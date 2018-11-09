
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
    ,file:"authentication.log"
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
 * A authentikacioert felelos modul
 * felhasznalo m. modul
 * - AD es DB authentikaciot valosit meg
 * - valamint a felhasznalok jogosultsagat lehet modositani
 **/
class UserManager{

/**
 * Authentication modul konstruktora
 *
 ---------------------------------------------------------------------------- */
    constructor(o_userManagerParams){

        try {

            //ezzel atmenetileg ki lehet kapcsolni a CA
            // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

            this.settings = Object.assign({
                //AD param
                adParams:{ url: 'ldap://dc.domain.com',
                    baseDN: 'dc=domain,dc=com',
                    username: 'username@domain.com',
                    password: 'password',
                    rejectUnauthorized:false,
                },

                //DB param
                dbParams:{
                    uriParams:{
                    protocol: 'mongodb',
                    host:"127.0.0.1",
                    port:"27017",
                    db:"rosManager",
                    userName: "",
                    password: ""
                },
               },

                //user param for auth.
                userParams:{
                    userName:'',
                    password:''
                }
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
            this.debug = true;

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
     *userManager 
     *
     ---------------------------------------------------------------------------- */

    //#region User manager (select,insert,update,delete)
    userRegistration(o_userRegistrationParams){

        var userRegistrationParams = Object.assign({},o_userRegistrationParams);
        var deffered = this.q.defer();
        var that = this;

        this.setDb().then(function(response){
            try {
                if (that.mongoose.connection.readyState==1||that.mongoose.connection.readyState==2) {
                    if (userRegistrationParams.email &&
                        userRegistrationParams.username &&
                        userRegistrationParams.password ) {

                        //#region Example
                        // var schema = new mongoose.Schema({ name: 'string', size: 'string' });
                        // var Tank = mongoose.model('Tank', schema);

                        // var small = new Tank({ size: 'small' });
                        // small.save(function (err) {
                        // if (err) return handleError(err);
                        // // saved!
                        // })

                        // // or

                        // Tank.create({ size: 'small' }, function (err, small) {
                        // if (err) return handleError(err);
                        // // saved!
                        // })
                        //#endregion

                        var hashedPassword = that.bcrypt.hashSync(userRegistrationParams.password, 10);
                        
                        var userData = {
                            email: userRegistrationParams.email,
                            username: userRegistrationParams.username,
                            password: hashedPassword
                        };

                        that.User.create(userData,
                            function (error, user) {
                                if (error) {
                                    // if (error) throw err;
                                    deffered.resolve({status:false,data:{auth:false,token:null},msg:" [x] Hiba a felhasználó regisztrálása során : \r\n "+error.message});
                                } else {

                                    //itt adok vissza erteket a cuccnak
                                    // create a token
                                    if(that.debug) console.log("UserId: ",user._id);
                                    var token = jwt.sign({ id: user._id }, that.config.secretKey, {
                                        expiresIn: 86400 // expires in 24 hours
                                    });
                                    deffered.resolve({status:true,data:{auth:true,token:token},msg:" [x]  A felhasználó regisztrációja sikeresen megtortént!"});

                                }
                            }
                        );

                    }else{

                        var error = new Error(" [x] Hiba nincs paraméter!");
                        if(that.debug) console.log( error.message );
                        deffered.resolve({status:false,data:error,msg:error.message});
                        
                    }
                }else{

                    var error = new Error(" [x] Nincs adatbázis kapcsolat: \r\n"+response.msg);
                    if(that.debug) console.log(error.message);
                    deffered.resolve({status:false,data:error,msg: error.message});

                }

            } catch (error) {
                if(that.debug) console.log(error);
                deffered.resolve({status:false,data:error,msg:" [x] Hiba: \r\n" + error.message});
            }
        },function(error){
            if(that.debug) console.log(" [x] Hiba a kapcsolódás során: \r\n" + error.message);
            deffered.resolve({status:false,data:error,msg:"[x] Hiba a kapcsolódás során: \r\n" + error.message});
        });

        return deffered.promise;
    }

    deleteUser(o_params){
        try {
            var _id = o_params._id;
            var deffered = this.q.defer();
            var that = this;

            var query = this.User.remove({_id:_id});
            query.exec(function(err,users){
                if (err){
                    deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó törlése során " + err});
                }else{
                    deffered.resolve({status:true,data:{},msg:" [x] A felhasználó törlése sikeres volt! " });
                }
            });
            
        } catch (error) {
            deffered.resolve({status:false,data:{},msg:error,});
        }
        return deffered.promise;
    }

    updateUser(o_params){

        try {
            var _id  = o_params._id;
            var set = o_params.data;
            var deffered = this.q.defer();

            if(typeof(set.password)!="undefined"){
                set.password  = this.bcrypt.hashSync( set.password, 10);
            }
            var query = this.User.find({_id:_id}).update(set);
            query.exec(function(err,users){
                if (err){
                    deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak módosítása során xx " + err});
                }else{
                    deffered.resolve({status:true,data:{},msg:" [x] A felhasználó adatainak módosítása sikeresen megtörtént! " });
                }
            });
            
        } catch (error) {
            deffered.resolve({status:false,data:{},msg:error.message});
        }
        return deffered.promise;

    }


    insertUser(o_params){
        
        try {
            var _id  = o_params._id;
            var data = o_params.data;
            var deffered = this.q.defer();
            var that = this;
            var query = this.User.create(data,function (error, user) {
                    if (error) {
                        deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó rögzítése során: "+error });
                    } else {
                        deffered.resolve({status:true,data:{},msg:" [x] A felhasználó rögzítése sikeresen megtörtént! " });
                    }
                }
            );

        } catch (error) {
            deffered.resolve({status:false,data:{},msg:error.message});
        }
        return deffered.promise;
    }


    getUsersFromDB(o_params){

        var getUserParams = Object.assign({ 
            token:""
            ,email:""
            ,name:""
            ,_id:""
        },o_params);
        var deffered = this.q.defer();
        var that = this;
        var userId = null;
        var users  = null;

        try {
            this.setDb().then(function(response){
                    
                var query = that.User.find({})
                .select({
                    "_id":1
                    ,"username":1
                    ,"displayName":1
                    ,"department":1
                    ,"email":1
                    ,"modDate":1
                    ,"modUser":1
                    ,"updated":1
                });
                // [{"name":"_id","attr":[{"alias":false}]}
                // ,{"name":"contact","attr":[{"alias":false}]}
                // ,{"name":"displayName","attr":[{"alias":false}]}
                // ,{"name":"token","attr":[{"alias":false}]}
                // ,{"name":"department","attr":[{"alias":false}]}
                // ,{"name":"modUser","attr":[{"alias":false}]}
                // ,{"name":"email","attr":[{"alias":false}]}
                // ,{"name":"username","attr":[{"alias":false}]}
                // ,{"name":"password","attr":[{"alias":false}]}
                // ,{"name":"access","attr":[{"alias":false}]}
                // ,{"name":"update","attr":[{"alias":false}]}
                // ,{"name":"modDate","attr":[{"alias":false}]}
                // ,{"name":"__v","attr":[{"alias":false}]}
                query.exec(function(err,users){
                    if (err){
                        deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során " + err});
                    }else{

                        console.log(users);
                        deffered.resolve({status:true,data:users,msg:" [x] A felhasználók lekérdezése sikeresen megtörtént " });
                    }
                });
            },function(error){
                deffered.resolve({status:false,data:{},msg:"",});
            });

        } catch (error) {
            deffered.resolve({status:false,data:{},msg:error.message});
        }
       
        return deffered.promise;
        
    }

    getUserFromDB(o_params){
                
        var userParams = Object.assign({ 
            token:""
            ,email:""
            ,name:""
            ,_id:""
        },o_params);

        var deffered = this.q.defer();
        var that = this;
        var userId = null;
        var users  = null;
        try {
            this.setDb().then(function(response){
                
                jwt.verify(userParams.token, config.secretKey, function(err, decoded) {
                    if (err){
                        deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során " + err});
                    }else{
                        that.User.find({},function(err,users){
                            console.log(users);
                        });

                        userId = ((userParams._id!="")? userParams._id:decoded.id);
                        var query =  User.findOne({ _id:userId });
                            
                            query.exec(function (err, user) {
                            if (err){
                                deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során " + err});
                            } else{
                                if (!user){
                                    deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során (nincs ilyen felhasználó)" + err});
                                }else{
                                    deffered.resolve({status:true,data:user,msg:"Sikeres"});
                                }
                            }
                        });
                    }
                });
                
            },function(error){
                deffered.resolve({status:false,data:{},msg:"",});
            });

        } catch (error) {
            deffered.resolve({status:false,data:{},msg:error.message});
        }
        
        return deffered.promise;
        
    }

    getView(o_params){
        
        try {

            var deffered = this.q.defer();

            var content = "";
            var userData = {
                _id:""
                ,username:""
                ,displayName:""
                ,department:""
                ,email:""
                ,modDate:""
                ,modUser:""
                ,updated:""
                ,password:""
                ,description:""
            };

            var params = Object.assign({ 
                token:""
                ,email:""
                ,name:""
                ,_id:""
                ,action:""
            },o_params);
            

            //be kell a osztaly karbantartot is huzni
            if (params.action != 'insert') {
                this.getUserFromDB(params).then(function(response){
                    //a hiddenData kell a query-hez
                    if (response.status) {
                        userData =  {
                            _id:response.data._id
                            ,username:response.data.username
                            ,displayName:response.data.displayName
                            ,department:response.data.department
                            ,email:response.data.email
                            ,modDate:response.data.modDate
                            ,modUser:response.data.modUser
                            ,updated:response.data.updated
                            ,password:response.data.password
                            ,description:response.data.description
                        };
                        content +=
                        '<div id="viewContener">'+
                            '<form id="viewForm">'+
                                '<fieldset id="userBaseData">'+
                                    '<legend>Felhasználói alap adatok</legend>'+
                                    '<div><span class=v_label>Azonosító:</span><span><input type="text" id="_id" class="v_input"  disabled="disabled" placeholder="Azonosító" value="'+userData._id+'"/></span></div>'+
                                    '<div><span class="v_label">Felhasználónév:</span><span><input type="text" id="username" class="v_input" placeholder="Felhasználó" value="'+userData.username+'"data-mandantory="true" data-mandantoryErrorText="felhasználónév" /></span></div>'+
                                    '<div><span class="v_label">Teljesnév:</span><span><input type="text" id="displayName" class="v_input" placeholder="Teljesnév" value="'+userData.displayName+'" data-mandantory="true" data-mandantoryErrorText="teljesnév" /></span></div>  '+
                                    '<!-- <div><span class="v_label">Osztály:</span><span>'+
                                    '<select id="department">'+
                                        '<option data-id="0" >B-12</option>'+
                                        '<option data-id="1" >B-13</option>'+
                                    '</select></span>'+
                                    '</div> -->'+
                                    '<div><span class="v_label">Email:</span><span><input type="email" id="email"  placeholder="Email" value="'+userData.email+'" data-mandantory="true" data-mandantoryErrorText="email" /></span></div>'+
                                '</fieldset>'+

                                '<fieldset id="userBaseMData">'+
                                    '<legend>Módosító adatai</legend>'+
                                    '<div><span class="v_label">Modosítás dátuma:</span><span><input type="text" id="modDate" class="v_input"  disabled="disabled" placeholder="" value="'+userData.modDate+'"/></span></div>'+
                                    '<div><span class="v_label">Módosító:</span><span><input type="text" id="modUser" class="v_input" disabled="disabled" placeholder="" value="'+userData.modUser+'"/></span></div>'+
                                    '<div><span class="v_label">Feltöltve:</span><span><input type="text" id="updated" class="v_input" disabled="disabled" placeholder="" value="'+userData.updated+'"/></span></div>'+
                                '</fieldset>'+

                                '<fieldset id="userPassword">'+
                                    '<!-- <legend class="color_red"><span class="toggle_down">Jelszó</span></legend> -->'+
                                    '<legend><span>Jelszó</span></legend>'+
                                    '<div><span class="v_label">Jelszó:</span><span><input type="password" id="password" class="v_input" placeholder="Jelszó" value=""  data-mandantory="true" data-mandantoryErrorText="jelszó"  disabled="disabled"/></span></div>'+
                                    '<div><span class="v_label">Jelszó (conf):</span><span><input type="password" id="passwordConfirm" class="v_input" placeholder="Jelszó" value="" data-mandantory="true" data-mandantoryErrorText="jelszó con." disabled="disabled"/></span></div>'+
                                    '<br/><div><span><input type="button" id="modifyPassword" class="btn btn-primary"  value="Módosít" /><input type="button" id="cancelPassword" class="btn btn-primary hide"  value="Mégse" /></span></div>'+
                                '</fieldset>'+
                                
                                '<fieldset id="userOther">'+
                                    '<legend><span>Egyéb</span></legend>'+
                                    '<!-- <legend class="color_red"><span class="toggle_down">Egyéb</span></legend> -->'+
                                    '<div><span class="v_label">Megjegyzés:</span><textarea  id="description" rows="5" cols="100">'+userData.description+'</textarea></div>'+
                                '</fieldset>'+

                                '<div id="hiddenData" >'+
                                    '<input type="hidden" id="_id" value="'+userData._id+'"/>'+
                                    '<input type="hidden" id="passwordChanged" value="false" />'+
                                    '<input type="hidden" id="modUser" value="'+userData.modUser+'" />'+
                                '</div>'+
                            '</form>'+
                        '</div>';
                        deffered.resolve({status:true,data:{html:content},msg:"View"});
                    }else{
                        deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során (pl.nincs ilyen felhasználó)" + err});
                    }
    
                },function(error){
                    console.log(error);
                });
    
            }else{
                content +=
                '<div id="viewContener">'+
                    '<form id="viewForm">'+
                        '<fieldset id="userBaseData">'+
                            '<legend>Felhasználói alap adatok</legend>'+
                            '<div><span class=v_label>Azonosító:</span><span><input type="text" id="_id" class="v_input"  disabled="disabled" placeholder="Azonosító" value="'+userData._id+'"/></span></div>'+
                            '<div><span class="v_label">Felhasználónév:</span><span><input type="text" id="username" class="v_input" placeholder="Felhasználó" value="'+userData.username+'"data-mandantory="true" data-mandantoryErrorText="felhasználónév" /></span></div>'+
                            '<div><span class="v_label">Teljesnév:</span><span><input type="text" id="displayName" class="v_input" placeholder="Teljesnév" value="'+userData.displayName+'" data-mandantory="true" data-mandantoryErrorText="teljesnév" /></span></div>  '+
                            '<!-- <div><span class="v_label">Osztály:</span><span>'+
                            '<select id="department">'+
                                '<option data-id="0" >B-12</option>'+
                                '<option data-id="1" >B-13</option>'+
                            '</select></span>'+
                            '</div> -->'+
                            '<div><span class="v_label">Email:</span><span><input type="email" id="email"  placeholder="Email" value="'+userData.email+'" data-mandantory="true" data-mandantoryErrorText="email" /></span></div>'+
                        '</fieldset>'+

                        '<fieldset id="userBaseMData">'+
                            '<legend>Módosító adatai</legend>'+
                            '<div><span class="v_label">Modosítás dátuma:</span><span><input type="text" id="modDate" class="v_input"  disabled="disabled" placeholder="" value="'+userData.modDate+'"/></span></div>'+
                            '<div><span class="v_label">Módosító:</span><span><input type="text" id="modUser" class="v_input" disabled="disabled" placeholder="" value="'+userData.modUser+'"/></span></div>'+
                            '<div><span class="v_label">Feltöltve:</span><span><input type="text" id="updated" class="v_input" disabled="disabled" placeholder="" value="'+userData.updated+'"/></span></div>'+
                        '</fieldset>'+

                        '<fieldset id="userPassword">'+
                            '<!-- <legend class="color_red"><span class="toggle_down">Jelszó</span></legend> -->'+
                            '<legend><span>Jelszó</span></legend>'+
                            '<div><span class="v_label">Jelszó:</span><span><input type="password" id="password" class="v_input" placeholder="Jelszó" value="'+userData.password+'" data-mandantory="true" data-mandantoryErrorText="jaszó" /></span></div>'+
                            '<div><span class="v_label">Jelszó (conf):</span><span><input type="password" id="passwordConfirm" class="v_input" placeholder="Jelszó" value="'+userData.password+'" data-mandantory="true" data-mandantoryErrorText="jelszó con."/></span></div>'+
                        '</fieldset>'+
                        
                        '<fieldset id="userOther">'+
                            '<legend><span>Egyéb</span></legend>'+
                            '<!-- <legend class="color_red"><span class="toggle_down">Egyéb</span></legend> -->'+
                            '<div><span class="v_label">Megjegyzés:</span><textarea  id="description" rows="5" cols="100">'+userData.description+'</textarea></div>'+
                        '</fieldset>'+

                        '<div id="hiddenData" >'+
                            '<input type="hidden" id="_id" value="'+userData._id+'" />'+
                            '<input type="hidden" id="passwordChanged" value="true" />'+
                            '<input type="hidden" id="modUser" value="" />'+
                        '</div>'+
                    '</form>'+
                '</div>';

                deffered.resolve({status:true,data:{html:content},msg:"View"});    
            }

            

        } catch (error) {
            deffered.resolve({status:false,data:{},msg:" [x] Hiba felhasználó adatainak lekérése során (pl.nincs ilyen felhasználó)" + error});
        }

        return deffered.promise;
    }

    //#endregion



    //#region  Authentication
    /**
     *Itt ellen hogy van e token( sesion cookie )
    * -    ha van akkor a tartalmat vissza dekodolom es authentikalom a usert
    * -    mind AD-ban es mind MongoDB-ben
    ---------------------------------------------------------------------------- */
    loginCheck(o_loginChekcParams){
        var loginChekcParams = Object.assign({
            callbackUrls:{
            logged:'/home',
                notLogged:'/signin'
            }
        },o_loginChekcParams);

        // ki kellene olvasni a cookit vagyi be kel a rosManagerbe raknom
        //itt ellen hogy be van e  jelentkezve vagyis a cookit itt ellen örzöm le
    }


    /**
     * Autentikalom a usert (AD es DB-ben)
     ---------------------------------------------------------------------------- */
    login(o_loginParams){
        var loginParams = Object.assign(
            {
                password:"",
                username:"", 
                token:""
            },
            o_loginParams
        );

        var deffered = this.q.defer();

        /*
        this.loginAD(o_loginParams).then(
            function(response){

                if (response.status) {
                    deffered.resolve({status:true,data:response.data,msg:response.msg});    
                }else{
                    deffered.resolve({status:false,data:response.data,msg:response.msg});
                }

            },function(error){
                deffered.resolve({status:false,data:response.data,msg:error});
            }
        );
        */

        this.loginDB(o_loginParams).then(
            function(response){

                if (response.status) {
                    deffered.resolve({status:true,data:response.data,msg:response.msg});    
                }else{
                    deffered.resolve({status:false,data:response.data,msg:response.msg});
                }
                
            },function(error){
                deffered.resolve({status:false,data:response.data,msg:error});
            }
        );
        
        
      return  deffered.promise;
    }

    /**
     * Autentikalom a usert (AD)
     ---------------------------------------------------------------------------- */
    loginAD(o_loginParams){
        try {
        // url: dcname (domain.com)
        // baseDN: dc=domain,dc=com
        // username: user
        // password: password


        var loginParams = Object.assign({
            password:"",
            userName:"", 
            token:""
        },o_loginParams);

        this.setParams({  
            //AD param
            adParams:{ 
                url: 'ldaps://machinename.domain.com',
                baseDN: 'dc=domain,dc=com',
                username: 'username@domain.com',
                password: 'password',
                //ez nem biztonsagos kell a CA majd
                tlsOptions: { rejectUnauthorized:false }
            }
        });

        this.ad = new ActiveDirectory(this.settings.adParams);

        var that = this;
        var deffered = this.q.defer();
        var query = 'cn=PCNAME';
        // var query = 'cn=*user*';
        var opts = {
            // includeMembership : [ 'group', 'user' ], // Optionally can use 'all'
            includeDeleted : false
        };
            
        var that = this;
        var deffered = this.q.defer();

        this.ad.find(query, function(err, results) {
            if ((err) || (! results)) {
                deffered.resolve({status:false,data:{},msg:"[x] Hiba a felhasználó beléptetésénél (pl:adatbázis)!"});
            }else{
                deffered.resolve({status:true,data:results,msg:"[x] Sikeres"+results});
            }

            //   console.log('Groups');
            //   $.each(results.groups, function(group) {
            //     console.log('  ' + group.cn);
            //   });
                
            //   console.log('Users');
            //   $.each(results.users, function(user) {
            //     console.log('  ' + user.cn);
            //   });
                
            //   console.log('Other');
            //   $.each(results.other, function(other) {
            //     console.log('  ' + other.cn);
            //   });
        });

        // if(this.debug) console.log("A lekerdezes paraméterei:","\r\n",this.settings.adParams);
        //  this.ad = new ActiveDirectory(this.settings.adParams);
        //  //a user-t igy kel megadni
        //  var username = 'username@domain.com';
        // //ha hibás a jelszó akkor nem engedi be illetve errort dob
        //  var password ='password' ;

        // this.ad.authenticate(username, password, function(err, auth) {

        //   if (err) {
        //     if(that.debug) console.log('ERROR: '+JSON.stringify(err));
        //     return;
        //   }

        //   if (auth) {
        //     if(that.debug) console.log('Authenticated!');
        //   }
        //   else {
        //     if(that.debug) console.log('Authentication failed!');
        //   }
        // });

        } catch (error) {
        if(that.debug) console.log(error);
        deffered.resolve({status:false,data:{auth:false,token:null},msg:" [x] Hiba: \r\n" + error.message});
        }
    
        return deffered.promise;
    }

    /**
     * Autentikalom a usert (DB)
     ---------------------------------------------------------------------------- */
    loginDB(o_loginParams){

        try {

            var loginParams = Object.assign(
                {
                    password:"",
                    username:"", 
                    token:""
                },
                o_loginParams
            );
    
            var that = this;
            var deffered = this.q.defer();
    
            this.setDb().then(
                function(response){

                    if (response.status) {
                        that.User.findOne({ username: loginParams.username }, function (err, user) {
                            
                            if (err){
                                deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:"[x] Hiba a felhasználó beléptetésénél (pl:adatbázis)!"});
                            } else{
                                if (!user){
                                 deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:"[x] Hibás jelszó vagy felhasználónév!"});
                                }else{
                                    var passwordIsValid = that.bcrypt.compareSync(loginParams.password, user.password);
                                    if (!passwordIsValid){
                                        deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:"[x] Hibás jelszó vagy felhasználónév!"});
                                    }else{
                                        var token = jwt.sign({ id: user._id }, that.config.secretKey, {
                                            expiresIn: 86400 // expires in 24 hours
                                        });
                                        deffered.resolve({status:true,data:{auth:true,token:token,user:user},msg:"[x] Sikeres"});
                                    } 
                                }
                            }
                        });
                        
                    }else{
                        deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:response.msg});
                    }
    
                },
                function(error){
                    if(that.debug) console.log(" [x] Hiba a kapcsolódás során: \r\n" + error.message);
                    deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:"[x] Hiba a kapcsolódás során: \r\n" + error.message});
                }
            );
    
            
        } catch (error) {
            if(that.debug) console.log(error);
            deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:" [x] Hiba: \r\n" + error.message});
        }
        return deffered.promise;
    }
        
    /**
     * Itt a kijelentkezes soran  torlom a tokent (session cookit)
     ---------------------------------------------------------------------------- */
    logout(o_logoutParams){
        try {
            var deffered    =   this.q.defer();
            deffered.resolve({status:true,data:{auth:false,token:null,user:null},msg:"[x] Sikeresen kijelentkezett!"});
        } catch (error) {
            deffered.resolve({status:false,data:{auth:false,token:null,user:null},msg:"[x] Sikertelen kijelentkezes!" + error.message});
        }
        return deffered.promise;
    }

    isUserMember(){
    }

    findUser(){
    }

    findGroup(){
    }

    userExists(){
    }

    getUserForGroup(){
    }
    //#endregion
}

exports.UserManager = UserManager
exports.createUserManager = function (o_userManagerParams) {
  return new UserManager(o_userManagerParams)
}
