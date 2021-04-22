app.controller("pms.add.potential.assessment", ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$sce', 'Notification', 'HttpErrorService', 'GlobalHelper', '$AspCookie',
    function ($scope, $stateParams, $state, $http, $rootScope, $sce, Notification, HttpErrorService, GlobalHelper, $AspCookie) {

        var self = this;

        self.selected = [];
        self.addbehavioralassessment = {};
        self.aliascode = '';
        self.selectedBaId;
        self.itemsPerPage = 10;
        self.currentPage = 0;
        $rootScope.appClass = "datatables-page";
        $rootScope.onInitMenu('636585143349595653');
        $("#toTopHover").trigger("click");


        //Edit Field data holder
        self.AddBehavioralAssessmentField = {};

        // notifyMe();
        self.AddBehavioralAssessment = [];

        $scope.isview = true;

        self.onInit = function (ipage) {
            GlobalHelper.StartSpin();
            self.currentPage = ipage;
            $http.get(coreapi + 'pms/get-behavioral-assessment/?&pg=' + self.currentPage + '&tk=' + self.itemsPerPage).success(function (response, status, headers, config) {
                if (!response.hasError) {
                    self.AddBehavioralAssessment = response.data;
                    self.total_count = response.total_count;
                    console.log(self.AddBehavioralAssessment);
                } else {
                    Notification.error('onInit:' + response.errorMessage);
                }
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        }

        //add new source type
        self.onNew = function () {
            self.Addbehavioralassessment = {};
            self.AddBehavioralAssessmentField.baId = 0;
            self.AddBehavioralAssessmentField.badescription = '';
            self.AddBehavioralAssessmentField.grpkra = '';
            self.AddBehavioralAssessmentField.create_by = '';
            self.AddBehavioralAssessmentField.create_date = '';
            $rootScope.openModalForm('#modal-behavioralassessment-setup');
            self.setupTitle = "New Behavioral Assessment";
        }

        //edit source type
        self.onEdit = function (param) {
            $rootScope.openModalForm('#modal-behavioralassessment-setup');
            self.setupTitle = "Edit Behavioral Assessment";

            self.AddBehavioralAssessmentField = angular.copy(param);
        }

        //delete
        self.onDelete = function (param) {
            self.selectedBaId = param;
            console.log(self.selectedBaId);
            $rootScope.openModalForm('#modal-sourcetype-delete-confirm');
        }

        //confirm delete
        self.confirm = function () {
            GlobalHelper.StartSpin();
            $http.delete(coreapi + 'pms/delete-behavioral-assessment/' + self.selectedBaId).success(function (response, status, headers, config) {
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

        //save source type
        self.onSave = function () {
            GlobalHelper.StartSpin();
            var userFullname = $AspCookie.get('_214', 'fullname');
            if (self.AddBehavioralAssessmentField.baId === 0) {
                self.AddBehavioralAssessmentField.create_by = userFullname;
                self.AddBehavioralAssessmentField.create_date = new Date();
                $http.post(coreapi + 'pms/add-behavioral-assessment', self.AddBehavioralAssessmentField).success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        self.onInit(self.currentPage);
                        $rootScope.closeModalForm();

                        if (self.setupTitle === "New Behavioral Assessment") {
                            Notification.success('New Behavioral Assessment has been added!');
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
                $http.put(coreapi + 'pms/update-behavioral-assessment', self.AddBehavioralAssessmentField).success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        self.onInit(self.currentPage);
                        $rootScope.closeModalForm();

                        if (self.setupTitle === "New Behavioral Assessment") {
                            Notification.success('New Behavioral Assessment has been  Added!');
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



    }]);

