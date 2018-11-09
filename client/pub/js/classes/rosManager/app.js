"use strict"
const debug = false;
const logParams = {
    "path":__dirname+"/public/files/log/",
    "file":"rosManagerApp.log",
    "fileName":"rosManagerApp",
    "extension":"log||text",
    "fileSize":100000000,
    "currentFile":"",
    //w||a
    // ,writeMod:"a"
    "divide":"*".repeat(80),
    "debug":false
};

const logger  = require("./classes/logger.js").createLogger(logParams);
const q = require("q");
const Bag = require("rosbag");
var $ = require('jquery');


const ROSManager = require("./classes/rosManager.js").createROSManager({});





// starROSbagRecord(path = ".",topics = "test",nodes = "test", all = false){
ROSManager.starROSbagRecord("","/turtle1/cmd_vel","","proba",false).then(function(data){
    if (data.state) {
        console.log("\r\n [x] Sikeresxxxxxxxxxxxxxxxxxxx");
        
        sleep(1000).then(function(){ROSManager.existsNode("/rosManagerBag").then(function(data){
            console.log("\r\n [x] létezik");
            console.log(data);        
//itt fogom a responset vissza küldeni
            process.exit();
            console.log('vége');
        },function(error){
            console.log("\r\n [x] nem létezik");    
        })});


    } else {
        console.log("\r\n [x] Sikertelenxxxxxxxxxxxxxxxxxxxxxxxxxxxx");    
    }

},
function(error){
    
    console.log(error);
});










    function sleep(ms){
        return new Promise(resolve=>setTimeout(resolve,ms));
    }

    // var a = ROSManager.getTopics().then(function(data){
    //     console.log("\r\n [x] Adatok",data);
    // },function(error){
    //     console.log("\r\n [x] Adatok",data);
    // });

    // var b = ROSManager.getNodes().then(function(data){
    //     console.log("\r\n [x] Adatok",data);
    // },function(error){
    //     console.log("\r\n [x] Adatok",data);
    // });

    //REMOTE CORE
    // If TX1 is the master, you should run roscore on it,
    //  and also some nodes that have to run on TX1.
    //   You need to know the IP address of TX1, say 192.168.1.10, and the roscore port number, say 11311.

    // And the other machine, your PC, for example, should also install ROS.
    //  Don't run roscore on your PC, just export ROS_MASTER_URI=http://192.168.1.10:11311. 
    //  and then run the node directly.

    // https://answers.ros.org/question/243905/running-roscore-and-nodes-in-separate-computers/
    // {"host":"np164u3f-virtual-machine","port":40871,10000}
   
   
   
   
   //************************ */
    // var c = ROSManager.checkROSMaster("np164u3f-virtual-machine",11311,10000).then(function(data){
    //     console.log(data);

    // },function(error){
    //     console.log(error);

    //     ROSManager.startROSMaster().then(function(data){
    //         console.log(data);
    //     },function(error){
    //         console.log(error);
    //     });
    //     //ha e hibás akkor már fut vagy is sikeres vol
    //     //vagy lekérema  topicokat és ha null akkor nem fut
        
    //     //1.
    //     // ROSManager.startROSMaster().then(function(data){
    //     //     console.log(data);
    //     // },function(error){
    //     //     console.log(error);
    //     // });
        
    //     //2.
    //     // function sleep(ms){
    //     // return new Promise(resolve=>setTimeout(resolve,ms));
    //     // }

    //     // var checkStart =function(){
    //     //     sleep(3000).then(function(){
    //     //         ROSManager.getTopics().then(function(data){
    //     //             console.log("\r\n [x] Adatok",data);
    //     //             resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //     //         },function(error){
    //     //             console.log("\r\n [x] Adatok",data);
    //     //             resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //     //         })

    //     //       });
    //     // }
    //     // checkStart();
    // })


    // //1.
    // var checkStart =function(){
    //     sleep(1000).then(function(){
    //         ROSManager.getTopics().then(function(data){
    //             console.log("\r\n [x] Adatok",data);
    //             resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         },function(error){
    //             console.log("\r\n [x] Adatok",error);
    //             resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         })

    //         });
    // }



    //******************* */
    //2.
    // var checkStart =function(){
    //     sleep(1000).then(function(){
    //         ROSManager.checkROSMaster("np164u3f-virtual-machine",11311,10000).then(function(data){
    //             console.log("\r\n [x] Adatok",data);
    //             // resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         },function(error){
    //             console.log("\r\n [x] Adatok",error);
    //             // resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         })
    //         });
    // }
    // checkStart();

    // sleep(1000).then(function(){
    // ROSManager.stopROSMaster().then(function(data){
    //     console.log(data);
    // },function(error){
    //     console.log(error);
    // });
    // })
    // var checkStart =function(){
    //     sleep(1000).then(function(){
    //         ROSManager.checkROSMaster("np164u3f-virtual-machine",11311,10000).then(function(data){
    //             console.log("\r\n [x] Adatok",data);
    //             // resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         },function(error){
    //             console.log("\r\n [x] Adatok",error);
    //             // resolve({res:{status:true,msg:'\r\n [x] A feldolgozás megtörtént!'}});
    //         })
    //         });
    // }
    // checkStart();
