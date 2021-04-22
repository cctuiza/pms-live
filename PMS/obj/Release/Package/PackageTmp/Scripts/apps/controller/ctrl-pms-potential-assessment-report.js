app.controller('pms.potential.assessment.report', ['$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal', '$window', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
    function ($stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, $window, filterFilter, HttpErrorService, GlobalHelper) {


        var self = this;

        self.onInit = function () {
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
                if (!data.hasError) {
                    self.msgInvalid = false;
                    self.pafMaster = data.data;
                    console.log(self.pafMaster);
                }
                else {
                    self.msgInvalid = true;
                    self.errorMsg = data.errorMessage
                }

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
        };

        self.onViewDetails = function (p) {
            if (p.length != 0) {
                return true;
            }
            else {
                return false;
            }
        };

        self.onViewCurrentStanding = function (p) {
            console.log(p);
            $window.open(pmsdomain + 'report/BehavioralAssesment/' + p);
        }

        //self.hasOpen = function (p) {
        //    var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'C' }).length;
        //    if (PafDtl > 0) {
        //        return true;
        //    } else {
        //        return false;
        //    }
        //}


        self.onViewPaf = function (p) {
            self.panoList = p.pmsPafMaster;
            $rootScope.openModalForm('#modal-panel-paflist');
        };

    }]);
