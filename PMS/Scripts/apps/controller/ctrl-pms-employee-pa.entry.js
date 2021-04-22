var app = angular.module('apps');
app.controller("pms.employee.pa.entry", ['$scope',
    '$stateParams',
    '$state',
    '$http',
    '$rootScope',
    '$sce',
    'Notification',
    'HttpErrorService',
    'GlobalHelper',
    '$AspCookie',
    'filterFilter',
    function ($scope,
        $stateParams,
        $state,
        $http,
        $rootScope,
        $sce,
        Notification,
        HttpErrorService,
        GlobalHelper,
        $AspCookie,
        filterFilter)
    {

        var self = this;

        $rootScope.appClass = "datatables-page";
        $("#toTopHover").trigger("click");

        // notifyMe();
        self.GetEmployeeBa = {};
        self.behavioralHeader = {};
        self.overAllTotal = 0;
        var hashcode = $stateParams.hashcode;
        var pafheader = {};
        var UserID = $AspCookie.get('_214', 'empId');

        self.onInit = function () {
            GlobalHelper.StartSpin();
            $http.get(coreapi + 'pms/get-employee-behavioral-assessment/?hashcode=' + hashcode).success(function (response, status, headers, config) {
                if (!response.hasError) {

                    pafheader = response.header;
                    self.GetEmployeeBa = response.details;
                    self.behavioralHeader = response.behavioralHeader;

                    if (UserID === pafheader.employeeId) {
                        self.isNotMyPaf = false;
                    } else {
                        self.isNotMyPaf = true;
                    }

                 

                } else {
                    Notification.error('onInit:' + response.errorMessage);
                }
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });

        };

        self.getTotalSumSelfAssesment = function (val1, val2) {
            var newData = filterFilter(val1, { grpkra: val2 });

            var iTotalResult = 0;

            for (var x in newData) {
                iTotalResult = parseFloat(newData[x].baselfassess) + parseFloat(iTotalResult);
            }

          
            return iTotalResult;
        };

        self.getTotalSecondView = function (val1, val2) {
            var newData = filterFilter(val1, { grpkra: val2 });

            var iTotalResult = 0;

            for (var x in newData) {
                iTotalResult = parseFloat(newData[x].secondview) + parseFloat(iTotalResult);
            }

            return iTotalResult;
        };

        self.getAverageSumSelfAssesment = function (val1, val2) {
            var newData = filterFilter(val1, { grpkra: val2 });

            var iTotalResult = 0;

            for (var x in newData) {
                iTotalResult = parseFloat(newData[x].baselfassess) + parseFloat(iTotalResult);
            }

            itotalRatingBehaviorAttitudePstyle = iTotalResult / newData.length;
            return itotalRatingBehaviorAttitudePstyle;
        };



        self.getAverageSecondView = function (val1, val2) {
            var newData = filterFilter(val1, { grpkra: val2 });

            var iTotalResult = 0;

            for (var x in newData) {
                iTotalResult = parseFloat(newData[x].secondview) + parseFloat(iTotalResult);
            }

            itotalRatingBehaviorAttitudePstyle = iTotalResult / newData.length;

            return itotalRatingBehaviorAttitudePstyle;
        };

        self.totalRatingSkilsnWorkCompetencyAreas = function (val1, val2) {
            var iTotalResult = 0;

            iTotalResult = ((parseFloat(val1) + parseFloat(val2)) / 2).toFixed(2);

            return iTotalResult;
        };

        self.totalRatingBehaviorAttitudePstyle = function (val1, val2) {
            var iTotalResult = 0;
            iTotalResult = ((parseFloat(val1) + parseFloat(val2)) / 2).toFixed(2);

          
            return iTotalResult;
        };



        self.onSaveChanges = function (isposted) {

            //validate input
            if (validateInput()) {
                return;
            }

            var jObj = JSON.stringify(
            {
                    behavioralList: self.GetEmployeeBa,
                isPosted: isposted
            });

            GlobalHelper.StartSpin();
            $http.post(coreapi + 'pms/add-batch-behavioral-assessment', jObj).success(function (response, status, headers, config) {
                Notification.success('Behavioral Assessment Has Successfully Save.');
                self.onInit();
                GlobalHelper.StopSpin();
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
                GlobalHelper.StopSpin();
            });
        };

        self.getAllTotal = function (param1, param2) {
            var sumAverage = parseFloat(param1) + parseFloat(param2);
            return sumAverage/2
        };

        self.setDisableSelection = function (param1) {

            if (self.behavioralHeader.isPosted) {
                return true;
            } else {
                return param1
            }
        }

        function validateInput() {
            for (var i in self.GetEmployeeBa) {
                if (self.isNotMyPaf === false) {
                    if (self.GetEmployeeBa[i].baselfassess === 0 || self.GetEmployeeBa[i].baselfassess === undefined) {
                        Notification.error('Self Assess must not empty!');
                        return true;
                    }

                    if (self.GetEmployeeBa[i].edvalue === " " || self.GetEmployeeBa[i].edvalue === undefined) {
                        Notification.error('Essential / Desirable must not empty!');
                        return true;
                    }
                }

                //this for immediate head
                if (self.isNotMyPaf === true) {
                    if (self.GetEmployeeBa[i].secondview === 0 || self.GetEmployeeBa[i].secondview === undefined) {
                        Notification.error('Second View must not empty!');
                        return true;
                    }

                    if (self.GetEmployeeBa[i].edvalue === " " || self.GetEmployeeBa[i].edvalue === undefined) {
                        Notification.error('Essential / Desirable must not empty!');
                        return true;
                    }
                }
            }
        }
    }]);