// console.log("\r\n [x] Result:",b);


// if(debug)
// {
//     console.log("Dirname:",__dirname);
//     console.log("Filename:",__filename);
//     console.log("Enviroment variable:\r\n"+"*".repeat(80),process.env);
//     console.log("Log:",__dirname+"/public/files/log/");
// }

// /**
//  * 
//  */
// function sleep(ms){
//   return new Promise(resolve=>setTimeout(resolve,ms));
// }
// //előb vége vanmielőt loggolna
// // process.exitCode = 1;
// // process.exit();


// /**
//  * 
//  */
// var filename = "tetbag4";

// console.log(`${__dirname}/bag/${filename}.bag`);

//  const start = async function(a, b) {
//     const bag = await Bag.open(`${__dirname}/bag/${filename}.bag`);
//     var messages = [];
//     await bag.readMessages({ topics: ["/turtle1/cmd_vel"] }, (result) => {
//         // topic is the topic the data record was in
//         // in this case it will be either '/foo' or '/bar'
//         // console.log(result.topic);
//         // message is the parsed payload
//         // this payload will likely differ based on the topic
//         messages.push(result);
//         // console.log(result);
//     });
//     messages.forEach(function(element) {
//         console.log(element);
//         console.log(element.data.toString('utf8')); 
//         console.log(element.data.toString('latin1')); 
//         var json = JSON.stringify(element.data);
//         console.log(json);
//         // (b.toString('latin1')) 
//         console.log(element.timestamp);
//         console.log(element.timestamp);
//     });
//     // console.log(messages[1].data.toString('latin1')); 
//     // // (b.toString('latin1')) 
//     // console.log(messages[0].timestamp);
//     // console.log(messages[1].timestamp);
//  }
// start();

// //     const bag = await open(`${__dirname}/bag/${filename}.bag`);
// //     var messages = [];
// //     await bag.readMessages({ topics: ["/turtle1/cmd_vel"] }, (result) => {
// //         // topic is the topic the data record was in
// //         // in this case it will be either '/foo' or '/bar'
// //         // console.log(result.topic);
// //         // message is the parsed payload
// //         // this payload will likely differ based on the topic
// //         messages.push(result);
// //         // console.log(result);
// //     });
// //     // https://github.com/nodejs/node/issues/12908
// // //  var binaryString = "\xff\xfa\xc3\x4e";
// // //  var buffer = new Buffer(binaryString, "binary");
// // //  console.log(buffer);

// // messages.forEach(function(element) {
// //     console.log(element);
// //     console.log(element.data.toString('utf8')); 
// //     console.log(element.data.toString('latin1')); 
// //     var json = JSON.stringify(element.data);
// //     console.log(json);
// //     // (b.toString('latin1')) 
// //     console.log(element.timestamp);
// //     console.log(element.timestamp);
// // });
// // // console.log(messages[1].data.toString('latin1')); 
// // // // (b.toString('latin1')) 
// // // console.log(messages[0].timestamp);
// // // console.log(messages[1].timestamp);

// // }

// // start();

// // // // read all messages from both the '/foo' and '/bar' topics:
