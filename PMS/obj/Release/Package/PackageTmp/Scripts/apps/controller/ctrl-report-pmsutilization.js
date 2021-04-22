﻿
app.constant("moment", moment);
app.controller('ctrlPmsUtilization', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', 'filterFilter', '$AspCookie', 'HttpErrorService', 'GlobalHelper', 'Notification', '$localForage', '$timeout', '$window',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, filterFilter, $AspCookie, HttpErrorService, GlobalHelper, Notification, $localForage, $timeout, $window) {

        $("#toTopHover").trigger("click");
        var empFullName = $AspCookie.get('_214', 'fullname');
        var empId = $AspCookie.get('_214', 'empId');
        var self = this;
        var improvementPlanId;
        self.aliascode = '';
        self.currentPage = 0;
        self.selectedImpplanId;
        $scope.ishasGoal = false;
        $scope.showaddGoal = true;
        self.GoalActionPlan = {};
        var datecreated = moment().format();
        //$scope.datecreated = $filter('date')($scope.datecreated,  'dd-MM-yyyyThh:mm:ss'); 

        //$scope.datecreated  = new Date();
        //$scope.datecreated = $scope.datecreated.toISOString();
        $scope.datecreated = datecreated.replace(/"/g, '');


        var hashcode = $stateParams.hashcode;
        $scope.employeename = empFullName;
        self.isview = true;

        //Format Date Year/Month/Day
        $scope.dateFormat = 'yyyy/MM/dd';

        // Disable weekend selection
        $scope.dateOption = {
            showWeeks: false,
        };

        $scope.durationOption = [
            { value: 'Week', text: 'Weekly' },
            { value: 'Month', text: 'Monthly' },
            { value: 'Year', text: 'Yearly' }
        ];

        $scope.tickInterval = 1000; //ms

        var tick = function () {
            $scope.modifydate = Date.now(); // get the current time
            $scope.modifydate = $filter('date')($scope.modifydate, "yyyy-MM-dd HH:mm:ss a");
            $timeout(tick, $scope.tickInterval); // reset the timer
        };

        // Start the timer
        $timeout(tick, $scope.tickInterval);

        var ticks = function () {
            $scope.completedate = Date.now(); // get the current time
            $scope.completedate = $filter('date')($scope.completedate, "yyyy-MM-dd HH:mm:ss");
            $timeout(ticks, $scope.tickInterval); // reset the timer
        };

        // Start the timer
        $timeout(ticks, $scope.tickInterval);


        //opening date from picker
        $scope.openDateStart = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope[opened] = true;
        };


        self.missedKPIWithImprovementPlan = {};

        $scope.onInit = function () {

            //var UserID = $AspCookie.get('_214', 'empId');
            //$http.get(coreapi + 'GetAllOpenGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
            //    $scope.cdpgoalplan = data;

            //});
            $http.get(coreapi + 'Pms/pms-utilization-report').success(function (response,data, status, headers, config) {
                $scope.pmsutilizationList = response;


            });
     

            //    HttpErrorService.getStatus(status, data);
            //});


        };
        $scope.Export = function () {
            $("#PmsUtilization").table2excel({
                filename: "PmsUtilization.xls"
            });
        };
   

    }



]);





