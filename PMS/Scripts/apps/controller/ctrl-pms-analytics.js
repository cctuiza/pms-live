app.controller("analytics", ['$stateParams', '$state', '$http', '$rootScope', '$sce', 'Notification', 'HttpErrorService', 'GlobalHelper',
    function ($stateParams, $state, $http, $rootScope, $sce, Notification, HttpErrorService, GlobalHelper) {

        var self = this;
        self.corporate = "FAST SERVICES CORPORATION";
        self.bgroup = "ALABANG";
        self.currenYear = (new Date()).getFullYear();
   

        self.months = [
            { imonth: 1, monthName: "January" },
            { imonth: 2, monthName: "Febuary" },
            { imonth: 3, monthName: "March" },
            { imonth: 4, monthName: "April" },
            { imonth: 5, monthName: "May" },
            { imonth: 6, monthName: "June" },
            { imonth: 7, monthName: "July" },
            { imonth: 8, monthName: "August" },
            { imonth: 9, monthName: "September" },
            { imonth: 10, monthName: "October" },
            { imonth: 11, monthName: "November" },
            { imonth: 12, monthName: "December" }
        ];

        self.periodMonthFrom = self.months[0];
        self.periodMonthTo = self.months[11];

        self.onInit = function () {
            self.generateReport();
        };

        self.generateReport = function () {
            GlobalHelper.StartSpin();

            $http.get(coreapi + 'pms/get-analytics/?corporate=' + self.corporate + '&bgroup=' + self.bgroup + '&currenYear=' + self.currenYear + '&periodMonthFrom=' + self.periodMonthFrom.imonth + '&periodMonthTo=' + self.periodMonthTo.imonth)
                .success(function (response, status, headers, config) {

                    self.analyticsParameter = response.analyticsParameter;
                    self.PAFStatusPerBusinessGroup = response.PAFStatusPerBusinessGroup;
                    self.PAFStatusPerBranch = response.PAFStatusPerBranch;
                    statusPerBusinessGroup();
                    statusPerBranch();
                    GlobalHelper.StopSpin();
                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                    GlobalHelper.StopSpin();
                });
        };

        function statusPerBusinessGroup() {
            Highcharts.setOptions(themesDracula());
            $('#statusPerBusinessGroup').highcharts({
                chart: {
                    type: 'column'
                },
                colors: ['#2980b9', '#d35400', '#000099'],
                title: {
                    text: 'Status Per Business Group'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: self.PAFStatusPerBusinessGroup.categoryList,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} PAF</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        dataLabels: {
                            align: 'left',
                            enabled: true,
                            rotation: 0,
                            x: 2,
                            y: -10
                        }
                    }
                },
                series: [{
                    name: 'OPEN',
                    data: self.PAFStatusPerBusinessGroup.pafOpenList

                }, {
                    name: 'CLOSE',
                        data: self.PAFStatusPerBusinessGroup.pafCloseList

                }]
            });
        }


        function statusPerBranch() {
            Highcharts.setOptions(themesDracula());
            $('#statusPerBranch').highcharts({
                chart: {
                    type: 'column'
                },
                colors: ['#2980b9', '#d35400', '#000099'],
                title: {
                    text: 'Status Per Site'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: self.PAFStatusPerBranch.categoryList,
                    crosshair: true,
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    enabled: true

                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} PAF</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        dataLabels: {
                            align: 'left',
                            enabled: true
                        }
                    }
                },
                series: [{
                    name: 'OPEN',
                    data: self.PAFStatusPerBranch.pafOpenList

                }, {
                    name: 'CLOSE',
                        data: self.PAFStatusPerBranch.pafCloseList

                }]
            });
        }
    }]);