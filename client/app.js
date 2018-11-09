'use strict'
/**
 * @description
 * @param 
 * @return 
 * @module
 * @author Nagy Péter
 * @version 1.01.001
 * @license MIT License (c) copyright 2010-2014 original author or authors 
 */


/*HTTP
Methods-----------------------------------------------------------------------
The example above uses the .get method of the $http service.
The .get method is a shortcut method of the $http service. There are several shortcut methods:

.delete()
.get()
.head()
.jsonp()
.patch()
.post()
.put()
Properties---------------------------------------------------------------------
The response from the server is an object with these properties:

.config the object used to generate the request.
.data a string, or an object, carrying the response from the server.
.headers a function to use to get header information.
.status a number defining the HTTP status.
.statusText a string defining the HTTP status.

app.controller('myCtrl', function($scope, $http) {
    $http({
        method : "GET",
        url : "welcome.htm"
    }).then(function mySuccess(response) {
        $scope.myWelcome = response.data;
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
    });
});
-------------------------------------------------------------------------------- */
/**Make a new directive for invidual css
*invoke when head load
*The legal restrict values are:

*E for Element name
*A for Attribute
*C for Class
*M for Comment
*By default the value is EA, meaning that both Element names and attribute names can invoke the direc
*
*/
/**
*https://stackoverflow.com/questions/15193492/how-to-include-view-partial-specific-styling-in-angularjs
*@description SET INVIDUAL CSS
*@param
*@return
*/

var ROSManager = angular.module('ROSManager',['ngRoute','ngCookies']).value('auth',12);

/**
 * @description autentikacios parameterek
 */

 // ROSManager.value('auth',{
//         "cookieKey":"ROSManager",
//         "auth":false,
//         "token":null,
//         "secretKey":null,
//         "user":{
//             "name":""
//             ,"data":{}
//         }
//     }
// );
ROSManager.value('withAuthentication',false);
ROSManager.value('navBarParams',true);
// {
//     "pageName":"ROSManager",
//     "links":"links": [
//         {link:'#/main_page',title:'Home'}
//         ,{link:'#/menu1',title:'Tasks Check'}
//         ,{link:'#/menu2',title:'Server Check'}
//         ,{link:'#/sqliteManager',title:'SQLITE'}
//         ,{link:'#/search',title:'Solr(demo)'}
//     ],
// }
// $scope.page_name = 'ROSManager';
// $scope.menu =  [{link:'#/main_page',title:'Home'}
//               ,{link:'#/menu1',title:'Tasks Check'}
//               ,{link:'#/menu2',title:'Server Check'}
//               ,{link:'#/sqliteManager',title:'SQLITE'}
//               ,{link:'#/search',title:'Solr(demo)'}
//               ];

// $scope.logout = {content:'Logout',link:'#/logout'};
// $scope.user   = {content:'User',link:'#/user'};
// $scope.users  = {content:'Users',link:'#/users'};
// $scope.departments  = {content:'Departments',link:'#/departments'};
// $scope.user_datas = [{name:'',role:''}];


ROSManager.value('auth',{
        "cookieKey":"ROSManager",
        "auth":false,
        "token":null,
        "secretKey":null,
        "user":{
            "name":"guest"
            ,"data":{}
        }
    }
);
// ROSManager.value('timer',[]);
ROSManager.auth = window.auth;
// ROSManager.timer = window.auth;
/**
 * @description directive a css fajlok betoltesehez
 */
ROSManager.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                //akkor amikor masik oldalra lepunk akkor ez lefut 
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }

                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }

                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }

                });
            }
        };
    }
]);

/**
 * @description Navbar kezelese
 */
