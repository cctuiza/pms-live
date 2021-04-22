app.controller('pms.report.monthly.progrissive.report', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal', 'filterFilter','HttpErrorService','GlobalHelper',
                                                        function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, filterFilter, HttpErrorService,GlobalHelper) {
                                                            
                                                            $("#toTopHover").trigger("click");
                                                            var UserID = $AspCookie.get('_214', 'empId');
                                                          
                                                     
                                                            var d = new Date();
                                                            var iyr = d.getFullYear();
                                                            var mfrm;
                                                            var mto;
                                                            var pano;
                                                            var yr;

                                                            $scope.iyr = [];
                                                            $scope.filter = {};
                                                            $scope.reportData = {};
                                                            $scope.reportView = {};
                                                            $scope.newMonthOption = [];

                                                            $scope.month = new Array();
                                                            $scope.month[0] = "January";
                                                            $scope.month[1] = "February";
                                                            $scope.month[2] = "March";
                                                            $scope.month[3] = "April";
                                                            $scope.month[4] = "May";
                                                            $scope.month[5] = "June";
                                                            $scope.month[6] = "July";
                                                            $scope.month[7] = "August";
                                                            $scope.month[8] = "September";
                                                            $scope.month[9] = "October";
                                                            $scope.month[10] = "November";
                                                            $scope.month[11] = "December";


                                                            for (var i = 2015; i <= iyr; i++) {
                                                                $scope.iyr.push(i);
                                                            }

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
                                                                // $scope.panoList = p.pmsPafMaster;
                                                                var pafOpen = filterFilter(p.pmsPafMaster, { Status: 'O' })[0];
                                                                var mfrm = $filter('date')(pafOpen.COVERED_FROM, 'M');
                                                                var mto = $filter('date')(pafOpen.COVERED_TO, 'M');
                                                                $state.go('monthlyProgressiveREport', { 'pano': pafOpen.hashcode, 'mfrm': mfrm, 'mto': mto });

                                                               // $rootScope.openModalForm('#modal-panel-paflist');

                                                            }

                                                            $scope.onViewReport = function (p) {

                                                                $state.go('monthlyProgressiveREport', { 'pano': p });

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

                                                            $scope.onCallFilterModal = function () {
                                                                for (var i = mfrm - 1; i <= mto - 1; i++) {
                                                                    $scope.newMonthOption.push($scope.month[i]);
                                                                }
                                                               
                                                                $rootScope.openModalForm('#modal-report-prompt');
                                                            }

                                                            $scope.onPreviewFilter = function () {
                                                                mfrm = $scope.filter.monthfrom;
                                                                mto = $scope.filter.monthto;
                                                                pano = $scope.PANO = $stateParams.pano;
                                                                yr = $scope.filter.yr;


                                                                //var monthfrom;
                                                                //var monthto;
                                                                //var sYr;

                                                                for (var i = 0; i <= $scope.month.length - 1; i++) {
                                                                    if ($scope.month[i] == $scope.filter.monthfrom) {
                                                                        mfrm = i + 1;
                                                                        break;
                                                                    }
                                                                }

                                                                for (var i = 0; i <= $scope.month.length - 1; i++) {
                                                                    if ($scope.month[i] == $scope.filter.monthto) {
                                                                        mto = i + 1;
                                                                        break;
                                                                    }
                                                                }

                                                                $scope.strMonthFrom = $scope.month[mfrm - 1];
                                                                $scope.strMonthTo = $scope.month[mto - 1];
                                                                $scope.filter.yr = yr;
                                                                //get api value
                                                                $http.get(coreapi +'pms/progressive-report/?pafhascode=' + $scope.PANO + '&yr=' + yr + '&monthfrom=' + mfrm + '&monthto=' + mto).success(function (response, status, headers, config) {

                                                                    if (!response.hasError) {
                                                                        $scope.reportData = response.data;
                                                                        //viewReport(response.data.body);
                                                                        $rootScope.closeModalForm();
                                                                        $scope.onshow = true;
                                                                    }
                                                                    else {
                                                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                                                    }

                                                                }).error(function (data, status, headers, config) {
                                                                    HttpErrorService.getStatus(status, data);
                                                                });
                                                            }

                                                            $scope.onPreview = function () {
                                                                 mfrm = $scope.PANO = $stateParams.mfrm;
                                                                 mto = $scope.PANO = $stateParams.mto;
                                                                 pano = $scope.PANO = $stateParams.pano;
                                                                 yr = d.getFullYear();

                                                              
                                                                $scope.strMonthFrom = $scope.month[mfrm - 1];
                                                                $scope.strMonthTo = $scope.month[mto - 1];
                                                                $scope.filter.yr = yr;
                                                                //get api value
                                                                $http.get(coreapi +'pms/progressive-report/?pafhascode=' + $scope.PANO + '&yr=' + yr + '&monthfrom=' + mfrm + '&monthto=' + mto).success(function (response, status, headers, config) {

                                                                    if (!response.hasError) {
                                                                        $scope.reportData = response.data;
                                                                        //viewReport(response.data.body);
                                                                        $rootScope.closeModalForm();
                                                                        $scope.onshow = true;
                                                                    }
                                                                    else {
                                                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                                                    }

                                                                }).error(function (data, status, headers, config) {
                                                                    HttpErrorService.getStatus(status, data);
                                                                });
                                                            }

                                                           
                                                            //sum subkpi rating
                                                            $scope.sumRating = function (p) {
                                                            
                                                                
                                                                var iresult = 0;
                                                                iresult= filterFilter(p, { hitMissIndicator: 1 }).length;
                                                              
                                                                return iresult;
                                                            }

                                                            /*subKPIAverage
                                                            p1=rating
                                                            p2=indicator
                                                            p3=compute type
                                                            */
                                                            $scope.sumKPIAverage = function (p1, p2,p3,p4) {
                                                                var iresult = 0;
                                                                var totalcount = filterFilter(p1).length;
                                                                var runningActual = 0;
                                                                var totalTarget = 0;
                                                                if (p2 == 'Positive') {
                                                                    if (p3 == 1) {
                                                                        // Type 1 (Average of Event Total Value/Total Event Target Value) * 100% = Indicator Rating
                                                                        var data = p1;
                                                                        for (var i = 0; i <= data.length - 1; i++) {
                                                                            runningActual += data[i].actualRating;
                                                                            
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
                                                                            runningActual += data[i].actualRating;
                                                                        }

                                                                        iresult = runningActual / totalcount;
                                                                    } else if (p3 == 3) {
                                                                        //Type 3 (Total Hit/Total No. of Event) * 100% = Rating
                                                                        var sumhit = filterFilter(p1, { hitMissIndicator: 1 }).length;

                                                                        iresult = (sumhit / totalcount) * 100
                                                                    }
                                                                   
                                                                    
                                                                } else {
                                                                    //compute negative
                                                                    if (p3 == 1) {
                                                                        // Type 1 (Average of Event Total Value/Total Event Target Value) * 100% = Indicator Rating
                                                                        var data = p1;
                                                                        for (var i = 0; i <= data.length - 1; i++) {
                                                                            runningActual += data[i].actualRating;
                                                                           
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
                                                                            runningActual += data[i].actualRating;
                                                                        }

                                                                        iresult = parseFloat(runningActual) / parseFloat(totalcount);
                                                                    } else if (p3 == 3) {
                                                                        //Type 3 (Total Hit/Total No. of Event) * 100% = Rating
                                                                        var sumhit = filterFilter(p1, { hitMissIndicator: 1 }).length;

                                                                        iresult = (sumhit / totalcount) * 100
                                                                    }

                                                                }
                                                                
                                                                return iresult;
                                                            }

                                                


                                                        }]);