(function (window, angular, undefined) {
    'use strict';
    Highcharts.setOptions({
        colors: ['#58BB45','#f4c703']
    });

    app.controller('ctrlDashboard', ['$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter','$timeout','Notification','HttpErrorService','GlobalHelper',
                                 function ($stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, $timeout, Notification, HttpErrorService,GlobalHelper) {
                                 
                                     var self = this;
                                     $rootScope.appClass = 'dashboard-page sb-l-o sb-r-c';
                                     self.empId = $AspCookie.get('_214', 'empId');
                                     self.dashboardData = [];

                                     self.onInit = function () {
                                         GlobalHelper.StartSpin();
                                     
                                         $http.get(coreapi + 'pms/get-dashboard/?empid=' + self.empId).success(function (response, status, headers, config) {
                                             self.dashboardData = response;
                                             GlobalHelper.StopSpin();
                                         }).error(function (data, status, headers, config) {
                                             HttpErrorService.getStatus(status, data);
                                             GlobalHelper.StopSpin();
                                         });
                                     };                             
                                 }]);

})(window, window.angular);

