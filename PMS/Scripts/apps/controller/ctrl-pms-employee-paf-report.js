//employee.paf.report
app.controller('employee.paf.report', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal', '$window', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, $window, filterFilter, HttpErrorService, GlobalHelper) {


        $scope.onInit = function () {
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
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
        };

        $scope.onViewPaf = function (p) {
            $scope.panoList = p.pmsPafMaster;
            $rootScope.openModalForm('#modal-panel-paflist');
        };

        $scope.hasOpen = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' }).length;
            if (PafDtl > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onViewCurrentStanding = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' })[0];
            $window.open(pmsdomain + 'report/CurrentStandingReport/' + PafDtl.hashcode);
        }

        $scope.onEditPano = function (p1, p2) {
            if (p2 === "C") {
                $scope.stopnote = "Enable to edit this paf is already 'CLOSE'";
            } else {
                $scope.stopnote = "";
                $state.go('paf-setup-edit', { 'pano': p1 });
                $rootScope.closeModalForm();
            }
        };

        $scope.onNewPaf = function () {
            $state.go('paf-setup-new', { 'pano': '' });
        }

        $scope.cancel = function () {
            $scope.modalInstance.dismiss();
        };

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
        };

        $scope.onViewDetails = function (p) {
            if (p.length != 0) {
                return true;
            }
            else {
                return false;
            }
        };


    }]);
