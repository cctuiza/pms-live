app.controller('pms.setup.override', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter','Notification','HttpErrorService','GlobalHelper',
                            function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter,Notification,HttpErrorService,GlobalHelper) {
                                
                                $("#toTopHover").trigger("click");
                              
                                $scope.self = {};
                                $scope.self.pano = $stateParams.pano;
                                $scope.KPIMaintenanceList = [];

                                $scope.isview = true;

                                $scope.dateFormat = 'yyyy/MM/dd';
                                // Disable weekend selection
                                $scope.dateOption = {
                                    showWeeks: false,
                                };

                                //opening date from picker
                                $scope.openDateStart = function ($event, opened) {
                                    $event.preventDefault();
                                    $event.stopPropagation();
                                    $scope[opened] = true;
                                };
                                //on mouse right click event function
                                $scope.onRightClick = function (p1, p2) {
                                    $scope.kraType = p1;//set kra ID
                                    $scope.kraDescription = p2;//kra description
                                }

                                //get view kpi maintenance
                                $scope.onViewKPIMaintenance = function () {
                                    try {
                                        $http.get(coreapi +'pms/get-indicator-by-type/?kraType=' + $scope.kraType + '&empId=' + $scope.self.empId).success(function (response, status, headers, config) {

                                            if (!response.hasError) {

                                                $scope.KPIMaintenanceList = response.data;
                                                $rootScope.openModalForm('#modal-panel-kpiMaintenance');
                                            }
                                            else {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                            }
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                //plot selected main kpi
                                $scope.onSelectMainKPI = function () {
                                    var masterKra = [];

                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { KRA_ID: $scope.kraType })[0].kpi_lst;
                                    for (var i = 0; i <= $scope.KPIMaintenanceList.length - 1; i++) {
                                        if ($scope.KPIMaintenanceList[i].select) {
                                            $scope.onAddKpi(masterKra, $scope.KPIMaintenanceList[i].description, $scope.KPIMaintenanceList[i].targetdef, $scope.KPIMaintenanceList[i].indicatorId);
                                        }
                                    }

                                    $scope.chkBoxKpiAll = false;//select false in select all main kpi
                                    $rootScope.closeModalForm();//close modal after select

                                }

                                $scope.onEditMode = function (p1, p2, p3) {

                                };

                                //check all select value in kpi maintenance
                                $scope.onSelectAll = function () {
                                    for (var i = 0; i <= $scope.KPIMaintenanceList.length - 1; i++) {
                                        $scope.KPIMaintenanceList[i].select = $scope.chkBoxKpiAll;
                                    }
                                }

                                $scope.onCheckAll = function (p1) {
                                    for (var i = 0; i <= p1.length - 1; i++) {
                                        p1[i].selected = true;
                                    }
                                }

                                //copy previous PAF
                                $scope.onCopyPrevious = function () {
                                    try {
                                        $http.get(coreapi +'pms/get-previous-paf/' + $scope.self.empId).success(function (response, status, headers, config) {

                                            if (!response.hasError) {
                                                $scope.self = response.data;
                                                $scope.self.pafId = 0;
                                             //   plotPafRecord(response.data);
                                            }
                                            else {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                            }
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                $scope.onCopyPreviousPeriodPaf = function () {
                                    try {
                                        $http.get(coreapi +'pms/get-previous-period-paf/' + $scope.self.empId).success(function (response, status, headers, config) {

                                            if (!response.hasError) {

                                                $scope.previousPeriodPafList = response.data;
                                                $rootScope.openModalForm('#modal-panel-previous-preriod-paf');
                                            }
                                            else {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                            }
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                $scope.onSelectPreviousPafDtl = function () {
                                    try {
                                        for (var iperiod = 0; iperiod <= $scope.previousPeriodPafList.length - 1; iperiod++) {//loop the paf period
                                            for (var idtl = 0; idtl <= $scope.previousPeriodPafList[iperiod].Dtl.length - 1; idtl++) {//loop the kra details
                                                for (var ikpi = 0; ikpi <= $scope.previousPeriodPafList[iperiod].Dtl[idtl].kpi.length - 1; ikpi++) {//loop the kpi details
                                                    if ($scope.previousPeriodPafList[iperiod].Dtl[idtl].kpi[ikpi].selected) {//if the selected kpi is mark true append this kpi indicator to paf template

                                                        var kra = $scope.previousPeriodPafList[iperiod].Dtl[idtl].kra;
                                                        var description = $scope.previousPeriodPafList[iperiod].Dtl[idtl].kpi[ikpi].kpidescription;
                                                        var weight = $scope.previousPeriodPafList[iperiod].Dtl[idtl].kpi[ikpi].weight;
                                                        var indicatorId = $scope.previousPeriodPafList[iperiod].Dtl[idtl].kpi[ikpi].kpiId;
                                                        plotPafRecord2(kra, description, weight, indicatorId);//append kpi indicators
                                                    }
                                                }
                                            }
                                        }

                                        $rootScope.closeModalForm();
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                //used only in copy previous paf details
                                function plotPafRecord(p) {
                                    try {
                                        var masterKra = [];
                                        for (var ikpi = 0; ikpi <= p.length - 1; ikpi++) {


                                            switch (p[ikpi].KPI) {
                                                case 'BUSINESS PROCESS':
                                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: p[ikpi].KPI })[0].kpi_lst;
                                                    $scope.onAddKpi(masterKra, p[ikpi].DESCRIPTION, p[ikpi].WEIGHT, p[ikpi].indicator);
                                                    break;
                                                case 'CUSTOMER':
                                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: p[ikpi].KPI })[0].kpi_lst;
                                                    $scope.onAddKpi(masterKra, p[ikpi].DESCRIPTION, p[ikpi].WEIGHT, p[ikpi].indicator);
                                                    break;
                                                case 'FINANCIAL':
                                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: p[ikpi].KPI })[0].kpi_lst;
                                                    $scope.onAddKpi(masterKra, p[ikpi].DESCRIPTION, p[ikpi].WEIGHT, p[ikpi].indicator);
                                                    break;
                                                case 'PEOPLE DEVELOPMENT':
                                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: p[ikpi].KPI })[0].kpi_lst;
                                                    $scope.onAddKpi(masterKra, p[ikpi].DESCRIPTION, p[ikpi].WEIGHT, p[ikpi].indicator);
                                                    break;
                                                case 'BEHAVIORAL INDICATORS':
                                                    $scope.onAddKpi($scope.self.behaveKRA.kpi_lst, p[ikpi].DESCRIPTION, p[ikpi].WEIGHT, p[ikpi].indicator);
                                                    break;

                                            }

                                        }
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }

                                }

                                //used only in copy previous period  paf selected details
                                function plotPafRecord2(KRA, DESCRIPTION, WEIGHT, indicatorId) {
                                    try {
                                        var masterKra = [];

                                        switch (KRA) {
                                            case 'BUSINESS PROCESS':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId);
                                                break;
                                            case 'CUSTOMER':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId);
                                                break;
                                            case 'FINANCIAL':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId);
                                                break;
                                            case 'PEOPLE DEVELOPMENT':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId);
                                                break;
                                            case 'BEHAVIORAL INDICATORS':
                                                $scope.onAddKpi($scope.self.behaveKRA.kpi_lst, DESCRIPTION, WEIGHT, indicatorId);
                                                break;
                                        }
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'plotPafRecord2: ' + JSON.stringify(err.message));
                                    }

                                }

                                //run @ first load this function
                                $scope.onInit = function () {
                                 

                                    if ($scope.self.pano != '') {
                                        $scope.fromtitle = "Edit Paf";
                                        $scope.isEdit = true;
                                        $scope.onGetData($scope.self.pano);
                                    } else {
                                        $scope.fromtitle = "New Paf";
                                        $scope.onGetNewDataTemplate();
                                        $scope.isEdit = false;
                                        $scope.self.pano = '[System Generate]';
                                    }
                                };

                                //get pano details if edit mode only
                                $scope.onGetData = function (p) {
                                    $http.get(coreapi +'pms/get-pano-details/' + p).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable
                                            $('#appDate').data().date = $scope.self.appDate;
                                            $('#appNext').data().date = $scope.self.appNext;
                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };

                                //get paf template
                                $scope.onGetNewDataTemplate = function () {
                                    var empid = $AspCookie.get('_214', 'empId');
                                    $http.get(coreapi +'pms/get-paf-new/' + empid).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable

                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };


                                //add main kpi
                                $scope.onAddKpi = function (p1, p2, p3, p4,p5,p6) {
                                    p1.push({
                                        'KEY_INDICATOR': p2,
                                        'KEY_PERCENT': p3,
                                        'delFlag': 0,
                                        'indicatorID': p4,
                                        'KPI_TARGET': p5,
                                        'IsOveride':p6
                                    });

                                };

                                //back to paf list
                                $scope.onBackList = function () {
                                    $state.go('paf-list');
                                };

                                //on search subordinates
                                $scope.onSearchSub = function () {
                                    var empid = $AspCookie.get('_214', 'empId');
                                    $http.get(coreapi +'pms/get-browse-subordinate/' + empid).success(function (data, status, headers, config) {
    $scope.subData = data;//set temp variable
                                        
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });

                                    $rootScope.openModalForm('#modal-panel-subordinates');
                                };

                                //select specific subordinate
                                $scope.onSelectSubordinate = function (p) {
                                    $scope.self.empId = p.empId;
                                    $scope.self.empName = p.empName;

                                };

                                //save PAF details
                                $scope.onSavePaf = function () {

                                    var itotalKPAPercentage = 0;
                                    var itotalKPIPercentage = 0;
                                    var itotalBhavePercentage=0;

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.status = 'O';

                                    //check if the KRA percentage is not equal to 100
                                    if (($scope.self.KRAPercentage + $scope.self.behaveKRA.kra_percent) != 100) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Cannot save PAF. Make sure your Percentage total for KRA and Behavioral section is equal to 100%');
                                        return;
                                    }

                                    //check if the KPI Master  is not equal to 100
                                    for (var ikra = 0; ikra < $scope.self.kpiMasterKraList.length; ikra++) {

                                        //only kra validate in this loop
                                        if ($scope.self.kpiMasterKraList[ikra].KRA_ID != "BEHAVIORAL") {
                                            itotalKPIPercentage = 0;

                                            itotalKPAPercentage = itotalKPAPercentage + $scope.self.kpiMasterKraList[ikra].kra_percent;

                                            for (var ikpi = 0; ikpi < $scope.self.kpiMasterKraList[ikra].kpi_lst.length; ikpi++) {
                                                if ($scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].delFlag != 1) {//sum all percentage delFlag = 0
                                                    itotalKPIPercentage = itotalKPIPercentage + $scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].KEY_PERCENT;
                                                }
                                            }

                                            if (itotalKPIPercentage != 100) {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Cannot save PAF. Make sure your Percentage total for ' + $scope.self.kpiMasterKraList[ikra].kra + ' section is equal to 100%');
                                                return;
                                            }
                                        }
                                    }

                                    if (itotalKPAPercentage != 100) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Cannot save PAF. Make sure your Percentage total for KRA section is equal to 100%');
                                        return;
                                    }

                                    //check total percentage in bahavioral kpi
                                    for (var ibhave = 0; ibhave < $scope.self.behaveKRA.kpi_lst.length; ibhave++) {
                                        if ($scope.self.behaveKRA.kpi_lst[ibhave].delFlag != 1) {
                                            itotalBhavePercentage = itotalBhavePercentage + $scope.self.behaveKRA.kpi_lst[ibhave].KEY_PERCENT;
                                        }
                                    
                                    }

                                    if (itotalBhavePercentage != 100) {

                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Cannot save PAF. Make sure your Percentage total for Behavioral indicators section is equal to 100%');
                                        return;
                                    }

                                    $http.post(coreapi +'pms/post-paf-details/', $scope.self).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.isclose = true;
                                            $scope.successMessage = "Save Complete";
                                            $scope.self = {};
                                            $rootScope.ShowPrompt('#modal-panel-prompt-successful', 'Save Complete');
                                            $("#toTopHover").trigger("click");
                                        } else {

                                            $rootScope.ShowPrompt('#modal-panel-prompt-error', data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                   
                                    });

                                   
                                }


                                $scope.onSaveOveridePaf = function (param) {

                                    $scope.self.isClose = param;//param is equal to paf closing

                                    $http.post(coreapi + 'pms/post-paf-override/', $scope.self).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.isclose = true;
                                            $scope.successMessage = "Successfully Save!";
                                            $scope.self = {};
                                            $rootScope.ShowPrompt('#modal-panel-prompt-successful', 'System Message');
                                            $("#toTopHover").trigger("click");
                                        } else {

                                            $rootScope.ShowPrompt('#modal-panel-prompt-error', data.errorMessage);
                                        }
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });

                                  
                                }

                                $scope.onDelete = function () {
                                  
                                        var r = confirm("Do you want to delete this PAF?");
                                        if (r == true) {

                                            var UserID = $AspCookie.get('_214', 'empId');
                                            $http.get(coreapi +'pms/delete-pano/' + $scope.self.pano).success(function (data, status, headers, config) {
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

                                $scope.testme = function () {
                                    alert('ronel gonzales');

                                }
                                //Close PAF details
                                $scope.onClosePMS = function () {

                                    for (var i = 0; i <= $scope.self.behaveKRA.kpi_lst.length-1; i++) {

                                        if ($scope.self.behaveKRA.kpi_lst[i].kpirating == undefined || $scope.self.behaveKRA.kpi_lst[i].kpirating == "0") {
                                            Notification.error('Enable to close this PAF please rate behavioral indicator!');
                                            return;
                                        }
                                    }

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.appDate = $('#appDate').data().date;
                                    $scope.self.appNext = $('#appNext').data().date;
                                    $scope.self.status = 'C';

                                    $http.post(coreapi +'pms/post-close-paf-details/', $scope.setup).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.isclose = true;
                                            $("#toTopHover").trigger("click");
                                        } else {
                                            Notification.error(data.errorMessage);

                                        }
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });

                                  
                                }

                            }])

