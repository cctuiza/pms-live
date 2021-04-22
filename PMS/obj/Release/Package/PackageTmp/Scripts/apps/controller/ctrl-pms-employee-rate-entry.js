app.controller('pms.rate.entry', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter','Notification','HttpErrorService',
                                    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, Notification, HttpErrorService) {
                                        $("#toTopHover").trigger("click");
                                        var userFullname = $AspCookie.get('_214', 'fullname');
                                        $scope.host = window.location.host;
                                        $scope.userid = $AspCookie.get('_214', 'empId');
                                        $scope.params = {};
                                        $scope.self = {};
                                        $scope.isChanges = false;
                                        $scope.hashcode = $stateParams.id;
                                 

                                        $scope.onInit = function () {
                                            $scope.onGetPanoDetails($scope.hashcode);
                                        }
                                   
                                        //get latest pano code
                                        $scope.onGetPanoDetails = function (p) {
                                            var spinner = new Spinner(opts).spin(spinnerTarget);
                                            $http.get(coreapi + 'pms/get-sub-kpi-rating/?hashcode=' + p + '&userid=' + $scope.userid).success(function (data, status, headers, config) {
                                                spinner.stop();
                                                if (!data.hasError) {
                                                    $scope.kraData = '';
                                                    $scope.self.pafId = data.data.pafId;
                                                    $scope.isbehavioralrate = data.data.isbehavioralrate;
                                                    $scope.onGetRateEntry($scope.self.pafId, $scope.userid);//execute get rate entry
                                                    $scope.DesAckBtn = data.showDisAck;
                                                    $scope.AckBtn = data.showAck;
                                                    $scope.AckPostBtn = data.showAckPost;
                                                    $scope.employeeDtl = data.data;
                                                    $scope.employeeName = data.employeeDtl.employeename2;
                                                } else {
                                                    $scope.kraData = '';
                                                    $scope.DesAckBtn = false;
                                                    $scope.AckBtn = false;
                                                    $scope.AckPostBtn = false;
                                                    console.log('error:onGetPanoDetails \n' + data.errorMessage);
                                                }
                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                                spinner.stop();
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
                                        $scope.onGetAverage = function (p1,p2,p3,p4) {
                                          //  return (filterFilter(p1, { rate_result: '1' }).length / p1.length) * 100;
                                            var iresult = 0;
                                            var totalcount = filterFilter(p1).length;
                                            var runningActual = 0;
                                            var totalTarget = 0;
                                            if (p2 == 'P') {
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

                                        //set rate entry result
                                        $scope.onSetEntryResult = function (p, target, HitMisInd, paramSubkpicode) {
                                           
                                            var actualrate = p.actualrate;
                                            var eventcode = p.eventcode;
                                            var remarks = p.remarks;
                                            var isChanged = p.isChanged;

                                            if (actualrate === '' || actualrate == null) {
                                            //    $scope.onAutoSaveRate(paramSubkpicode, eventcode, -100, -100, remarks); //execute auto save rate to server
                                                p.rate_result = '';
                                                setChange(paramSubkpicode, eventcode, actualrate, remarks, isChanged,target);
                                                checkChanges();
                                                return;
                                            }

                                            if (HitMisInd == "NEGATIVE") {
                                                if (actualrate > target) {
                                                 //   $scope.onAutoSaveRate(paramSubkpicode, eventcode, actualrate, 0, remarks); //execute auto save rate to server
                                                    p.rate_result = '0';

                                                }
                                                else {
                                                //    $scope.onAutoSaveRate(paramSubkpicode, eventcode, actualrate, 1, remarks); //execute auto save rate to server      
                                                    p.rate_result = '1';
                                                }
                                            }
                                            else {
                                                if (actualrate < target) {
                                                   // $scope.onAutoSaveRate(paramSubkpicode, eventcode, actualrate, 0, remarks); //execute auto save rate to server
                                                    p.rate_result = '0';
                                                }
                                                else {
                                                 //   $scope.onAutoSaveRate(paramSubkpicode, eventcode, actualrate, 1, remarks);//execute auto save rate to server
                                                    p.rate_result = '1';
                                                }
                                            }

                                            // $scope.isChanges = filterCompareJson($scope.kraData, $scope.tempData);

                                            setChange(paramSubkpicode, eventcode, actualrate, remarks, isChanged,target);
                                            checkChanges();
                                        };

                                        //post rate value to server
                                        $scope.onAutoSaveRate = function (paramsubkpi, paramEventcode, paramRate, paramResult, remarks) {

                                            $scope.params = {
                                                'subkpi': paramsubkpi,
                                                'eventcode': paramEventcode,
                                                'rate': paramRate,
                                                'hitmisres': paramResult,
                                                'userid': $scope.userid,
                                                'empid': $scope.self.empId,
                                                'remarks': remarks,
                                                'pafId':$scope.self.pafId
                                            };

                                            $http.post(coreapi +'pms/post-auto-save-rate/', $scope.params).success(function (data, status, headers, config) {
                                                if (!data.hasError) {
                                                    $scope.DesAckBtn = data.showDisAck;
                                                    $scope.AckBtn = data.showAck;
                                                    $scope.AckPostBtn = data.showAckPost;
                                                } else {
                                                    console.log('Error:' + data.errorMessage);
                                                }
                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                               
                                            });
                                        };


                                        /*
                                        @p1 =pano code
                                        @p2 =user id
                                        @return= list of rate entry
                                        */
                                        $scope.onGetRateEntry = function (p1, p2) {
                                            var param = p1 + ',' + p2;

                                            $http.get(coreapi + 'pms/get-rate-entry/?p=' + param).success(function (data, status, headers, config) {
                                                $scope.kraData = data;//set actual obj
                                                $scope.tempData = angular.copy(data);// set temp obj
                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                            });
                                        };

                             
                                    

                                        $scope.onUpdateBehaviorLog = function (p1, p2) {
                                          
                                           
                                        }

                                        $scope.onSaveChanges = function () {
                                            $http.post(coreapi + 'pms/postRecoredRating/', $scope.kraData).success(function (response, status, headers, config) {
                                                $scope.isChanges = false;
                                                setChangeToFalse();
                                               Notification.success('Record Save Complete.');
                                            }).error(function (data, status, headers, config) {
                                                console.log('Error: ' + JSON.stringify(data, null, 2));
                                            });
                                        }

                                        $scope.onSaveBehaviorLog = function (p1, p2) {

                                            $scope.param = {
                                                "created_by": userFullname,
                                                "kpiId": p1,
                                                "details": p2,
                                                "behaviorId":0
                                            };


                                            $http.post(coreapi + 'pms/postbehavioralLog/', $scope.param).success(function (response, status, headers, config) {
                                              
                                                var kpilist = filterFilter($scope.kraData, { kra_name: 'BEHAVIORAL INDICATORS' })[0].kpi_list;
                                                var behaviorKpi = filterFilter(kpilist, { KPI_MASTER_ID: p1 })[0].behaviorlog.push({
                                                    "behaviorId": response.behaviorId,
                                                    "kpiId": p1,
                                                    "details": p2,
                                                    "created_by": userFullname,
                                                    "iflag": 0,
                                                    "isChanged": true
                                                });
                                                Notification.success('Record Save Complete.');
                                            }).error(function (data, status, headers, config) {
                                                console.log('Error: ' + JSON.stringify(data, null, 2));
                                            });


              
                                        }

                                        $scope.onDeleteLog = function (p) {
                                           

                                            $http.delete(coreapi + 'pms/deletebehavioralLog/?behaviorId='+ p.behaviorId).success(function (response, status, headers, config) {

                                                p.iflag = 1; p.isChanged = true;
                                                //checkChanges();
                                                Notification.success('Delete log Complete.');
                                            }).error(function (data, status, headers, config) {
                                                console.log('Error: ' + JSON.stringify(data, null, 2));
                                            });

                                        }

                                        $scope.onSaveUpdateLog = function (p) {
                                            $scope.param = {
                                                "created_by": userFullname,
                                                "kpiId": p.kpiId,
                                                "details": p.details,
                                                "behaviorId": p.behaviorId
                                            };


                                            $http.post(coreapi + 'pms/postbehavioralLog/', $scope.param).success(function (response, status, headers, config) {
                                                p.isEdit = false;
                                                Notification.success('Update Complete.');
                                            }).error(function (data, status, headers, config) {
                                                console.log('Error: ' + JSON.stringify(data, null, 2));
                                            });
                                        }

                                        $scope.onUpdateBehavioralLog = function (p1,p2) {
                                            var behavioralKpi = filterFilter($scope.tempData, { kra_code: "BEHAVIORAL" });
                                            var behavioralLog = filterFilter(behavioralKpi[0].kpi_list, { KPI_MASTER_ID: p1 })[0];

                                            var behavioralLogItem = filterFilter(behavioralLog.behaviorlog, { behaviorId: p2.behaviorId })[0];
                                            
                                            if (behavioralLogItem.details != p2.details) {
                                                p2.isChanged = true;
                                            } else {
                                                p2.isChanged = false;
                                            }

                                            checkChanges();

                                        }


                                        //Acknowledge Rate Entry
                                        $scope.onAcknowledge = function () {
                                            var spinner = new Spinner(opts).spin(spinnerTarget);
                                            var params = $scope.self.pafId+ ',' + $scope.userid + ',' + $scope.host;
                                            $http.get(coreapi +'pms/AcknowledgeKPI/?p=' + params).success(function (data, status, headers, config) {
                                                spinner.stop();
                                                if (!data.hasError) {

                                                    $scope.DesAckBtn = data.showDisAck;
                                                    $scope.AckBtn = data.showAck;
                                                    $scope.AckPostBtn = data.showAckPost;
                                                    $scope.onGetRateEntry($scope.self.pafId, $scope.userid);//execute get rate entry

                                                } else {

                                                    console.log('error:onGetPanoDetails \n' + data.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                                spinner.stop();
                                            });
                                        };

                                        $scope.onAcknowledgeAndPost = function () {
                                            var spinner = new Spinner(opts).spin(spinnerTarget);
                                            var params = $scope.self.pafId+ ',' + $scope.userid + ',' + $scope.host;
                                            $http.get(coreapi +'pms/AcknowledgeKPIAndPost/?p=' + params).success(function (data, status, headers, config) {
                                                spinner.stop();
                                                if (!data.hasError) {

                                                    $scope.DesAckBtn = data.showDisAck;
                                                    $scope.AckBtn = data.showAck;
                                                    $scope.AckPostBtn = data.showAckPost;
                                                    $scope.onGetRateEntry($scope.self.pafId, $scope.userid);//execute get rate entry

                                                } else {

                                                    console.log('error:onGetPanoDetails \n' + data.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);;
                                                spinner.stop();
                                            });
                                        };

                                        $scope.onDisAcknowledge = function () {
                                            var spinner = new Spinner(opts).spin(spinnerTarget);

                                            var params = $scope.self.pafId+ ',' + $scope.userid;
                                            $http.get(coreapi +'pms/post-disacknowledge/?p=' + params).success(function (data, status, headers, config) {
                                                spinner.stop();
                                                if (!data.hasError) {

                                                    $scope.DesAckBtn = data.showDisAck;
                                                    AckPostBtn = data.showAck;
                                                    $scope.AckPostBtn = data.showAckPost;
                                                    $scope.onGetRateEntry($scope.self.pafId, $scope.userid);//execute get rate entry
                                                   
                                                } else {
                                                    console.log('error:onGetPanoDetails \n' + data.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                HttpErrorService.getStatus(status, data);
                                                spinner.stop();
                                            });
                                        };

                                        function getBehavioralList(id) {
                                            $http.get(coreapi +'pms/getBehavioralList/' + id).success(function (response, status, headers, config) {

                                                if (!response.hasError) {
                                                    var kpilist = filterFilter($scope.kraData, { kra_name: 'BEHAVIORAL INDICATORS' })[0].kpi_list;
                                                    filterFilter(kpilist, { KPI_MASTER_ID: id })[0].behaviorlog = response.data;
                                                    $scope.newDetails = '';
                                                } else {
                                                    console.log('error:onGetPanoDetails \n' + response.errorMessage);
                                                }

                                            }).error(function (data, status, headers, config) {
                                                console.log('error:onGetPanoDetails');
                                                spinner.stop();
                                            });
                                        }

                                        //check the rate value in temp obj
                                        //p1=subkpi,p2=eventcode,p3=rating,p4=remarks,p5=isChanged,p6=actualtarget
                                        function setChange(p1, p2,p3,p4,p5,p6) {
                                            var rateEntry = {};
                                            var masterEntry = [];
                                            var kraId;
                                            var ischange=false;

                                            for (var i = 0; i <= $scope.tempData.length - 1; i++) {

                                                kraId = i;

                                                masterEntry = filterFilter($scope.tempData[i].masterEntry, { subkpi: p1 })[0];
                                                if (masterEntry != undefined) {
                                                    rateEntry = filterFilter(masterEntry.RateEntry, { eventcode: p2 })[0];
                                                    if (rateEntry.actualrate != p3 || convertNulltoEmpty(rateEntry.remarks) != convertNulltoEmpty(p4) || rateEntry.actialtarget != p6) {
                                                        ischange = true;
                                                    }
                                                    break;
                                                }
                                          
                                            }
                                            
                                            //set isChange value
                                            filterFilter(filterFilter($scope.kraData[kraId].masterEntry, { subkpi: p1 })[0].RateEntry, { eventcode: p2 })[0].isChanged = ischange;

                                        }

                                        function checkChanges() {
                                            var irateEntry = 0, ibehaveLog = 0;
                                            var masterEntry = [];
                                            var kraId;

                                            //check all kra rating
                                            for (var i = 0; i <= $scope.kraData.length - 1; i++) {

                                                kraId = i;
                                                for (var ii = 0; ii <= $scope.kraData[i].masterEntry.length - 1; ii++) {
                                                   // var test=$scope.kraData[i].masterEntry[ii];
                                                  //  for(var iii=0; iii<=$scope.kraData[i].masterEntry[ii])
                                                     irateEntry += filterFilter($scope.kraData[i].masterEntry[ii].RateEntry, { isChanged: true }).length;

                                                }
                                            }


                                            //check behavioral log
                                            var behavioralLog = filterFilter($scope.kraData, { kra_code: "BEHAVIORAL" });
                                            for (var i = 0; i <= behavioralLog[0].kpi_list.length - 1; i++) {
                                                ibehaveLog += filterFilter(behavioralLog[0].kpi_list[i].behaviorlog, { isChanged: true }).length;
                                            }



                                            if (irateEntry > 0 || ibehaveLog > 0) {
                                                $scope.isChanges = true;
                                            } else {
                                                $scope.isChanges = false;
                                            }
                                        }


                                        function setChangeToFalse() {
                                            var irateEntry = 0;
                                            var masterEntry = [];
                                            var kraId;

                                            for (var i = 0; i <= $scope.kraData.length - 1; i++) {

                                                kraId = i;
                                                for (var ii = 0; ii <= $scope.kraData[i].masterEntry.length - 1; ii++) {
                                                    // var test=$scope.kraData[i].masterEntry[ii];
                                                    //  for(var iii=0; iii<=$scope.kraData[i].masterEntry[ii])
                                                    //irateEntry += filterFilter($scope.kraData[i].masterEntry[ii].RateEntry, { isChanged: true }).length;
                                                    for (var iii = 0; iii <= $scope.kraData[i].masterEntry[ii].RateEntry.length - 1; iii++) {
                                                        $scope.kraData[i].masterEntry[ii].RateEntry[iii].isChanged = false;
                                                    }
                                                }
                                            }

                                            
                                            $scope.tempData = angular.copy($scope.kraData);// renew set temp obj
                                        }


                                    }]);