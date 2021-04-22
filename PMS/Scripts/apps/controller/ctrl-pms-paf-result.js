app.controller("pms.pafresult", ['$stateParams', '$state', '$http', '$rootScope', '$sce', 'Notification','HttpErrorService','GlobalHelper',
                                 function ($stateParams, $state, $http, $rootScope, $sce, Notification,HttpErrorService,GlobalHelper) {
                              
                                     var self = this;
                                     self.paflist = [];
                                     self.users = {};

                                     self.searchUser = function () {
                                         GlobalHelper.StartSpin();
                                         if (self.txtsearch == "") {
                                             self.getUserList();
                                         } else {
                                             $http.get(coreapi +'account/get-search-employee/?page=1&size=30&searchParam=' + self.txtsearch).
                                             success(function (data, status, headers, config) {
                                                 if (!data.hasError) {
                                                     self.users = data;
                                                 } else {
                                                     self.msg("Error", data.error_message, 2);
                                                 }

                                             }).
                                             error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         }
                                         GlobalHelper.StopSpin();
                                     };

                                     self.getUserList = function () {
                                         GlobalHelper.StartSpin();
                                         $http.get(coreapi +'account/get-all-employee/?page=1&size=30').
                                         success(function (data, status, headers, config) {
                                             if (!data.hasError) {
                                                 self.users = data;
                                             } else {
                                                 self.msg("Error", data.error_message, 2);
                                             }
                                         }).
                                         error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                         });

                                         GlobalHelper.StopSpin();
                                     };

                                     self.OpenPAF = function (p) {
                                         GlobalHelper.StartSpin();
                                         $http.get(coreapi +'pms/get-paf/' + p).
                                         success(function (response, status, headers, config) {
                                             if (!response.hasError) {
                                                 self.paflist = response.data;
                                                 $rootScope.openModalForm('#modal-panel-paflist');

                                             } else {
                                                 self.msg("Error", response.error_message, 2);
                                             }


                                         }).
                                         error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                         });

                                         GlobalHelper.StopSpin();

                                     };
                              
                              }]);