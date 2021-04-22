app.controller('pms.paf.close', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'Notification','HttpErrorService','GlobalHelper',
                                    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, Notification,HttpErrorService,GlobalHelper) {
                                        $("#toTopHover").trigger("click");
                                        var userFullname = $AspCookie.get('_214', 'fullname');
                                        var empId = $stateParams.empId;
                                        var hashcode = $stateParams.hashcode;
                                        
                                        $scope.host = window.location.host;
                                        $scope.userid = $AspCookie.get('_214', 'empId');
                                        $scope.params = {};
                                        $scope.self = {};
                                        $scope.IsClosePAF = false;
                                        $scope.showClosePAFButton = false;
                                        //get latest pano code
                                        $scope.onGetPanoDetails = function () {
                                            GlobalHelper.StartSpin();
                                            $http.get(coreapi + 'pms/get-sub-kpi-rating-setup/?id=' + empId + '&userid=' + $scope.userid + '&hashCode=' + hashcode).success(function (data, status, headers, config) {
                                            
                                                $scope.test = data;
                                                if (!data.hasError) {
                                                    $scope.self.empId = empId;
                                                    $scope.self.empName = data.employeeDtl.employeename2;
                                                    $scope.self.department = data.employeeDtl.departmentname;
                                                    $scope.self.position = data.employeeDtl.positionname;
                                                    $scope.self.isbehavioralrate = data.data.isbehavioralrate;
                                                    $scope.self.pafId = data.data.pafId;
                                                    $scope.onGetRateEntry($scope.self.pafId, $scope.userid);//execute get rate entry
                                                    $scope.IsClosePAF = data.showClosePAF;

                                                    if ($scope.self.empId !== $scope.userid) {
                                                        //this is for subordinate
                                                     
                                                        $scope.btncation = "Close PAF";
                                            
                                                    } else {
                                                        //this if for immediate head
                                                      
                                                        $scope.btncation = "Send request to Close PAF";
                                                    }
                                                    $scope.ongetAppSetting();
                                              
                                                } else {
                                                    console.log('error:onGetPanoDetails \n' + data.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                                GlobalHelper.StopSpin();
                                            });
                                        };

                                        //set kpi result
                                        $scope.onKPIResult = function (p) {
                                            if (p === '1') {
                                                return 'HIT';
                                            } else if (p === '0') {
                                                return 'MISSED';
                                            } else {
                                                return '';
                                            }
                                        };

                                        //count hit value
                                        $scope.onCountHit = function (p) {
                                            return filterFilter(p, { rate_result: '1' }).length;
                                        };

                                        //count missed value
                                        $scope.onCountMissed = function (p) {
                                            return filterFilter(p, { rate_result: '0' }).length;
                                        };

                                        /*compute averate
                                     p1=rate entry
                                     p2=compute type
                                     p3=hit indicator
                                     */
                                        $scope.onGetAverage = function (p1, p2, p3, p4) {
                                            //  return (filterFilter(p1, { rate_result: '1' }).length / p1.length) * 100;
                                            var iresult = 0;
                                            var totalcount = filterFilter(p1).length;
                                            var runningActual = 0;
                                            var totalTarget = 0;
                                            if (p2 === 'P') {
                                                if (p3 === 1) {
                                                    // Type 1 (Average of Event Total Value/Total Event Target Value) * 100% = Indicator Rating
                                                    var data = p1;
                                                    for (var i = 0; i <= data.length - 1; i++) {
                                                        runningActual += data[i].actualrate;

                                                    }
                                                    totalTarget = p4 * totalcount;
                                                    iresult = (runningActual / totalTarget) * 100;

                                                    if (iresult > 100) {
                                                        iresult = 100;
                                                    }
                                                } else if (p3 === 2) {
                                                    //Type 2 Average of Event Total Value = Indicator Rating
                                                    var data = filterFilter(p1);

                                                    for (var i = 0; i <= data.length - 1; i++) {
                                                        runningActual += data[i].actualrate;
                                                    }

                                                    iresult = runningActual / totalcount;
                                                } else if (p3 == 3) {
                                                    //Type 3 (Total Hit/Total No. of Event) * 100% = Rating
                                                    var sumhit = filterFilter(p1, { rate_result: 1 }).length;

                                                    iresult = (sumhit / totalcount) * 100
                                                }


                                            } else {
                                                //compute negative
                                                if (p3 == 1) {
                                                    // Type 1 (Average of Event Total Value/Total Event Target Value) * 100% = Indicator Rating
                                                    var data = p1;
                                                    for (var i = 0; i <= data.length - 1; i++) {
                                                        runningActual += data[i].actualrate;

                                                    }

                                                    totalTarget = p4 * totalcount;
                                                    iresult = (runningActual / totalTarget) * 100;
                                                    if (iresult > 100) {
                                                        iresult = 100;
                                                    }
                                                } else if (p3 == 2) {
                                                    //Type 2 Average of Event Total Value = Indicator Rating
                                                    var data = filterFilter(p1);

                                                    for (var i = 0; i <= data.length - 1; i++) {
                                                        runningActual += data[i].actualrate;
                                                    }

                                                    iresult = parseFloat(runningActual) / parseFloat(totalcount);
                                                } else if (p3 == 3) {
                                                    //Type 3 (Total Hit/Total No. of Event) * 100% = Rating
                                                    var sumhit = filterFilter(p1, { rate_result: 1 }).length;

                                                    iresult = (sumhit / totalcount) * 100
                                                }

                                            }

                                            return iresult;
                                        };

                                        /*
                                        @p1 =pano code
                                        @p2 =user id
                                        @return= list of rate entry
                                        */
                                        $scope.onGetRateEntry = function (p1, p2) {
                                         
                                            var param = p1 + ',' + p2;
                                     
                                            $http.get(coreapi +'pms/get-rate-entry/?p=' + param).success(function (data, status, headers, config) {
                                              
                                           
                                                    $scope.kraData = data;//set temp variable

                                                $scope.showClosePAFButton = true;
                                                GlobalHelper.StopSpin();
                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                            });
                                        };

                                        $scope.onRateBehavioral = function (p) {          
                                            $http.put(coreapi +'pms/set-behaviral-rate/', p).success(function (response, status, headers, config) {
                                                if (!response.hasError) {
                                                    Notification.success('Behavioral update!');
                                                  
                                                } else {
                                                    Notification.error('onRateBehavioral:' + response.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                            });
                                        }

                                        $scope.onClosePAF = function (p) {
                                        
                                            $http.put(coreapi +'pms/request-paf-close/', p).success(function (response, status, headers, config) {
                                           
                                                    if ($scope.self.empId !== $scope.userid) {
                                                        //this is for subordinate
                                                        Notification.success('Performance Appraisal Successfully Close!');

                                                    } else {
                                                        //this if for immediate head
                                                        Notification.success('Requesting for PAF close is already done!');
                                                    }
                                                  
                                                    $state.go('161600000036');

                                       

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                            });
                                        }

                                        $scope.onViewBehavioralLog = function (p) {
                                            $scope.behavioralList = [];
                                            getBehavioralList(p);
                                        };

                                        $scope.ongetAppSetting = function () {
                                            try {
                                                $http.get(coreapi + 'application/get-app-settings/2').success(function (response, status, headers, config) {
                                                    $scope.appSetting = response;
                                                }).error(function (data, status, headers, config) {
                                                    HttpErrorService.getStatus(status, data);
                                                });
                                            } catch (err) {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                            }
                                        };

                                        $scope.onGetSetting = function (settingName) {
                                            return filterFilter($scope.appSetting, { 'SittingName': settingName })[0].SettingValue;
                                        };
               
                                        function getBehavioralList(id) {
                                            $http.get(coreapi +'pms/getBehavioralList/' + id).success(function (response, status, headers, config) {
                                                $scope.behavioralList = response;
                                                $rootScope.openModalForm('#modal-behaviorallog');
                                                
                                                //if (!response.hasError) {
                                                //    var kpilist = filterFilter($scope.kraData, { kra_name: 'BEHAVIORAL INDICATORS' })[0].kpi_list;
                                                //    filterFilter(kpilist, { KPI_MASTER_ID: id })[0].behaviorlog = response.data;
                                                //    $scope.newDetails = '';
                                                //} else {
                                                //    console.log('error:onGetPanoDetails \n' + response.errorMessage);
                                                //}

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                           
                                            });
                                        }

                                    }]);