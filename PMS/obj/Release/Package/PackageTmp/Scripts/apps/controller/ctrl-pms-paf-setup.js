app.controller('pms.setup', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'Notification', 'HttpErrorService', 'GlobalHelper',
                            function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, Notification, HttpErrorService, GlobalHelper) {

                                $("#toTopHover").trigger("click");


                                $scope.self = {};
                                $scope.self.pano = $stateParams.pano;
                                $scope.self.empId = $stateParams.em;
                                $scope.self.pafId = $stateParams.pafid;
                                var mode = $stateParams.md;
                                $scope.self.isbehavioralrate = true;
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
                                };


                                //IsBehavioral Always true
                                $scope.ChangeIsBehavioral = function () {
                                    $scope.self.isbehavioralrate = true;
                                }
                                $scope.ongetAppSetting = function () {
                                    $scope.self.isbehavioralrate = true;
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

                                $scope.onChangeCycle = function (val) {
                                    var selectedCyclePeriod = filterFilter($scope.self.lstCycle, { cycleValue: val })[0];
                                    $scope.self.pafPeriodFrm = selectedCyclePeriod.periodFrom;
                                    $scope.self.pafPeriodTo = selectedCyclePeriod.periodTo;
                                };

                                //get view kpi maintenance
                                $scope.onViewKPIMaintenance = function () {
                                    try {
                                        $http.get(coreapi + 'pms/get-indicator-by-type/?kraType=' + $scope.kraType + '&empId=' + $scope.self.empId).success(function (response, status, headers, config) {

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
                                };

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

                                        //$rootScope.openModalForm('#modal-panel-previous-period-paf');
                                      
                                        //    $http.get(coreapi + 'pms/get-previous-period-paf/' + $scope.self.empId).success(function (response, status, headers, config) {

                                        //        if (!response.hasError) {

                                        //            $scope.previousPeriodPafList = response.data;
                                        //            $rootScope.openModalForm('#modal-panel-previous-period-paf');
                                        //        }
                                        //        else {
                                        //            $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onCopyPreviousPeriodPaf: ' + JSON.stringify(response.errorMessage));
                                        //        }
                                        //    }).error(function (data, status, headers, config) {
                                        //        HttpErrorService.getStatus(status, data);
                                        //    });
                                      




                                        var tempData = angular.copy($scope.self);
                                       
                                        $http.get(coreapi + 'pms/get-previous-paf/?employeeId=' +  $scope.self.empId).success(function (response, status, headers, config) {

                                            delete response.pafId;
                                            delete response.selectYr;
                                            delete response.selectCycle;
                                            delete response.pafPeriodFrm;
                                            delete response.pafPeriodTo;
                                            delete response.appDate;
                                            delete response.appNext;
                                       

                                                $scope.self = response;

                                                $scope.self.pafId = tempData.pafId;
                                                $scope.self.selectCycle = tempData.selectCycle;
                                                $scope.self.selectYr = tempData.selectYr;
                                                $scope.self.status = tempData.status;
                                                $scope.self.isbehavioralrate = tempData.isbehavioralrate;
                                                $scope.self.appDate = tempData.appDate;
                                                $scope.self.appNext = tempData.appNext;
                                                $scope.self.pafPeriodFrm = tempData.pafPeriodFrm;
                                                $scope.self.pafPeriodTo = tempData.pafPeriodTo;

                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onCopyPrevious: ' + JSON.stringify(err.message));
                                    }
                                }



                                //Select Previous PAF 
                                $scope.previousPaf = function (selectedpafId) {
                                    $scope.selectedpafId = selectedpafId;
                                }

                                //Select Detail From Previous Selected PAF 
                                $scope.onSelectPreviousPafDetail = function () {
                                    var tempData = angular.copy($scope.self);

                                    $http.get(coreapi + 'pms/get-previous-paf/?employeeId=' + $scope.self.empId +  '&pafId=' + parseInt($scope.selectedpafId)).success(function (response, status, headers, config) {

                                        delete response.pafId;
                                        delete response.selectYr;
                                        delete response.selectCycle;
                                        delete response.pafPeriodFrm;
                                        delete response.pafPeriodTo;
                                        delete response.appDate;
                                        delete response.appNext;


                                        $scope.self = response;

                                        $scope.self.pafId = tempData.pafId;
                                        $scope.self.selectCycle = tempData.selectCycle;
                                        $scope.self.selectYr = tempData.selectYr;
                                        $scope.self.status = tempData.status;
                                        $scope.self.isbehavioralrate = tempData.isbehavioralrate;
                                        $scope.self.appDate = tempData.appDate;
                                        $scope.self.appNext = tempData.appNext;
                                        $scope.self.pafPeriodFrm = tempData.pafPeriodFrm;
                                        $scope.self.pafPeriodTo = tempData.pafPeriodTo;

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };
                                $scope.onCopyPreviousPeriodPaf = function () {
                                    try {
                                        $http.get(coreapi + 'pms/get-previous-period-paf/' + $scope.self.empId).success(function (response, status, headers, config) {

                                            if (!response.hasError) {

                                                $scope.previousPeriodPafList = response.data;
                                                $rootScope.openModalForm('#modal-panel-previous-period-paf-with-details');
                                            }
                                            else {
                                                $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onCopyPreviousPeriodPaf: ' + JSON.stringify(response.errorMessage));
                                            }
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onCopyPreviousPeriodPaf: ' + JSON.stringify(err.message));
                                    }
                                }

                                $scope.onSelectKPIFromSpecificUser = function () {
                                    try {
                                        $http.get(coreapi + 'pms/getEmpSamePosition/?empID=' + $scope.self.empId).success(function (response, status, headers, config) {

                                            $scope.kpiFromSpecificUser = response.data;
                                            $rootScope.openModalForm('#modal-panel-kpi-from-specific-user');
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onCopyPreviousPeriodPaf: ' + JSON.stringify(err.message));
                                    }
                                }

                                $scope.onSelectSpecificUserKP = function () {
                                    for (var itm in $scope.kpiFromSpecificUser) {
                                        if ($scope.kpiFromSpecificUser[itm].selected) {
                                            console.log(JSON.stringify($scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList, null, 2));

                                            //populate paf detail into view
                                            for (var index in $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList) {
                                                //get kpi indecator
                                                for (var ikpi in $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst) {
                                                    var kra = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kra;
                                                    var description = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].KEY_INDICATOR;
                                                    var weight = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].KEY_PERCENT;;
                                                    var itarget = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].KPI_TARGET
                                                    var indicatorId = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].posmainkpiId;
                                                    var iseditdesc = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].iseditdesc;
                                                    var istargetlock = $scope.kpiFromSpecificUser[itm].PAFDtl.kpiMasterKraList[index].kpi_lst[ikpi].istargetlock;
                                                    plotPafRecord2(kra, description, weight, indicatorId, itarget, iseditdesc, istargetlock);//append kpi indicators
                                                }

                                            }
                                         
                                            $rootScope.closeModalForm();
                                            break;
                                        }
                                    }
                                }

                                $scope.onSelectMaintenanceIndicator = function () {
                                    try {
                                        $http.get(coreapi + 'pms/get-maintenance-indicator/' + $scope.self.positioncode).success(function (response, status, headers, config) {
                                            $scope.mainIndicator = response;
                                            $rootScope.openModalForm('#modal-panel-maintenance-indicator');
                                        }).error(function (data, status, headers, config) {
                                            HttpErrorService.getStatus(status, data);
                                        });
                                    } catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'onInit: ' + JSON.stringify(err.message));
                                    }
                                }

                                $scope.onSelectedMaintenanceIndicator = function () {
                                    try {
                                    
                                            for (var idtl = 0; idtl <= $scope.mainIndicator.length - 1; idtl++) {//loop the kra details
                                                for (var ikpi = 0; ikpi <= $scope.mainIndicator[idtl].kpi.length - 1; ikpi++) {//loop the kpi details
                                                    if ($scope.mainIndicator[idtl].kpi[ikpi].selected) {//if the selected kpi is mark true append this kpi indicator to paf template

                                                        var kra = $scope.mainIndicator[idtl].kra;
                                                        var description = $scope.mainIndicator[idtl].kpi[ikpi].kpidescription;
                                                        var weight = 0;
                                                        var itarget = $scope.mainIndicator[idtl].kpi[ikpi].targetvalue
                                                        var indicatorId = $scope.mainIndicator[idtl].kpi[ikpi].posmainkpiId;
                                                        var iseditdesc = $scope.mainIndicator[idtl].kpi[ikpi].iseditdesc;
                                                        var istargetlock = $scope.mainIndicator[idtl].kpi[ikpi].istargetlock;
                                                        plotPafRecord2(kra, description, weight, indicatorId, itarget, iseditdesc,istargetlock);//append kpi indicators
                                                    }
                                                }
                                            }
                                        

                                        $rootScope.closeModalForm();
                                    }
                                    catch (err) {
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
                                function plotPafRecord2(KRA, DESCRIPTION, WEIGHT, indicatorId, itarget, iseditdesc, istargetlock) {
                                    try {
                                        var masterKra = [];

                                        switch (KRA) {
                                            case 'BUSINESS PROCESS':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId, itarget,iseditdesc, istargetlock);
                                                break;
                                            case 'CUSTOMER':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId, itarget, iseditdesc, istargetlock);
                                                break;
                                            case 'FINANCIAL':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId, itarget, iseditdesc, istargetlock);
                                                break;
                                            case 'PEOPLE DEVELOPMENT':
                                                masterKra = filterFilter($scope.self.kpiMasterKraList, { kra: KRA })[0].kpi_lst;
                                                $scope.onAddKpi(masterKra, DESCRIPTION, WEIGHT, indicatorId, itarget, iseditdesc, istargetlock);
                                                break;
                                            case 'BEHAVIORAL INDICATORS':
                                                $scope.onAddKpi($scope.self.behaveKRA.kpi_lst, DESCRIPTION, WEIGHT, indicatorId, itarget, iseditdesc, istargetlock);
                                                break;
                                        }
                                    }
                                    catch (err) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'plotPafRecord2: ' + JSON.stringify(err.message));
                                    }

                                }

                                //run @ first load this function
                                $scope.onInit = function () {
                                    $scope.ongetAppSetting();
                                    $scope.self.isbehavioralrate = true;
                                    if (mode!== 'nw') {
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
                                    $http.get(coreapi + 'pms/get-pano-details/' + p).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable
                                            $scope.self.isbehavioralrate = true;
                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };

                                //get paf template
                                $scope.onGetNewDataTemplate = function () {
                                  
                                    $http.get(coreapi + 'pms/get-paf-new-tpl/' + $scope.self.empId).success(function (data, status, headers, config) {
                                        $scope.self = data;//set temp variable
                                        $scope.self.isbehavioralrate = true;
                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };


                                //add main kpi
                                $scope.onAddKpi = function (p1, p2, p3, p4, p5, p6,p7,p8) {
                                    p1.push({
                                        'KEY_INDICATOR': p2,
                                        'KEY_PERCENT': p3,
                                        'delFlag': 0,
                                        'posmainkpiId': p4,
                                        'KPI_TARGET': p5,
                                        'iseditdesc': p6,
                                        'istargetlock':p7,
                                        'IsOveride': p8
                                    });

                                };

                                //back to paf list
                                $scope.onBackList = function () {
                                    $state.go('paf-list');
                                };

                                //on search subordinates
                                $scope.onSearchSub = function () {
                                    var empid = $AspCookie.get('_214', 'empId');
                                    $http.get(coreapi + 'pms/get-browse-subordinate/' + empid).success(function (data, status, headers, config) {
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
                                    $scope.self.positioncode = p.positioncode;
                                };

                                //save PAF details
                                $scope.onSavePaf = function () {

                                    var itotalKPAPercentage = 0;
                                    var itotalKPIPercentage = 0;
                                    var itotalBhavePercentage = 0;

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

                                    $http.post(coreapi + 'pms/save-paf-details/', $scope.self).success(function (data, status, headers, config) {
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


                                $scope.onSaveOveridePaf = function () {

                                    var itotalKPAPercentage = 0;
                                    var itotalKPIPercentage = 0;
                                    var itotalBhavePercentage = 0;

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.appDate = $('#appDate').data().date;
                                    $scope.self.appNext = $('#appNext').data().date;
                                    $scope.self.status = 'O';

                                    //check if the KRA percentage is not equal to 100
                                    if (($scope.self.KRAPercentage + $scope.self.behaveKRA.kra_percent) != 100) {
                                        $rootScope.ShowPrompt('#modal-panel-prompt-error', 'Cannot save PAF. Make sure your Percentage total for KRA and Behavioral section is equal to 100%');
                                        return;
                                    }

                                    //check if the KPI Master  is not equal to 100
                                    for (var ikra = 0; ikra < $scope.self.kpiMasterKraList.length; ikra++) {
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

                                    for (var ikra = 0; ikra < $scope.self.kpiMasterKraList.length; ikra++) {
                                        for (var ikpi = 0; ikpi < $scope.self.kpiMasterKraList[ikra].kpi_lst.length; ikpi++) {
                                            if ($scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].delFlag != 1) {//sum all percentage delFlag = 0
                                                $scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].kpirating = $scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].kpiratingoverride;
                                            }
                                        }
                                    }

                                    $http.post(coreapi + 'pms/post-paf-details/', $scope.self).success(function (data, status, headers, config) {
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

                                $scope.onResit = function () {
                                    var r = confirm("Do you want to reset this PAF?");
                                    if (r == true) {

                                        // resit KRA
                                        for (var ikra = 0; ikra < $scope.self.kpiMasterKraList.length; ikra++) {
                                           
                                            if ($scope.self.kpiMasterKraList[ikra].KRA_ID != "BEHAVIORAL") {
                                                $scope.self.kpiMasterKraList[ikra].kra_percent = 0;
                                                for (var ikpi = 0; ikpi < $scope.self.kpiMasterKraList[ikra].kpi_lst.length; ikpi++) {
                                                    $scope.self.kpiMasterKraList[ikra].kpi_lst[ikpi].delFlag = 1;
                                                }
                                            }
                                        }

                                        // resit BEHAVIORAL
                                        for (var ibhave = 0; ibhave < $scope.self.behaveKRA.kpi_lst.length; ibhave++) {
                                            $scope.self.behaveKRA.kpi_lst[ibhave].delFlag = 1;
                                        }

                                        $scope.self.behaveKRA.kra_percent = 0;
                                        $scope.self.KRAPercentage = 0;
                                    }
                                }


                          

                            
                                //Close PAF details
                                $scope.onClosePMS = function () {

                                    for (var i = 0; i <= $scope.self.behaveKRA.kpi_lst.length - 1; i++) {

                                        if ($scope.self.behaveKRA.kpi_lst[i].kpirating == undefined || $scope.self.behaveKRA.kpi_lst[i].kpirating == "0") {
                                            Notification.error('Enable to close this PAF please rate behavioral indicator!');
                                            return;
                                        }
                                    }

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.appDate = $('#appDate').data().date;
                                    $scope.self.appNext = $('#appNext').data().date;
                                    $scope.self.status = 'C';

                                    $http.post(coreapi + 'pms/post-close-paf-details/', $scope.setup).success(function (data, status, headers, config) {
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

app.controller('pms.setup.view', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
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
                                        $http.get(coreapi + 'pms/get-indicator-by-type/?kraType=' + $scope.kraType + '&empId=' + $scope.self.empId).success(function (response, status, headers, config) {

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
                                    $http.get(coreapi + 'pms/get-pano-details/?p=' + p).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable
                                            $scope.self.selectYr = parseInt(data.data.selectYr)
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
                                    $http.get(coreapi + 'pms/get-paf-new/' + empid).success(function (data, status, headers, config) {
                                        if (!data.hasError) {
                                            $scope.self = data.data;//set temp variable

                                        } else {
                                            console.log('error:onGetData \n' + data.errorMessage);
                                        }

                                    }).error(function (data, status, headers, config) {
                                        HttpErrorService.getStatus(status, data);
                                    });
                                };

                                //back to paf list
                                $scope.onBackList = function () {
                                    $state.go('paf-list');
                                };

                         

                                //save PAF details
                                $scope.onSavePaf = function () {

                                    $scope.self.crea_by = $AspCookie.get('_214', 'empId');
                                    $scope.self.appDate = $('#appDate').data().date;
                                    $scope.self.appNext = $('#appNext').data().date;

                                    $http.post(coreapi + 'pms/post-paf-details/', $scope.self).success(function (data, status, headers, config) {
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

