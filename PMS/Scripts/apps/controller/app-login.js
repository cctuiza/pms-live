(function (window, angular, undefined) {
    'use strict';
    var app = angular.module("apps", [
        'LocalForageModule',
        'apps.global',
        'rjg.cookie',
        'toastr',
        'ngAnimate']);

    app.config(['$localForageProvider', function ($localForageProvider) {
        $localForageProvider.config({
            name: 'myApp' // name of the database and prefix for your data
        });
    }]);

    app.controller('loginController', ['$scope',
        '$http',
        '$localForage',
        '$AspCookie',
        'toastr',
        function ($scope, $http, $localForage, $AspCookie, toastr) {

            $scope.enum = 1;//1=sign in, 2=forgot password,3=request module
            $scope.hasError = false;
            $scope.emailAlias = "";
            $scope.pass = "";
            $scope.transName = "Sign in";
            //login event
            $scope.onLogin = function () {


                $scope.txtbuttonLogin = "Loading..."
                $scope.hasError = false;
                $scope.param = {
                    loginname: $scope.emailAlias, password: $scope.pass
                };

                if ($scope.param.loginname.length == 0 || $scope.param.password.length == 0) {
                    $scope.txtbuttonLogin = "Sign in";
                    toastr.error("Please enter your username & password!", 'Required');
                    return;
                }

                $http.post(coreapi + 'access/LoginUser/', $scope.param).success(function (response, status, headers, config) {
                    if (response.status === 'FAILURE') {
                        $('#login-prompt').show();
                        $scope.hasError = true;
                        $scope.errorMessage = response.message;
                        $scope.txtbuttonLogin = "Sign in";
                        toastr.error(response.message, 'Error');
                    } else {

                        //set Basic Authorization base in user value
                        $http.defaults.headers.common.Authorization = 'Basic ' + response.stringParam1;

                        //Authenticate Authorization Code
                        $http.get(coreapi + 'Authenticate/start')
                            .success(function (responsedata, status, headers, config) {

                                if (responsedata === 'Authorized') {

                                    $http.get(coredomain + '/account/SetCookie/?userid=' + response.objParam1.userId + '&email=' + response.objParam1.username + '&fullname=' + response.objParam1.firstname + ' ' + response.objParam1.lastname + '&fname=' + response.objParam1.firstname + '&userHascode=' + response.stringParam2 + '&empId=' + response.objParam1.emplId + '&token=' + headers().token).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            window.location.replace(mainUrl + 'index/' + response.stringParam2);//redirect
                                        } else {
                                            $scope.txtbuttonLogin = "Sign in";
                                            console.log('error:UserSetCookie \n' + data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {

                                        $scope.txtbuttonLogin = "Sign in";
                                        console.log('error:UserMenuList');
                                        toastr.error(data, 'Error');
                                    });



                                } else {
                                    //UnAuthorized
                                    $scope.hasError = true;
                                    $scope.errorMessage = responsedata;
                                    $scope.txtbuttonLogin = "Sign in";
                                    toastr.error(data, 'Error');
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.hasError = true;
                                $scope.errorMessage = data;
                                $scope.txtbuttonLogin = "Sign in";
                                toastr.error(data, 'Error');
                            });

                    }
                }).error(function (data, status, headers, config) {
                    $scope.hasError = true;
                    $scope.errorMessage = data;
                    $scope.txtbuttonLogin = "Sign in";
                });
            };


            $scope.onInit = function () {
                var userId = $AspCookie.get('_214', 'empId');
                $scope.txtbuttonLogin = "Sign in";
                if (userId !== '') {

                    window.location.replace('Apps/index/' + $AspCookie.get('_214', 'userHascode'));//redirect
                } else {
                    angular.element('#pcontent').attr("style", "display:table");
                    angular.element('#pload').attr("style", "display:none");
                }
            }

            $scope.onForgotPassword = function () {
                $scope.enum = 2;
                $scope.transName = "Forgot Password";
            }

            $scope.onRequest = function () {
                $scope.enum = 3;
                $scope.transName = "Request Access";
            }

            $scope.onSubmitRequest = function () {
                var baseUrl = "";
                var param = {
                    uemail: $scope.emailAlias,
                    appLink: "http://pms.fastlogistics.com.ph"
                };

                switch ($scope.enum) {
                    case 2:
                        baseUrl = coreapi + 'access/ForgotPass/';
                        break;
                    case 3:
                        baseUrl = coreapi + 'access/';
                        break;
                }

                $http.post(baseUrl, param).success(function (response, status, headers, config) {
                    toastr.success("Forgot password submit.");
                }).error(function (data, status, headers, config) {
                    toastr.error(data);
                });
            }

            // -------------------------------------------------------------------------//
            // Usage for spin.js
            var opts = {
                lines: 11, // The number of lines to draw
                length: 11, // The length of each line
                width: 4, // The line thickness
                radius: 11, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 46, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            };
            var spinnerTarget = document.getElementById('spinnerTarget');

        }]);

})(window, window.angular);