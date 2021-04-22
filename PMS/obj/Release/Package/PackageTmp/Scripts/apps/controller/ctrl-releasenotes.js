(function (window, angular, undefined) {
    'use strict';
    var app = angular.module('apps');
app.controller('ctrlReleasenote', ['$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'HttpErrorService',
                             function ($stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, HttpErrorService) {

                                 var self = this;
                                 $("#toTopHover").trigger("click");//scroll to top
                                 self.onInit = function () {
                                     $http.get(coreapi + 'SystemVersion/GetVersionList/?sysId=2').success(function (response, status, headers, config) {
                                        self.releasenote=response;
                                     }).error(function (data, status, headers, config) {
                                         HttpErrorService.getStatus(status, data);
                                     });
                                 }

                             }]);
                             })(window, window.angular);