ROSManager.directive('navBar',['$rootScope','$compile','$cookies','$location','auth','withAuthentication',function($rootScope,$compile,$cookies,$location,auth,withAuthentication){

    return{
        restrict:'A',
        link:function(scope,elem) {
            $rootScope.$on('$routeChangeStart', function (e, next, current) {
                

                //1. ha van auth akkor kell cookinak is lennie
                //2. ha nincs auth lehet cookie illetve nincs az sem 
                //3. ha nincs semmi
                // console.log("Régi oldal:",current);
                // console.log("Új oldal:",next);

                var cookieDataObject = null;
                if (!withAuthentication) {
                    auth = {
                        "cookieKey":"ROSManager",
                        "auth":true,
                        "token":"$2a$08$2ya9tWCFIuuptqItNPbPG.VrEUNhNzBuSQnGIVhTth181ylR4iR8W",
                        "secretKey":null,
                        "user":{"name":"guest","data":{}}
                    };
                    $cookies.putObject(auth.cookieKey, auth,{});
                }else{
                    if (auth.token == "$2a$08$2ya9tWCFIuuptqItNPbPG.VrEUNhNzBuSQnGIVhTth181ylR4iR8W" || auth.token==null) {
                        auth = {
                            "cookieKey":"ROSManager",
                            "auth":false,
                            "token":null,
                            "secretKey":null,
                            "user":{"name":null,"data":null}
                        };
                        $cookies.remove(auth.cookieKey);
                        auth = {
                            "cookieKey":"ROSManager",
                            "auth":false,
                            "token":null,
                            "secretKey":null,
                            "user":{"name":null,"data":null}
                        };
                        window.auth = auth;
                        $location.url('/signin');
                        
                    } else {
                        // null
                    }
                    
                }

                var cookieDataObject = $cookies.getObject(auth.cookieKey);
                
                if (typeof(cookieDataObject)!='undefined') {
                    if (
                        (
                            ((auth.auth && cookieDataObject.auth) && (auth.token && cookieDataObject.token))
                            || (!auth.auth && cookieDataObject.auth)
                        )
                        || withAuthentication
                    ) {
                        if (elem.html().length == 0) {
                            var html = '<div ng-include="\'components/navbar/navbar.html\'"></div>';
                            elem.append($compile(html)(scope));
                        }else{
                            $(elem).empty();
                            var html = '<div ng-include="\'components/navbar/navbar.html\'"></div>';
                            elem.append($compile(html)(scope));
                        }

                    }else{
                        if ($(elem).children().length > 0) $(elem).empty();
                    }

                }else{
                    //Ez nem lehetseges:auth van de cooki nincs akkor az hiba
                    if (auth.auth) {
                        auth.token = null;
                        auth.auth  = false;
                        auth.user.name  = null
                        auth.user.data  = null;    
                        window.auth = auth;
                    }
                    if ($(elem).children().length > 0) $(elem).empty();
                }

            });
        }
    }
}]);

/**
 * @description
 */
ROSManager.directive('navProfile',['$rootScope','$compile','$cookies','$location','auth','withAuthentication',function($rootScope,$compile,$cookies,$location,auth,withAuthentication){

    return{
        restrict:'A',
        link:function(scope,elem) {
            $rootScope.$on('$routeChangeStart', function (e, next, current) {
                if (true && withAuthentication) {
                    if (elem.html().length == 0) {
                        var html = '<div ng-include="\'components/navbar/navprofile.html\'"></div>';
                        elem.append($compile(html)(scope));
                    }else{
                        $(elem).empty();
                        var html = '<div ng-include="\'components/navbar/navprofile.html\'"></div>';
                        elem.append($compile(html)(scope));
                    }
                } else {
                    if ($(elem).children().length > 0) $(elem).empty();
                }
            });
        }
    }
}]);

// ROSManager.directive('repeatDone', function() {
//     return{
//         restrict:'A',
//         link:function(scope,elem,attrs) {
//             if (scope.$last) {
//                 console.log("utolsó",attrs.repeatDone);
//                 scope.$eval(attrs.repeatDone);
//                 // scope.startProcess();
//             }
            
//         }
//     }
    
//     // return function(scope, element, attrs) {
//     // //   element.bind('$destroy', function(event) {
//     //     if (scope.$last) {
//     //         console.log("utolsó",attrs.repeatDone);
//     //     //scope.$eval(attrs.repeatDone);
//     //         scope.startProcess();
//     //     }
//     // //   });
//     // }
//   });

/**
 * @description touch event
 */
