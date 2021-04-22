app.controller('pms.kpi.assignment', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter','filterFilter', '$AspCookie', '$localForage','HttpErrorService','GlobalHelper',
                                     function ($scope, $stateParams, $state, $http, $rootScope, $filter,filterFilter, $AspCookie, $localForage, HttpErrorService,GlobalHelper) {
                                         $("#toTopHover").trigger("click");
                                         var userFullname = $AspCookie.get('_214', 'fullname');
                                         $scope.self = {}
                                         $scope.ikpiadd = false;
                                         $scope.useridcurrentKPICode;
                                         $scope.userid = $AspCookie.get('_214', 'empId');
                                         $scope.tempOccurence = '';
                                         $scope.hashcode = $stateParams.id;


                                         $scope.configView = 1;//1=subkpi list; 2=subkpi setup; 3=sub kpi maintenance
                                         $scope.computeType = [{ 'value': 1, 'display': 'Type 1 : %Rating = (Total of Event Actual Rate/Total of Event Target Rate) x 100%' },
                                         { 'value': 2, 'display': 'Type 2 : %Rating = (Total of Event Actual Rate/Total No. of Event)' },
                                         { 'value': 3, 'display': 'Type 3 : %Rating = (Total Hit/Total No. of Event) x 100%' }];

                                         $scope.onInit = function () {

                                             //get list of autority to rage and stored to local db
                                             $http.get(coreapi +'status/GetStatus/?accessValue=PMSSUBAUTHORITY').success(function (data, status, headers, config) {
                                                 $localForage.setItem('autorityStored', data).then(function (data) {
                                                     $scope.tempautority = data;//set temp variable
                                                 });
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });

                                             //get list of occurange  and stored to local db
                                             $http.get(coreapi +'status/GetStatus/?accessValue=PMSRATEOCCURENCE').success(function (data, status, headers, config) {
                                                 $localForage.setItem('OCCURRENCEStored', data).then(function (data) {
                                                     $scope.occurrence = data;//set temp variable
                                                 });
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });

                                             //get list of indecator and stored to local db
                                             $http.get(coreapi +'status/GetStatus/?accessValue=PMSHITMISSINDICATOR').success(function (data, status, headers, config) {
                                                 $localForage.setItem('indecatorStored', data).then(function (data) {
                                                     $scope.hit_indecator = data;//set temp variable
                                                 });
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });


                                             //get PAF Details
                                             $scope.onGetPanoDetails($scope.hashcode);

                                         };

             

                                         $scope.onGetPanoDetails = function (p) {
                                             $http.get(coreapi +'pms/get-sub-kpi-assignment/?hashcode=' + p ).success(function (data, status, headers, config) {
                                                $scope.kraData = data;//set temp variable
                                                 $scope.self.pano = data.pano;
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         };

                                  

                                         $scope.onShowSubKpiList = function (p) {

                                             $scope.useridcurrentKPICode = p.KPI_MASTER_ID;
                                             $scope.selectedIndicator = p.KEY_INDICATOR;
                                             $scope.posmainkpiId = p.posmainkpiId;
                                             $scope.modalIndicatorTitle = "List of Performance indicator";
                                             $scope.configView = 1;
                                             $http.get(coreapi + '/pms/get-sub-kpi-list/?kpicode=' + p.KPI_MASTER_ID).success(function (data, status, headers, config) {
                                                 if (!data.hasError) {
                                                     $scope.subkpiList = data.data;
                                                 } else {
                                                     console.log('error:onShowSubKpiList \n' + data.errorMessage);
                                                 }

                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         };

                                         $scope.ongetsubKPI = function (p) {
                                             $scope.configView = 3;
                                             $scope.modalIndicatorTitle = "List of indicator";
                                             $http.get(coreapi + '/pms/get-maintenance-subkpi/'+ p).success(function (data, status, headers, config) {
                                                 $scope.subKPIMaintenance = data;

                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         }

                                         $scope.onNewSubKpi = function () {
                                             $scope.configView = 2;
                                             $scope.setup = {};
                                             $scope.tempOccurence = '';
                                             $scope.setup.subkpicode = '[System Generate]';
                                             $scope.occurenceChange = '';
                                             $scope.modalIndicatorTitle = "New Sub KPI";
                                         }

                                         $scope.onBacktoList = function () {
                                             $scope.configView = 1;
                                             $scope.modalIndicatorTitle = 'List of Performance indicator'
                                         }

                                         $scope.onBacktoSetup = function () {
                                             $scope.configView = 2;
                                             $scope.modalIndicatorTitle = 'Sub KPI Setup';
                                         }

                                         $scope.onSelectedSubKPI = function (p) {
                                             $scope.setup = {};
                                             $scope.setup.description = p.subkpidescription;
                                             $scope.setup.possubkpiId = p.possubkpiId;
                                             $scope.setup.target = p.targetvalue;
                                             $scope.setup.istargetlock = p.istargetlock;
                                             $scope.setup.userid = $scope.userid;
                                             $scope.setup.kpicode = $scope.useridcurrentKPICode;
                                             $scope.setup.createdBy = userFullname;
                                             $scope.setup.computetype = p.computetype;
                                             $scope.setup.occurence = p.occurence;
                                             $scope.setup.hitmisind = p.hitmisind;
                                             $scope.setup.authorityCde = p.authoritytorate

                                             $scope.onSaveSubKpi($scope.setup);
                                         }

                                         //get view specific sub kpi details
                                         $scope.onViewSubKpi = function (p) {
                                             $scope.occurenceChange = "";
                                             $scope.isviewchange = false;
                                             $scope.modalIndicatorTitle = 'Indicator Setup';
                                             $http.get(coreapi + 'pms/get-sub-kpi/' + p).success(function (data, status, headers, config) {
                                                 console.log(data);
                                                 if (!data.hasError) {
                                                     $scope.ikpiAdd = true;
                                                     $scope.setup = data.data;
                                                     $scope.tempOccurence = $scope.setup.occurence;
                                                     $scope.configView = 2;
                                                  
                                                 } else {
                                                     console.log('error:onViewSubKpi \n' + data.errorMessage);
                                                 }

                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         };

                                         $scope.onChangeOccurence = function () {
                                             if ($scope.tempOccurence != "") {
                                                 if ($scope.tempOccurence != $scope.setup.occurence) {
                                                     $scope.occurenceChange = "Warning: Changing occurrence will void previous rate entry.";
                                                     $scope.isviewchange = true;
                                                 } else {
                                                     $scope.isviewchange = false;
                                                 }
                                             }
                                         }

                                         $scope.AlreadyExist = function (subPositionCode) {
                                             return filterFilter($scope.subkpiList, { possubkpiId: subPositionCode }).length > 0 ? true : false;
                                         };

                                         /*
                                         @p = $scope.setup {}
                                         save new sub kpi
                                         */
                                         $scope.onSaveSubKpi = function (p) {
                                             p.userid = $scope.userid;
                                             p.kpicode = $scope.useridcurrentKPICode;
                                             p.createdBy = userFullname;
                                             p.hitPercentage = 0;

                                             $http.post(coreapi +'pms/post-new-sub-kpi/', p).success(function (data, status, headers, config) {
                                                 if (!data.hasError) {
                                                     $scope.subkpiList = data.data;

                                                     $scope.setup.subkpicode = '';
                                                     $scope.setup.description = '';
                                                     $scope.setup.target = '';
                                                     $scope.setup.hitPercentage = '';
                                                     $scope.setup.occurence = '';
                                                     $scope.setup.hitmisind = '';
                                                     $scope.setup.authorityCde = '';

                                                     //check if the modal view is not equal to sub kpi list
                                                     if ($scope.configView != 3) {
                                                         $scope.configView = 1;//set the modal to list subkpi
                                                         $scope.modalIndicatorTitle = "List of Performance indicator";
                                                     }

                                                 } else {
                                                     console.log('Error: ' + data.errorMessage);
                                                 }
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                               
                                             });

                                       
                                         };

                                         //onShowDelSubkpi
                                         //p1: subkpi code
                                         //p2: sub kpi description
                                         //p3: list index
                                         $scope.onShowDelSubkpi = function (p1, p2, p3) {
                                             $scope.isDelSubkpi = true;
                                             $scope.subdescription = p2;
                                             $scope.subKpiCode = p1;
                                             $scope.subindex = p3;
                                         };

                                         $scope.onHideDelSubkpi = function () {
                                             $scope.isDelSubkpi = false;
                                         };

                                         //onDeleteSubkpi
                                         $scope.onDeleteSubkpi = function () {
                                             $http.get(coreapi +'pms/delete-sub-kpi/' + $scope.subKpiCode).success(function (data, status, headers, config) {
                                               
                                                 $scope.onHideDelSubkpi();
                                                 $scope.subkpiList.splice($scope.subindex, 1);
                                                    
                                                 
                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         };

                                     }]);