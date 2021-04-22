(function (window, angular, undefined) {
    'use strict';
    var app = angular.module('apps.config', ['ng', 'selectize','angular.filter','ngAnimate'])
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                    .otherwise('/dashboard');

                $stateProvider
                    .state('dashboard', {
                        url: '/dashboard',
                        templateUrl: coredomain + '/home/Dashboard',
                        controller: 'ctrlDashboard as ctrl',
                        data: {
                            pageTitle: 'Admin System',
                            modulename: 'Admin Panel'
                        },
                        ncyBreadcrumb: {
                            label: 'Dashboard'
                        }
                    })
                    .state('releasenotes', {
                        url: '/releasenotes',
                        templateUrl: coredomain + '/Home/Releasenote',
                        controller: 'ctrlReleasenote as ctrl',
                        ncyBreadcrumb: {
                            label: 'Release Notes'
                        }
                    })
                    .state('161100000021', {
                        url: '/pms/access/view',
                        templateUrl: coredomain + '/pms/pms-access-view/',
                        controller: 'pms.UserAccess as view',
                        ncyBreadcrumb: {
                            label: 'User List'
                        }
                    }).state('636452127076440000', {
                        url: '/pms/force-close-paf',
                        templateUrl: coredomain + '/pms/force-close-paf/',
                        controller: 'pms.UserAccess as view',
                        ncyBreadcrumb: {
                            label: 'Force Close PAF'
                        }
                    })
                    .state('16310000000051', {
                        url: '/pms/open-close-paf',
                        templateUrl: coredomain + '/pms/open-close-paf/',
                        controller: 'pms.UserAccess as view',
                        ncyBreadcrumb: {
                            label: 'Open Close PAF'
                        }
                    })

                    .state('2017061810565760', {
                        url: '/pms/delete-open-paf',
                        templateUrl: coredomain + '/pms/delete-open-paf/',
                        controller: 'pms.UserAccess as view',
                        ncyBreadcrumb: {
                            label: 'Delete Open PAF'
                        }
                    })
                    .state('pms-access-setup', {
                        url: '/pms/access/setup/:userid',
                        templateUrl: coredomain + '/pms/pms-access-setup/',
                        controller: 'pms.UserAccess.Setup as view',
                        ncyBreadcrumb: {
                            label: 'User Setup',
                            parent: '161100000021'
                        }
                    })
                    .state('150400000015', {
                        url: '/pms/kpi/idicator',
                        templateUrl: coredomain + '/pms/kpi-indicator/',
                        controller: 'pms.indicator as view',
                        ncyBreadcrumb: {
                            label: 'KPI Indicator'
                        }
                    })

                    //cycle Period routes
                    .state('636552378519035785', {
                        url: '/pms/cycle-period',
                        templateUrl: coredomain + '/pms/CyclePeriod/',
                        controller: 'pms.cycle.period as ctrl',
                        ncyBreadcrumb: {
                            label: 'Cycle Period'
                        }
                    })

                    //Improvement Plan Routes
                    .state('636554137207264928', {
                        url: '/pms/improvement-plan',
                        templateUrl: coredomain + '/pms/ImprovementPlan/',
                        controller: 'pms.improvement.plan as ctrl',
                        ncyBreadcrumb: {
                            label: 'Improvement Plan'
                        }
                    })

                    //Add Improvement Plan Routes
                    .state('add-improvement-plan', {
                        url: '/pms/add-improvement-plan/:hashcode',
                        templateUrl: coredomain + '/pms/AddImprovementPlan/',
                        controller: 'pms.add.improvement.plan as ctrl',
                        ncyBreadcrumb: {
                            label: 'Add Improvement Plan'
                        }
                    })

                    //Add Potential Assesment Routes
                    .state('636585143349595653', {
                        url: '/pms/add-assessment/',
                        templateUrl: coredomain + '/pms/AddPotentialAssessment/',
                        controller: 'pms.add.potential.assessment as ctrl',
                        ncyBreadcrumb: {
                            label: 'Add Potential Assesment'
                        }
                    })

                    //Potential Assesment List Routes
                    .state('636585144383646687', {
                        url: '/pms/palist-potential-assessment/',
                        templateUrl: coredomain + '/pms/PAListPotentialAssesment/',
                        controller: 'pms.palist.potential.assessment as ctrl',
                        ncyBreadcrumb: {
                            label: 'Record Performance(Potential Assessment List)'
                        }
                    })


                    //Rate Potential Assessment Route
                    .state('employee-ba-entry', {
                        url: '/pms/employee-pa-entry/:hashcode',
                        templateUrl: coredomain + '/pms/PotentialAssesmentEntry/',
                        controller: 'pms.employee.pa.entry as ctrl',
                        ncyBreadcrumb: {
                            label: 'Record Performance',
                            parent: '636585144383646687'
                        }
                    })

                    //Rate Potential Assessment Report Route
                    .state('636595850407351355', {
                        url: '/pms/potential-assessment-report',
                        templateUrl: coredomain + '/pms/PotentialAssessmentReport/',
                        controller: 'pms.potential.assessment.report as ctrl',
                        ncyBreadcrumb: {
                            label: 'Potential Assessment Report'
                        }
                    })

                    .state('paf-list', {
                        url: '/pms/paf-list',
                        templateUrl: coredomain + '/pms/paf-list/',
                        controller: 'pms.paflist',
                        ncyBreadcrumb: {
                            label: 'Open Employee Paf',
                        }
                    })

                    .state('163000000036', {
                        url: '/pms/view-close-paf',
                        templateUrl: coredomain + '/pms/view-close-paf/',
                        controller: 'pms.paflist',
                        ncyBreadcrumb: {
                            label: 'Performance History',
                        }
                    })
                    .state('paf-view-closed-setup', {
                        url: '/pms/paf-view-closed-setup/:pano',
                        templateUrl: coredomain + '/pms/paf-view-closed-setup/',
                        controller: 'pms.setup',
                        ncyBreadcrumb: {
                            label: 'View Closed Paf',
                            parent: '163000000036'
                        }
                    })
                    .state('161300000036', {
                        url: '/pms/override-paf-list',
                        templateUrl: coredomain + '/pms/override-paf-list/',
                        controller: 'pms.paflist',
                        ncyBreadcrumb: {
                            label: 'Rate Override',
                        }
                    })
                    .state('paf-setup-override', {
                        url: '/pms/paf-override/:pano',
                        templateUrl: coredomain + '/pms/paf-override/',
                        controller: 'pms.setup.override',
                        ncyBreadcrumb: {
                            label: 'Override Paf',
                            parent: '161300000036'
                        }
                    })

                    .state('161600000036', {
                        url: '/pms/paf-list-closing/',
                        templateUrl: coredomain + '/pms/paf-list-closing/',
                        controller: 'pms.paflist',
                        ncyBreadcrumb: {
                            label: 'PAF Period Closing'
                        }
                    })

                    .state('closing-setup', {
                        url: '/pms/paf-closing-setup/:empId/:hashcode',
                        templateUrl: coredomain + '/pms/paf-closing-setup/',
                        controller: 'pms.paf.close',
                        ncyBreadcrumb: {
                            label: 'PAF Closing Setup',
                            parent: '161600000036'
                        }
                    })

                    .state('paf-setup-new', {
                        url: '/pms/paf-setup?pano&em&md',
                        templateUrl: coredomain + '/pms/paf-setup/',
                        controller: 'pms.setup',
                        ncyBreadcrumb: {
                            label: 'New Paf',
                            parent: 'paf-list'
                        }
                    })
                    .state('paf-setup-edit', {
                        url: '/pms/paf-setup/:pano/:pafid',
                        templateUrl: coredomain + '/pms/paf-setup/',
                        controller: 'pms.setup',
                        ncyBreadcrumb: {
                            label: 'Edit Paf',
                            parent: 'paf-list'
                        }
                    })
                    .state('paf-setup-view', {
                        url: '/pms/paf-setup-view/:pano',
                        templateUrl: coredomain + '/pms/paf-setup/',
                        controller: 'pms.setup.view',
                        ncyBreadcrumb: {
                            label: 'View Paf',
                            parent: 'paf-list'
                        }
                    })
                    .state('kpi-assignment', {
                        url: '/pms/PAFListSubKPI/',
                        templateUrl: coredomain + '/pms/PAFListSubKPI/',
                        controller: 'pms.paflist-subkpi',
                        ncyBreadcrumb: {
                            label: 'Performance Indicator(PAF List)'
                        }
                    })
                    .state('sub-kpi-setup', {
                        url: '/pms/kpi-assignment/:id',
                        templateUrl: coredomain + '/pms/kpi-assignment/',
                        controller: 'pms.kpi.assignment',
                        ncyBreadcrumb: {
                            label: 'KPI Assigment',
                            parent: 'kpi-assignment'
                        }
                    })

                    .state('employee-rate-entry', {
                        url: '/pms/PAFListRecordPerformance/',
                        templateUrl: coredomain + '/pms/PAFListRecordPerformance/',
                        controller: 'pms.paflist-record-performance',
                        ncyBreadcrumb: {
                            label: 'Recored Performance(PAF List)'
                        }
                    })
                    .state('paf-rate-entry', {
                        url: '/pms/employee-rate-entry/:id',
                        templateUrl: coredomain + '/pms/employee-rate-entry/',
                        controller: 'pms.rate.entry',
                        ncyBreadcrumb: {
                            label: 'Recored Performance',
                            parent: 'employee-rate-entry'
                        }
                    })
                    .state('performance-rating-report', {
                        url: '/pms/performance-rating-report/',
                        templateUrl: coredomain + '/pms/performance-rating-report/',
                        controller: 'pms.report.performanceRating',
                        ncyBreadcrumb: {
                            label: 'Performance Rating Report'
                        }
                    })
                    .state('employee-paf-report', {
                        url: '/rpt/employee-paf-report',
                        templateUrl: coredomain + '/report/employee-paf-report/',
                        controller: 'employee.paf.report',
                        ncyBreadcrumb: {
                            label: 'Employee PAF Report'
                        }
                    })
                    .state('636848957429479102', {//employee-standing-report
                        url: '/pms/final-paf-report',
                        templateUrl: coredomain + '/report/employee-standing-report/',
                        controller: 'pms.final.paf.report as ctrl',
                        ncyBreadcrumb: {
                            label: 'Final PAF Report'
                        }
                    })
                    .state('previewPerformanceRating', {
                        url: '/pms/performance-rating-preview/:pano',
                        templateUrl: coredomain + '/pms/performance-rating-preview/',
                        controller: 'pms.report.performanceRating.Preview',
                        ncyBreadcrumb: {
                            label: 'Preview',
                            parent: 'performance-rating-report'
                        }
                    })
                    .state('150900000016', {//monthly progrisive report
                        url: '/rpt/m/p/r/',
                        templateUrl: coredomain + '/report/monthly-progressive-report/',
                        controller: 'pms.report.monthly.progrissive.report',
                        ncyBreadcrumb: {
                            label: 'Monthly Progrisive Report'
                        }
                    })
                    .state('monthlyProgressiveREport', {
                        url: '/rpt/m/p/r/p?pano&mfrm&mto',
                        templateUrl: coredomain + '/report/monthly-progressive-preview/',
                        controller: 'pms.report.monthly.progrissive.report',
                        ncyBreadcrumb: {
                            label: 'Performance Rating Report'
                        }
                    })
                    .state('160400000036', {
                        url: '/pms/current/standing/',
                        templateUrl: coredomain + '/report/current-standing/',
                        controller: 'employee.paf.report',
                        ncyBreadcrumb: {
                            label: 'Current Standing'
                        }
                    })
                    .state('16060000000052', {
                        url: '/report/paf-results/',
                        templateUrl: coredomain + '/report/paf-results/',
                        controller: 'pms.pafresult as ctrl',
                        ncyBreadcrumb: {
                            label: 'PAF Results'
                        }
                    })
                    .state('636799944595274361', {
                        url: '/app/settings/',
                        templateUrl: coredomain + '/apps/AppSettings/',
                        controller: 'app.settings as ctrl',
                        ncyBreadcrumb: {
                            label: 'App Settings'
                        }
                    })
                    .state('636802987611508903', {
                        url: '/pms/Analytics/',
                        templateUrl: coredomain + '/report/Analytics/',
                        controller: 'analytics as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Analytics'
                        }
                    })
                    .state('636805462206253984', {
                        url: '/pms/improvement-plan-report/',
                        templateUrl: coredomain + '/report/ImprovementPlan/',
                        controller: 'improvement.plan.report as ctrl',
                        ncyBreadcrumb: {
                            label: 'Improvement Plan Report'
                        }
                    })
                    .state('637115115741468183', {
                        url: '/cdpreport/',
                        templateUrl: coredomain + '/report/CdpReport',
                        controller: 'ctrlReport as ctrl',
                        ncyBreadcrumb: {
                            label: 'CDP Result'
                        }
                    })
                    .state('pms-cd-goalaction-plan', {
                        url: '/cd-goalaction?em&type&action&cdpId',
                        templateUrl: coredomain + '/pms/GoalAction',
                        controller: 'ctrlGoalAction as ctrl',
                        ncyBreadcrumb: {
                            label: 'Goal/Action Plan'
                        }
                    })
                    .state('637256748664377908', {
                        url: '/PmsUtilizationAlabang',
                        templateUrl: coredomain + '/PmsUtilization/Alabang',
                        controller: 'ctrlPmsUtilizationAlabang as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256748854135312', {
                        url: '/PmsUtilizationFTM',
                        templateUrl: coredomain + '/PmsUtilization/FTM',
                        controller: 'ctrlPmsUtilizationFTM as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256688668923566', {
                        url: '/PmsUtilizationD1',
                        templateUrl: coredomain + '/PmsUtilization/District1',
                        controller: 'ctrlPmsUtilizationD1 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256690281955313', {
                        url: '/PmsUtilizationD2',
                        templateUrl: coredomain + '/PmsUtilization/District2',
                        controller: 'ctrlPmsUtilizationD2 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256747249453326', {
                        url: '/PmsUtilizationD3',
                        templateUrl: coredomain + '/PmsUtilization/District3',
                        controller: 'ctrlPmsUtilizationD3 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256747944621042', {
                        url: '/PmsUtilizationD4',
                        templateUrl: coredomain + '/PmsUtilization/District4',
                        controller: 'ctrlPmsUtilizationD4 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637244764011577070', {
                        url: '/PmsUtilizationD5',
                        templateUrl: coredomain + '/PmsUtilization/District5',
                        controller: 'ctrlPmsUtilizationD5 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637256748481901260', {
                        url: '/PmsUtilizationD6',
                        templateUrl: coredomain + '/PmsUtilization/District6',
                        controller: 'ctrlPmsUtilizationD6 as ctrl',
                        ncyBreadcrumb: {
                            label: 'PMS Utilization'
                        }
                    })
                    .state('637115112082442032', {
                        url: '/cdp',
                        templateUrl: coredomain + '/pms/Cdp',
                        controller: 'pms.careerdeveplopmentplan as ctrl',
                        ncyBreadcrumb: {
                            label: 'CDP'
                        }



                    }).state('637345700931377709', {
                        url: '/cdpmaintenance',
                        templateUrl: coredomain + '/pms/CDPMaintenance',
                        controller: 'ctrlCDPMaintenance as ctrl',
                        ncyBreadcrumb: {
                            label: 'CDP Maintenance'
                        }



                    });


            }]);

})(window, window.angular);