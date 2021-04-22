app.controller('pms.add.improvement.plan', ['$scope','$stateParams', '$state', '$http', '$rootScope', '$filter', 'filterFilter', '$AspCookie', 'HttpErrorService', 'GlobalHelper', 'Notification', '$localForage',
    function ( $scope, $stateParams, $state, $http, $rootScope, $filter, filterFilter, $AspCookie, HttpErrorService, GlobalHelper, Notification, $localForage) {

        $("#toTopHover").trigger("click");
        var empFullName = $AspCookie.get('_214', 'fullname');
        var self = this;
        var improvementPlanId;
        self.aliascode = '';
        self.currentPage = 0;
        self.selectedImpplanId;
        self.actionPlan = {};


        var hashcode = $stateParams.hashcode;

        self.isview = true;

        //Format Date Year/Month/Day
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


        self.missedKPIWithImprovementPlan = {};

        self.onInit = function () {
        
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/get-missed-kpi/' + hashcode).success(function (data, status, headers, config) {
                self.missedKPIWithImprovementPlan = data;

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
        };

        self.addImprovementPlan = function (param) {
            let newDate = new Date();
            self.actionPlan = {
                impplanId: 0,
                kpiId: param.kpiId,
                description: param.kpidescription,
                createdby: empFullName,
                createdate: newDate,
            };
            self.title = "Add Improvement Plan";
            $rootScope.openModalForm('#modal-panel-improvementplan-setup');
        }

        //Add Improvement Plan
        self.onSaveIprovementPlan = function () {
            if (self.actionPlan.impplanId === 0){
                $http.post(coreapi + 'pms/add-improvement-plan', self.actionPlan).success(function (data, status, headers, config) {
                    Notification.success('Save completed');
                    self.onInit(self.currentPage);
                    $rootScope.closeModalForm();
                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });
            } else {
                $http.put(coreapi + 'pms/update-improvement-plan', self.actionPlan).success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        self.onInit(self.currentPage);
                        $rootScope.closeModalForm();

                        if (self.title === "Add Improvement Plan") {
                            Notification.success('New Improvement Plan  Added!');
                        } else {
                            Notification.success('Update Complete!');
                        }
                    } else {
                        Notification.error('onSave:' + response.errorMessage);
                    }
                    GlobalHelper.StopSpin();
                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                    GlobalHelper.StopSpin();
                });
            }
            
        }

        //Edit Improvement Plan
        self.onEdit = function (param) {
            $rootScope.openModalForm('#modal-panel-improvementplan-setup');
            self.title = "Edit Improvement Plan";

            self.actionPlan = angular.copy(param);
        }

       //Delete Improvement Plan
        self.onDelete = function (param) {
            self.selectedImpplanId = param;
            $rootScope.openModalForm('#modal-sourcetype-delete-confirm');
        }

        //confirm delete
        self.confirm = function () {
            GlobalHelper.StartSpin();
            $http.delete(coreapi + 'pms/delete-improvement-plan/' + self.selectedImpplanId).success(function (response, status, headers, config) {
                if (!response.hasError) {
                    self.onInit(self.currentPage);
                    $rootScope.closeModalForm();

                    Notification.success('Delete Complete!');
                } else {
                    Notification.error('delete comfirm:' + response.errorMessage);
                }
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        }

    }]);

