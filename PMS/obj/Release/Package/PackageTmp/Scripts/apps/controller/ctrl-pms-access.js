app.controller("pms.UserAccess", [ '$stateParams', '$state', '$http', '$rootScope', '$sce','Notification','HttpErrorService','GlobalHelper',
                                 function ($stateParams, $state, $http, $rootScope, $sce, Notification, HttpErrorService,GlobalHelper) {
                                     
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
                                         }).error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                         });

                                         GlobalHelper.StopSpin();
                                     };

                                     self.msg = function (title, msg, msgtype) {
                                         var callOutClass = '';
                                         if (msgtype == 1) {
                                             callOutClass = 'bs-callout-success';
                                         } else if (msgtype == 2)
                                         { callOutClass = 'bs-callout-danger'; }

                                         var htmltext = '<div id="callout-dropdown-positioning"  class="bs-callout ' + callOutClass + '">' +
                                     '<h4>' + title + '</h4>' +
                                     '<p>' + msg + '</p>' +
                                     '<input type="hidden" id="hresult" ng-model="resultvalue" value="2" /> </div>'
                                         self.msgResult = $sce.trustAsHtml(htmltext);
                                     };

                                     self.Setup = function (p) {

                                         $state.go('pms-access-setup', { 'userid': p });
                                     }

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

                                     self.updateToOpen = function (p) {
                                         GlobalHelper.StartSpin();
                                         $http.get(coreapi +'pms/put-paf-to-open/' + p).
                                         success(function (response, status, headers, config) {
                                             if (!response.hasError) {
                                                 Notification.success("Re-open PAF ID:"+ p +" Complete");
                                                 $rootScope.closeModalForm();
                                             } else {
                                                 self.msg("Error", response.error_message, 2);
                                             }
                                         }).
                                         error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                         });

                                         GlobalHelper.StopSpin();
                                     };

                                     self.forceClosePAF = function (p) {
                                         GlobalHelper.StartSpin();
                                         $http.get(coreapi + 'pms/force-close-paf/' + p).
                                             success(function (response, status, headers, config) {

                                                 Notification.success("Force Close PAF ID: " + p + " Complete");
                                                 $rootScope.closeModalForm();
                                               
                                             }).
                                             error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });

                                         GlobalHelper.StopSpin();
                                     };

                                     self.onDeletePAF = function (p) {
                                         var r = confirm("Do you want to delete this PAF?");
                                         if (r == true) {

                                             GlobalHelper.StartSpin();
                                             $http.delete(coreapi + 'pms/delete-paf/' + p).
                                                 success(function (response, status, headers, config) {
                                                     Notification.success("Remove Complete!");

                                                     for (var x = 0; x < self.paflist.length; x++) {
                                                         if (self.paflist[x].hashcode == p) {
                                                             self.paflist.splice(x);
                                                         }
                                                     }

                                                 }).
                                                 error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                             GlobalHelper.StopSpin();
                                         }
                                     };

                                 }])


