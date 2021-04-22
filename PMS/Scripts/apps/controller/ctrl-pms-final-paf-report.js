app.controller('pms.final.paf.report', ['$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', '$modal', '$window', 'filterFilter', 'HttpErrorService', 'GlobalHelper','Notification',
    function ($stateParams, $state, $http, $rootScope, $filter, $AspCookie, $modal, $window, filterFilter, HttpErrorService, GlobalHelper, Notification) {
        var userId = $AspCookie.get('_214', 'empId');
        var self = this;

        self.reporData = [];
        self.onInit = function () {
            GlobalHelper.StartSpin();
            self.currentPage = 1;
            $http.get(coreapi + 'pms/get-cycle-period/?&pg=1&tk=500').success(function (response, status, headers, config) {
                if (!response.hasError) {
                    self.cyclePeriod = filterFilter(response.data, { isActive:true});
                } else {
                    Notification.error('onInit:' + response.errorMessage);
                }
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        }

        self.onGenerateReport = function () {
            $http.get(coreapi + 'pms/pms-final-report/?immediateId=' + userId + '&periodId=' + self.period).success(function (response, status, headers, config) {
                self.reporData = response;
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        }
     
    }]);