app.controller('pms.setup.view', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter','HttpErrorService','GlobalHelper',
                            function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, HttpErrorService, GlobalHelper) {
                                
                                $("#toTopHover").trigger("click");
                                loadPMSPafSetupDate();
                                $scope.self = {};
                                $scope.self.pano = $stateParams.pano;
                                $scope.KPIMaintenanceList = [];

                                $scope.isview = false;

                                //on mouse right click event function
                                $scope.onRightClick = function (p1, p2) {
                                    $scope.kraType = p1;//set kra ID
                                    $scope.kraDescription = p2;//kra description
                                }

                                //get view kpi maintenance
                                $scope.onViewKPIMaintenance = function () {
                                    try {
                                        $http.get(coreapi +'pms/get-indicator-by-type/?kraType=' + $scope.kraType + '&empId=' + $scope.self.empId).success(function (response, status, headers, config) {

                                            if (!response.hasError) {

                                                $scope.KPIMaintenanceList = response.data;
                                                $rootScope.openModalForm('#modal-panel-kpiMaintenance');
                                            }
                                            else {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(response.errorMessage));
                                            }

                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                //plot selected main kpi
                                $scope.onSelectMainKPI = function () {
                                    var masterKra = [];

                                    masterKra = filterFilter($scope.self.kpiMasterKraList, { KRA_ID: $scope.kraType })[0].kpi_lst;
                                    for (var i = 0; i <= $scope.KPIMaintenanceList.length - 1; i++) {
                                        if ($scope.KPIMaintenanceList[i].select) {
                                            $scope.onAddKpi(masterKra, $scope.KPIMaintenanceList[i].description, $scope.KPIMaintenanceList[i].targetdef, $scope.KPIMaintenanceList[i].indicatorId);
                                        }
                                    }

                                    $scope.chkBoxKpiAll = false;//select false in select all main kpi
                                    $rootScope.closeModalForm();//close modal after select

                                }

                                $scope.onEditMode = function (p1, p2, p3) {

                                };

                                //check all select value in kpi maintenance
                                $scope.onSelectAll = function () {
                                    for (var i = 0; i <= $scope.KPIMaintenanceList.length - 1; i++) {
                                        $scope.KPIMaintenanceList[i].select = $scope.chkBoxKpiAll;
                                    }
                                }

                                $scope.onCheckAll = function (p1) {
                                    for (var i = 0; i <= p1.length - 1; i++) {
                                        p1[i].selected = true;
                                    }
                                }

                           
                                //run @ first load this function
                                $scope.onInit = function () {
                                    $scope.date = new Date();
                                    $('#appDate').data().date = $filter('date')($scope.date, "MM/dd/yyyy");
                                    $('#appNext').data().date = $filter('date')($scope.date, "MM/dd/yyyy");

                                    $('#pafPeriodFrm').data().date = $filter('date')($scope.date, "MM/dd/yyyy");
                                    $('#pafPeriodTo').data().date = $filter('date')($scope.date, "MM/dd/yyyy");

                                    if ($scope.self.pano != '') {
                                        $scope.fromtitle = "Edit Paf";
                                        $scope.onGetData($scope.self.pano);
                                    } else {
                                        $scope.fromtitle = "New Paf";
                                        $scope.onGetNewDataTemplate();
                                        $scope.self.pano = '[System Generate]';
                                    }
                                };

                                //get pano details if edit mode only
                                $scope.onGetData = function (p) {
                                    $http.get(coreapi +'pms/get-pano-details/?p=' + p).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable
                                            $('#appDate').data().date = $scope.self.appDate;
                                            $('#appNext').data().date = $scope.self.appNext;
                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };

                                //get paf template
                                $scope.onGetNewDataTemplate = function () {
                                    var empid = $AspCookie.get('_214', 'empId');
                                    $http.get(coreapi +'pms/get-paf-new/' + empid).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable

                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };


                                //add main kpi
                                $scope.onAddKpi = function (p1, p2, p3, p4) {
                                    p1.push({
                                        'KEY_INDICATOR': p2,
                                        'KEY_PERCENT': p3,
                                        'delFlag': 0,
                                        'indicatorID': p4
                                    });

                                };

                                //back to paf list
                                $scope.onBackList = function () {
                                    $state.go('paf-list');
                                };

                                //on search subordinates
                                $scope.onSearchSub = function () {
                                    var empid = $AspCookie.get('_214', 'empId');
                                    $http.get(coreapi +'pms/get-browse-subordinate/' + empid).success(function (data, status, headers, config) {
                                         $scope.subData = data;//set temp variable
                                       
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });

                                    $rootScope.openModalForm('#modal-panel-subordinates');
                                };

                                //select specific subordinate
                                $scope.onSelectSubordinate = function (p) {
                                    $scope.self.empId = p.empId;
                                    $scope.self.empName = p.empName;

                                };

                                //save PAF details
                                $scope.onSavePaf = function () {

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.appDate = $('#appDate').data().date;
                                    $scope.self.appNext = $('#appNext').data().date;

                                    $http.post(coreapi +'pms/post-paf-details/', $scope.self).success(function (data, status, headers, config) {
                                        if (!data.hasError) {

                                            $scope.successMessage = "Save Complete";

                                            $rootScope.ShowPrompt('#modal-panel-prompt-successful', 'Save Complete');

                                        } else {

                                            $rootScope.ShowPrompt('#modal-panel-prompt-error', data.errorMessage);
                                        }
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });

                                };

                            

                            }]);

