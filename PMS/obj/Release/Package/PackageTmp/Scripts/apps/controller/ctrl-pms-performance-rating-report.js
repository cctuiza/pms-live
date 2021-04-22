app.controller('pms.report.performanceRating', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal','HttpErrorService','GlobalHelper',
                                                function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, HttpErrorService,GlobalHelper) {
                                                    
                                                    var UserID = $AspCookie.get('_214', 'empId');
                                                    $scope.onInit = function () {
                                                        $http.get(coreapi +'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {

                                                            if (!data.hasError) {
                                                                $scope.msgInvalid = false;
                                                                $scope.pafMaster = data.data;
                                                            }
                                                            else {
                                                                $scope.msgInvalid = true;
                                                                $scope.errorMsg = data.errorMessage
                                                            }

                                                        }).error(function (data, status, headers, config) {
                                                            HttpErrorService.getStatus(status, data);
                                                        });
                                                    }

                                                    $scope.onViewPaf = function (p) {
                                                        $scope.panoList = p.pmsPafMaster;
                                                        $rootScope.openModalForm('#modal-panel-paflist');
                                                    }

                                                    $scope.onViewReport = function (p) {

                                                        $state.go('previewPerformanceRating', { 'pano': p });
                                                        $rootScope.closeModalForm();
                                                    }




                                                    $scope.onType = function (p) {

                                                        switch (p) {
                                                            case 1:
                                                                return 'Personal Info';
                                                                break;
                                                            case 2:
                                                                return 'Subordinate Info';
                                                                break;
                                                            case 3:
                                                                return 'User Access';
                                                                break
                                                        }
                                                    }

                                                    $scope.onViewDetails = function (p) {
                                                        if (p.length != 0) {
                                                            return true;
                                                        }
                                                        else {
                                                            return false;
                                                        }
                                                    }
                                                }])

app.controller('pms.report.performanceRating.Preview', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal','GlobalHelper',
                                                         function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal) {
                                                             
                                                             $scope.PANO = $stateParams.pano;


                                                             $scope.onInit = function () {
                                                                 $http.get(coreapi +'pms/rptPerformanceRating/' + $scope.PANO).success(function (data, status, headers, config) {
                                                                     console.log(data);
                                                                     if (!data.hasError) {
                                                                         $scope.msgInvalid = false;
                                                                         $scope.PmsKPIGroup = data.PmsKPIGroup;
                                                                         $scope.EmpDtl = data.employeeDtl;
                                                                     }
                                                                     else {
                                                                         $scope.msgInvalid = true;
                                                                         $scope.errorMsg = data.errorMessage
                                                                     }

                                                                 }).error(function (data, status, headers, config) {
                                                                     HttpErrorService.getStatus(status, data);
                                                                 });
                                                             }

                                                             $scope.onSummaryView = function (p) {
                                                                 $http.get(coreapi +'pms/getSubKpiDtl/' + p).success(function (data, status, headers, config) {
                                                                     console.log(data);
                                                                     if (!data.hasError) {
                                                                         $scope.msgInvalid = false;
                                                                         $scope.SubkpiDtl = data;

                                                                         //Open modal view
                                                                         $rootScope.openModalForm('#modal-panel-subkpidetails');
                                                                     }
                                                                     else {
                                                                         $scope.msgInvalid = true;
                                                                         $scope.errorMsg = data.errorMessage;
                                                                     }

                                                                 });
                                                             }

                                                             $scope.onValidateResult = function (p) {
                                                                 if (p == null) {
                                                                     return 0;
                                                                 }
                                                                 else {
                                                                     return p;
                                                                 }
                                                             }

                                                             $scope.onValidateActualValue = function (p) {
                                                                 if (p == null) {
                                                                     return 'No-Data';
                                                                 }
                                                                 else {
                                                                     return p;
                                                                 }
                                                             }

                                                             /*
                                                             p1-Hit percentage
                                                             p2-Actual percentage
                                                             */
                                                             $scope.onValidateActualResult = function (p1, p2) {
                                                                 if (p1 > p2) {
                                                                     return 0;
                                                                 } else if (p1 >= p2) {
                                                                     return 1;
                                                                 } else if (p1 < p2) {
                                                                     return 1
                                                                 }
                                                             }



                                                         }]);