ROSManager.directive("ngTouchstart", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                $scope.$apply(method);
            }

        }]
    }
})
.directive("ngTouchmove", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                event.preventDefault();
                $element.bind("touchmove", onTouchMove);
                $element.bind("touchend", onTouchEnd);
            }
            function onTouchMove(event) {
                var method = $element.attr("ng-touchmove");
                $scope.$apply(method);
            }
            function onTouchEnd(event) {
                event.preventDefault();
                $element.unbind("touchmove", onTouchMove);
                $element.unbind("touchend", onTouchEnd);
            }

        }]
    }
})
.directive("ngTouchend", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchend", onTouchEnd);
            function onTouchEnd(event) {
                var method = $element.attr("ng-touchend");
                $scope.$apply(method);
            }

        }]
    }
});

/**
 * Ezzel lehet ng-scope és ng-binding-ot automatikus hoz. kikapcsolni
 */
ROSManager.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

/**
 * @description Set white and blacklist of url
 */
ROSManager.config(function($sceDelegateProvider) {
    //   $sceDelegateProvider.resourceUrlWhitelist([
    //     // Allow same origin resource loads.
    //     'self'
    //     // Allow loading from our assets domain.  Notice the difference between * and **.
    //     //example:'http://srv*.assets.example.com/**'
    //     // ,'http://*/**'
    //     ,'http://127.0.0.1/**'
    //     ,'http://127.0.0.1:80/**'
    //     ,'http://localhost/**'
    //     ,'http://localhost:80/**'
    //     ,'http://192.168.0.16/**'
    //     ,'http://192.168.0.102/**'
    //     ,'http://192.168.1.101/**'
    //   ]);

    // The blacklist overrides the whitelist so the open redirect here is blocked.
    // $sceDelegateProvider.resourceUrlBlacklist([
    //   'http://myapp.example.com/clickThru**'
    // ]);
});

/**
 * @description Inicializalas
 */
ROSManager.info({
    version:'1.0.0',
    author:'Nagy Péter',
    description:'ROSManager application (UI)'
});
//Ha valami masikat szeretnék elérni              
//  ROSManager.constant('constName','value');
/*-----------------------------------------------------------------------------*/

ROSManager.config(function($routeProvider,$locationProvider,$sceDelegateProvider){
    /**
     *set hashPrefix #!?
     *https://stackoverflow.com/questions/41214312/exclamation-mark-after-hash-in-angularjs-app
     *@description set hashPrefix #!? ezzel lehez a hashPrefixet kijavítani
    */

    $locationProvider.hashPrefix('');
    $routeProvider.when("/",{
        "controller":"dashboard"
        ,"templateUrl":"views/dashboard.html"
        ,"css":"./pub/css/dashboard.css"
    })
    .when("/dashboard",{
        "controller":"dashboard"
        ,"templateUrl":"views/dashboard.html"
        ,"css":"./pub/css/dashboard.css"
    })
    .when("/topics",{
        "controller":"topics"
        ,"templateUrl":"views/topics.html"
        ,"css":"./pub/css/topics.css"
    })
    .when("/nodes",{
        "controller":"nodes"
        ,"templateUrl":"views/nodes.html"
        ,"css":"./pub/css/nodes.css"
    })
    .when("/rosbag",{
        "controller":"rosbag"
        ,"templateUrl":"views/rosbag.html"
        ,"css":"./pub/css/rosbag.css"
    })
    .when("/user",{
        "controller":"userController"
        ,"templateUrl":"views/user.html"
        ,"css":""
    })
    .when("/signin",{
        "controller":"singinController"
        ,"templateUrl":"views/signin.html"
        ,"css":"./pub/css/signin.css"
    })
    .when("/settings",{
        "controller":"settings"
        ,"templateUrl":"views/settings.html"
        ,"css":"./pub/css/settings.css"
    })
    .otherwise({
        // redirectTo:'/main_page'
        controller:'dashboard'
        ,templateUrl:'views/dashboard.html'
        ,css:'./pub/css/dashboard.css'
    })
}).run(function($rootScope){
//null
});