.controller("pms.UserAccess.Setup", ['$stateParams', '$state', '$http', '$rootScope', '$sce','$AspCookie','GlobalHelper',
                                 function ($stateParams, $state, $http, $rootScope, $sce, $AspCookie, GlobalHelper) {
                                     
                                     var username = $AspCookie.get('_214', 'fullname');
                                     var self = this;

                                     self.empId = $stateParams.userid;
                                     self.users = {};
                           
                                     self.getAccessUserList = function () {
                                         GlobalHelper.StartSpin();
                                         $http.get(coreapi +'pms/get-pms-access-user/' + self.empId).
                                         success(function (response, status, headers, config) {
                                             if (!response.hasError) {
                                                 self.PmsUserAccess = response.data;

                                             } else {
                                                 self.msg("Error", response.error_message, 2);
                                             }
                                         }).
                                         error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                         });

                                         GlobalHelper.StopSpin();
                                     };

                                     self.msg = function (title, msg, msgtype) {
                                         var callOutClass = '';
                                         if (msgtype == 1) {
                                             callOutClass = 'bs-callout-success';
                                         } else if (msgtype == 2)
                                         { callOutClass = 'bs-callout-danger'; }

                                         var htmltext = '<div id="callout-dropdown-positioning"  class="bs-callout ' + callOutClass + '">' +
                                     '<h4>' + title + '</h4>' +
                                     '<p>' + msg + '</p>' +
                                     '<input type="hidden" id="hresult" ng-model="resultvalue" value="2" /> </div>'
                                         self.msgResult = $sce.trustAsHtml(htmltext);
                                     };

                                     self.onAddEmployee = function () {
                                         $rootScope.openModalForm('#modal-panel-employeeList');
                                         self.querySearchEmp = [];
                                         self.txtsearch = '';

                                     }

                                     self.searchUser = function () {
                                         try {

                                             $http.get(coreapi +'account/get-search-employee/?page=1&size=30&searchParam=' + self.txtsearch).
                                             success(function (data, status, headers, config) {
                                                 if (!data.hasError) {

                                                     formatSearchData(data.empAccount);
                                                 } else {
                                                     $rootScope.ShowPrompt('#modal-panel-prompt-error', 'searchUser: ' + data.error_message);
                                                 }
                                             }).
                                             error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });

                                         } catch (err) {
                                             $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                         }
                                     };

                                     self.onSelectEmployee = function () {

                                         if (self.PmsUserAccess == null) {
                                             self.PmsUserAccess = [];
                                         }

                                         for (var i = 0; i < self.querySearchEmp.length; i++) {
                                             self.pmsEmpAccessItem = {
                                                 'employeeid': null,
                                                 'SBU': null,
                                                 'employeename': null,
                                                 'Position': null,
                                                 'flag': null,
                                                 'accessId': null,
                                                 'userid': null,
                                                 'createdby': null,
                                                 'canedit': false
                                             }
                                             if (self.querySearchEmp[i].Selected && self.querySearchEmp[i].isShow == 0) {
                                                 self.pmsEmpAccessItem.employeeid = self.querySearchEmp[i].EmpID;
                                                 self.pmsEmpAccessItem.SBU = self.querySearchEmp[i].SBU;
                                                 self.pmsEmpAccessItem.employeename = self.querySearchEmp[i].EmpName;
                                                 self.pmsEmpAccessItem.Position = self.querySearchEmp[i].Position;
                                                 self.pmsEmpAccessItem.flag = 2;//flag 2 = new item
                                                 self.pmsEmpAccessItem.userid = self.empId;
                                                 self.pmsEmpAccessItem.createdby = username;
                                                 self.pmsEmpAccessItem.canedit = false;
                                                 self.PmsUserAccess.push(self.pmsEmpAccessItem);
                                             }

                                         }
                                         //self.querySearchEmp = [];
                                         $rootScope.closeModalForm();

                                     }

                                     self.flatView = function (accessItem) {
                                         return accessItem.flag == 0 || accessItem.flag == 2;
                                     };

                                     self.onCheckAllEmpList = function () {
                                         for (var i = 0; i < self.querySearchEmp.length; i++) {
                                             self.querySearchEmp[i].Selected = true;
                                         }
                                     }

                                     self.onBack = function () {
                                         $state.go('161100000021');
                                     }

                                     self.onSave = function () {
                                         GlobalHelper.StartSpin();
                                        

                                         if (self.PmsUserAccess == null) {
                                             self.PmsUserAccess = [];//set array blank if the pmsUserAccess is null
                                         }

                                         
                                         for(var i=0; i<self.PmsUserAccess.length; i++){
                                             self.PmsUserAccess[i].createdby = username;
                                         }

                                         var jsonParams = { username: username, userPmsAccess: self.PmsUserAccess };

                                         $http.post(coreapi +'pms/post-pms-access-user/', jsonParams).success(function (data, status, headers, config) {
                                             $("#toTopHover").trigger("click");
                                             if (!data.hasError) {
                                                 self.isError = false;
                                                 self.isSuccess = true;
                                                 self.successMessage = "Updating user complate.";

                                             } else {
                                                 self.isError = true;
                                                 self.isSuccess = false;
                                                 self.errorMessage = data.errorMessage;
                                             }

                                         }).error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                           
                                         });

                                         GlobalHelper.StopSpin();
                                     }

                                     function formatSearchData(p) {
                                         try {



                                             self.querySearchEmp = Enumerable.From(p)
                                                                   .Select(function (x) {
                                                                       return {
                                                                           'EmpID': x.EmpID,
                                                                           'SBU': x.SBU,
                                                                           'EmpName': x.EmpName,
                                                                           'Position': x.Position,
                                                                           'Selected': false,
                                                                           'isShow': 0
                                                                       }
                                                                   })
                                                   .Where(function (x) { return x.EmpID != self.empId }).ToArray();


                                             for (var i = 0; i < self.querySearchEmp.length; i++) {
                                                 for (var ii = 0; ii < self.PmsUserAccess.length; ii++) {
                                                     if (self.querySearchEmp[i].EmpID == self.PmsUserAccess[ii].employeeid) {
                                                         self.querySearchEmp[i].isShow = 1;
                                                         break;
                                                     }
                                                 }
                                             }

                                         }
                                         catch (err) {
                                             alert("Error:" + err.message);
                                         }
                                     }

                                 }]);


