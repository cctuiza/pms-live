app.controller("pms.cycle.period", ['$scope','$stateParams', '$state', '$http', '$rootScope', '$sce', 'Notification', 'HttpErrorService', 'GlobalHelper', '$AspCookie',
    function ($scope, $stateParams, $state, $http, $rootScope, $sce, Notification, HttpErrorService, GlobalHelper, $AspCookie) {

        var self = this;

        self.selected = [];
        self.cycleperiod = {};
        self.aliascode = '';
        self.selectedPeriodId;
        self.itemsPerPage = 10;
        self.currentPage = 0;
        $rootScope.appClass = "datatables-page";
        $rootScope.onInitMenu('636552378519035785');
        $("#toTopHover").trigger("click");


        //Edit Field data holder
        self.cyclePeriodField = {};

        // notifyMe();
        self.cyclePeriod = [];

        $scope.isview = true;

        //Format Date Year/Month/Day
        $scope.dateFormat = 'MM/dd/yyyy';

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

        self.onInit = function (ipage) {
            GlobalHelper.StartSpin();
            self.currentPage = ipage;
            $http.get(coreapi + 'pms/get-cycle-period/?&pg=' + self.currentPage + '&tk=' + self.itemsPerPage).success(function (response, status, headers, config) {
                if (!response.hasError) {
                    self.cyclePeriod = response.data;
                    self.total_count = response.total_count;
                } else {
                    Notification.error('onInit:' + response.errorMessage);
                }
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        };

        //add new source type
        self.onNew = function () {
            self.cycleperiod = {};
            self.cyclePeriodField.periodId = 0;
            self.cyclePeriodField.perioddescription = '';
            self.cyclePeriodField.periodyear = '';
            self.cyclePeriodField.periodfrom = '';
            self.cyclePeriodField.periodto = '';
            self.cyclePeriodField.created_by = '';
            self.cyclePeriodField.create_date = '';
            $rootScope.openModalForm('#modal-cycleperiod-setup');
            self.setupTitle = "New Topic";
        };

        //edit source type
        self.onEdit = function (param) {
            $rootScope.openModalForm('#modal-cycleperiod-setup');
            self.setupTitle = "Edit Cycle Period";

            self.cyclePeriodField = angular.copy(param);
        };

        //delete
        self.onDelete = function (param) {
            self.selectedPeriodId = param;
            console.log(self.selectedPeriodId);
            $rootScope.openModalForm('#modal-sourcetype-delete-confirm');
        };

        //confirm delete
        self.confirm = function () {
            GlobalHelper.StartSpin();
            $http.delete(coreapi + 'pms/delete-cycle-period/' + self.selectedPeriodId).success(function (response, status, headers, config) {
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
        };

        //save source type
        self.onSave = function () {
            GlobalHelper.StartSpin();
            self.cyclePeriodField.periodfrom = new Date(self.cyclePeriodField.periodfrom).toLocaleDateString();
            self.cyclePeriodField.periodto = new Date(self.cyclePeriodField.periodto).toLocaleDateString();
            var userFullname = $AspCookie.get('_214', 'fullname');
            if (self.cyclePeriodField.periodId === 0) {
                self.cyclePeriodField.created_by = userFullname;
                self.cyclePeriodField.create_date = new Date();

                $http.post(coreapi + 'pms/add-cycle-period', self.cyclePeriodField).success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        self.onInit(self.currentPage);
                        $rootScope.closeModalForm();

                        if (self.setupTitle === "New Topic") {
                            Notification.success('New Topic has been added!');
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

            } else {

                $http.put(coreapi + 'pms/update-cycle-period', self.cyclePeriodField).success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        self.onInit(self.currentPage);
                        $rootScope.closeModalForm();

                        if (self.setupTitle === "New Cycle Period") {
                            Notification.success('New Cycle has been  Added!');
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
        };

     

    }]);