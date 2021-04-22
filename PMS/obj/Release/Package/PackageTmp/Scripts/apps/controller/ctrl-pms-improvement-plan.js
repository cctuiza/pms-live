//employee.improvement.plan
app.controller('pms.improvement.plan', [ '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal', '$window', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
    function ($stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, $window, filterFilter, HttpErrorService, GlobalHelper) {


        var self = this;

        self.onInit = function () {
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
                if (!data.hasError) {
                    self.msgInvalid = false;
                    self.pafMaster = data.data;
                }
                else {
                    self.msgInvalid = true;
                    self.errorMsg = data.errorMessage
                }

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
        };

        self.onViewPaf = function (p) {
            self.panoList = p.pmsPafMaster;
            $rootScope.openModalForm('#modal-panel-paflist');
        };

        self.hasOpen = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' }).length;
            if (PafDtl > 0) {
                return true;
            } else {
                return false;
            }
        }

        self.onViewCurrentStanding = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' })[0];
            $window.open(pmsdomain + 'report/CurrentStandingReport/' + PafDtl.hashcode);
        }

        self.onEditPano = function (p1, p2) {
            if (p2 === "C") {
                self.stopnote = "Enable to edit this paf is already 'CLOSE'";
            } else {
                self.stopnote = "";
                $state.go('paf-setup-edit', { 'pano': p1 });
                $rootScope.closeModalForm();
            }
        };

        self.onNewPaf = function () {
            $state.go('paf-setup-new', { 'pano': '' });
        }

        self.cancel = function () {
            self.modalInstance.dismiss();
        };

        self.onType = function (p) {

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
        };

        self.onViewDetails = function (p) {
            if (p.length != 0) {
                return true;
            }
            else {
                return false;
            }
        };

        //Navigate to Add Improvement Plan
        self.navigateAddImprovementPlan = function (param) {
            $rootScope.closeModalForm();
            $state.go('add-improvement-plan', { hashcode: param});
        }


    }]);
