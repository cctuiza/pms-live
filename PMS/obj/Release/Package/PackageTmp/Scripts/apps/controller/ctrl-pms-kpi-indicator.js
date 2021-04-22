app.controller('pms.indicator', ['$stateParams', '$state', '$http', '$rootScope', '$filter','filterFilter', '$AspCookie','HttpErrorService','GlobalHelper','Notification','$localForage',
                                     function ($stateParams, $state, $http, $rootScope, $filter, filterFilter, $AspCookie, HttpErrorService, GlobalHelper, Notification, $localForage) {
                                         
                                         $("#toTopHover").trigger("click");
                                         var self = this;
                                         var userFullname = $AspCookie.get('_214', 'fullname');
                                         var indicatorId;
                                         var tempPositioncode = '';
                                         self.itemsPerPage = 20;
                                         self.currentPage = 0;
                                         self.total_count;
                                         self.tempdata = [];
                                         self.info = {};
                                       
                                         $rootScope.onInitMenu('150400000015');//init user rights in this page id

                                         self.computeType = [{ 'value': 1, 'display': 'Type 1 : %Rating = (Total of Event Actual Rate/Total of Event Target Rate) x 100%' },
                                        { 'value': 2, 'display': 'Type 2 : %Rating = (Total of Event Actual Rate/Total No. of Event)' },
                                        { 'value': 3, 'display': 'Type 3 : %Rating = (Total Hit/Total No. of Event) x 100%' }];


                                         
                                      

                                         //init function in indicator setup
                                         self.initSetup = function () {
                                             try {

                                                 
                                                 //get position list
                                                 $http.get(coreapi + 'pms/getEmployeePosition').success(function (response, status, headers, config) {
                                                     self.positionList = response;

                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);

                                                 });

                                                 //get pmskra
                                                 $http.get(coreapi +'status/getstatus/').success(function (response, status, headers, config) {
                                                     self.kralist = response;
                                                     self.selectedTabname = 'BUP';
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                                 //get position with kpi
                                                 $http.get(coreapi + 'pms/getPositionWithKPI').success(function (response, status, headers, config) {
                                                     self.positionwithKPIList = response;
                                                     self.selectedPosition = response[0].PositionCode;
                                                     self.currentPosition = response[0].PositionName;
                                                     self.onGetKPIList(self.selectedPosition);
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                                 //get list of autority to rage and stored to local db
                                                 $http.get(coreapi + 'status/GetStatus/?accessValue=PMSSUBAUTHORITY').success(function (data, status, headers, config) {
                                                     $localForage.setItem('autorityStored', data).then(function (data) {
                                                         self.tempautority = data;//set temp variable
                                                     });
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                                 //get list of occurange  and stored to local db
                                                 $http.get(coreapi + 'status/GetStatus/?accessValue=PMSRATEOCCURENCE').success(function (data, status, headers, config) {
                                                     $localForage.setItem('OCCURRENCEStored', data).then(function (data) {
                                                         self.occurrence = data;//set temp variable
                                                     });
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                                 //get list of indecator and stored to local db
                                                 $http.get(coreapi + 'status/GetStatus/?accessValue=PMSHITMISSINDICATOR').success(function (data, status, headers, config) {
                                                     $localForage.setItem('indecatorStored', data).then(function (data) {
                                                         self.hit_indecator = data;//set temp variable
                                                     });
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });


                                             }
                                             catch (err) {
                                                 $rootScope.ShowPrompt('#modal-panel-prompt-error', 'initSetup: ' + err.message);
                                             }

                                         }

                                         self.onGetKPIList = function (p, v) {
                                             tempPositioncode = p;
                                             self.position = v;
                                             $http.get(coreapi + 'pms/get-positionmainkpi?positioncode=' + p).success(function (response, status, headers, config) {

                                                 self.indicatorList = response;
                                                 console.log(self.indicatorList);
                                                 self.selectedTabname = 'BUP';
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });

                                             $rootScope.closeModalForm();
                                         }

                                         self.onSelectedTab = function (p) {
                                             self.selectedTabname = p.status_code;
                                         }

                                         //fill field after select position title
                                         self.onSelectPosition = function (p1, p2) {

                                             self.info.positioncode = p1;
                                             self.info.positionname = p2;

                                         }

                                         //save indicator details
                                         self.onSave = function () {
                                             self.info.createdby = $AspCookie.get('_214', 'fullname');
                                             
                                             try {
                                                 if (indicatorId != '') {
                                                     //edit method
                                                     $http.put(coreapi + 'pms/put-positionmainkpi/', self.info).success(function (data, status, headers, config) {

                                                         Notification.success('Update completed');
                                                         $rootScope.closeModalForm();
                                                       //  $state.go('150400000015');
                                                         indicatorId = '';

                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });
                                                 } else {
                                                     //add method
                                                     $http.post(coreapi + 'pms/post-positionmainkpi/', self.info).success(function (data, status, headers, config) {
                                                         console.log(data);
                                                         Notification.success('Save completed');
                                                         self.indicatorList.push(data);
                                                         $rootScope.closeModalForm();
                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });

                                                 }

                                             }
                                             catch (err) {
                                                 $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Error: ' + err.message);
                                             }
                                         }

                                         //add new indicator
                                         self.onNewMainKPI = function () {
                                             self.info = {};
                                             self.info.positioncode = tempPositioncode;
                                             //self.info.positionname = filterFilter(self.positionList, { 'PositionCode': tempPositioncode })[0].PositionName;
                                             self.info.positionname = self.position
                                             self.transTitle = "Add New Main KPI";
                                             console.log(self.info.positioncode);
                                             console.log(self.info.positionname);
                                           
                                             indicatorId = '';
                                             $rootScope.openModalForm('#modal-panel-mainkpi-setup');
                                         }

                                         self.onChoosePosition = function () {
                                             self.selectedPosition = true;
                                             self.transTitle = "Select Positions";
                                             $rootScope.openModalForm('#modal-panel-position');
                                         }

                                         //edit pano
                                         self.onEdit = function (p) {

                                             //$state.go('indicator-setup', { 'id': p });
                                              indicatorId = p;
                                             //init update mode
                                             if (indicatorId != '') {
                                                 $http.get(coreapi + 'pms/get-positionmainkpi-details/' + indicatorId).success(function (response, status, headers, config) {
                                                     self.info = response;
                                                     self.transTitle = "Update Main KPI";
                                                    
                                                     $rootScope.openModalForm('#modal-panel-mainkpi-setup');
                                                 }).error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });
                                             }

                                         };

                                         self.onNewSubKPI = function (p) {
                                             self.info = {};
                                             self.info.possubkpiId = '';
                                             self.info.posmainkpiId = p;
                                             self.info.iseditdesc = false;
                                             self.info.istargetlock = false;
                                             self.transTitle = "Add New Sub KPI";
                                             $rootScope.openModalForm('#modal-panel-subkpi-setup');
                                         }

                                         self.onEditSubkpi = function (p) {
                                             self.info =angular.copy(p);
                                             self.transTitle = "Edit Sub KPI";
                                             $rootScope.openModalForm('#modal-panel-subkpi-setup');
                                         }

                                         self.onDeletekpi = function (p1, p2,p3) {
                                             if (p2 == 'MainKPI') {
                                                 self.kpigroup = p2;
                                                 self.kpidesc = p1.kpidescription;
                                                 self.kpiId = p1.posmainkpiId;
                                                 self.posmainkpiId = p1.posmainkpiId;
                                                 self.kpiIndex = p3;
                                             } else {
                                                 self.kpigroup = p2;
                                                 self.kpidesc = p1.subkpidescription;
                                                 self.kpiId = p1.possubkpiId;
                                                 self.posmainkpiId = p1.posmainkpiId;
                                                 self.kpiIndex = p3;
                                             }
                                            
                                             $rootScope.openModalForm('#modal-panel-removekpi');
                                         }

                                         self.onDeleteConfirm = function () {
                                             try{
                                                 if (self.kpigroup == 'MainKPI') {
                                                     //delete Main kpi
                                                     $http.delete(coreapi + 'pms/delete-positionmainkpi/' + self.kpiId).success(function (data, status, headers, config) {
                                                         Notification.success('Delete completed');
                                                         self.indicatorList.splice(self.kpiIndex, 1);
                                                         $rootScope.closeModalForm();

                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });
                                                 } else {
                                                     //delete sub kpi
                                                     $http.delete(coreapi + 'pms/delete-positionsubkpi/' + self.kpiId).success(function (data, status, headers, config) {
                                                         Notification.success('Delete completed');
                                                         filterFilter(self.indicatorList, { 'posmainkpiId': self.posmainkpiId })[0].pms_positionsubkpi.splice(self.kpiIndex,1);
                                                         $rootScope.closeModalForm();

                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });
                                                 }
                                             } catch (e) {
                                                 $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Error: ' + e.message);
                                             }
                                         }

                                         self.onSaveSubKPI = function () {
                                             self.info.createdby = $AspCookie.get('_214', 'fullname');
                                             var possubkpiId = self.info.possubkpiId;
                                             try {
                                                 if (possubkpiId != '') {
                                                     //edit method
                                                     $http.put(coreapi + 'pms/put-positionsubkpi/', self.info).success(function (data, status, headers, config) {

                                                         Notification.success('Update completed');
                                              
                                                         var subkpidtl = filterFilter(filterFilter(self.indicatorList, { 'posmainkpiId': data.posmainkpiId })[0].pms_positionsubkpi, { possubkpiId: data.possubkpiId })[0];
                                                         subkpidtl.subkpidescription = data.subkpidescription;
                                                         subkpidtl.targetvalue = data.targetvalue;
                                                         subkpidtl.iseditdesc = data.iseditdesc;
                                                         subkpidtl.istargetlock = data.istargetlock;
                                                         subkpidtl.status = data.status;
                                                         subkpidtl.occurence = data.occurence;
                                                         subkpidtl.hitmisind = data.hitmisind;
                                                         subkpidtl.computetype = data.computetype;
                                                         subkpidtl.authoritytorate = data.authoritytorate;
                                                         $rootScope.closeModalForm();
                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });
                                                 } else {
                                                     //add method
                                                     $http.post(coreapi + 'pms/post-positionsubkpi/', self.info).success(function (data, status, headers, config) {
                                                         console.log(data);
                                                         Notification.success('Save completed');
                                                             filterFilter(self.indicatorList, { 'posmainkpiId': data.posmainkpiId })[0].pms_positionsubkpi.push(data);
                                                             $rootScope.closeModalForm();

                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });

                                                 }

                                             }
                                             catch (err) {
                                                 $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Error: ' + err.message);
                                             }
                                         }

                                         //delet pano
                                         self.onDeletePano = function (p1, p2, p3, p4) {
                                             if (p2 === "C") {
                                                 $scope.stopnote = "Enable to edit this paf is already 'CLOSE'";
                                             } else {
                                                 var r = confirm("Do you want to delete this PAF?");
                                                 if (r == true) {

                                                     var UserID = $AspCookie.get('_214', 'empId');
                                                     $http.get(coreapi +'pms/delete-pano/?p1=' + p1 + '&p2=' + UserID).success(function (data, status, headers, config) {
                                                         if (!data.hasError) {
                                                             $rootScope.onRemoveToList(p3, p4);//remove to list
                                                         }
                                                         else {
                                                             $scope.msgInvalid = true;
                                                             $scope.errorMsg = data.errorMessage
                                                         }
                                                     }).error(function (data, status, headers, config) {
                                                         HttpErrorService.getStatus(status, data);
                                                     });

                                                 }
                                             }
                                         };

                                      

                                         self.cancel = function () {
                                             self.modalInstance.dismiss();
                                         };

                                         self.onType = function (p) {

                                             switch (p) {
                                                 case 1:
                                                     return 'Personal Info';
                                                     break;
                                                 case 2:
                                                     return 'Subordinate Info';
                                                     break
                                             }
                                         };

                                         self.onViewDetails = function (p) {
                                             if (p.length != 0) {
                                                 return true;
                                             }
                                             else {
                                                 return false;
                                             }
                                         };


                                     }]);

