app.constant("moment", moment);
app.directive('focus', function () {
    return function (scope, element, attrs) {
        element.focus();
    };
});

app.controller('ctrlCDPMaintenance', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', 'filterFilter', '$AspCookie', 'HttpErrorService', 'GlobalHelper', 'Notification', '$localForage', '$timeout',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, filterFilter, $AspCookie, HttpErrorService, GlobalHelper, Notification, $localForage, $timeout) {

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
        self.CategoryMaintenanceForm = {};
        $scope.showCdp = false;
        var datecreated = moment().format();
        var year = moment().format('YYYY');
        var cdpId;




        $scope.type = $stateParams.type;
        $scope.action = $stateParams.action;
        $scope.cdpId = $stateParams.cdpId;
        var hashcode = $stateParams.hashcode;
        var dateend = moment().endOf('year').format();
        $scope.actiontargetdate = new Date($filter('date')(new Date(dateend), "yyyy-MM-dd"));

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
            $scope.completedate = $filter('date')($scope.completedate, "yyyy-MM-dd HH:mm:ss a");
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


        //Date Show Year Only



        $scope.onInit = function () {
            
            $scope.goalweightOptions = [
                { value: 70, text: '70%' },
                { value: 20, text: '20%' },
                { value: 10, text: '10%' }];
            $http.get(coreapi + 'PMS/GetCategoryMaintenance').success(function (data, status, headers, config) {
                $scope.categorylistmaintenance = data;
              

            });



        };






        //Open Category Maintenance 
        $scope.OpenCategoryMaintenance = function () {
            $scope.categorydesc = '';
        
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                angular.element('#categorydesc').focus();
             
            });


               
                $rootScope.openModalForm('#modal-panel-addcdmaintenance');

        };


        $scope.OpenGoalMaintenance = function (cdpmaintenance, $event) {
            $scope.goaldesc = '';

            $event.preventDefault();
            $event.stopPropagation();
            $scope.categoryId = cdpmaintenance.categoryId;
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                angular.element('#goaldesc').focus();

            });



          //  $rootScope.openModalForm('#modal-panel-addgoalmaintenance');

        };

        //Post Category Maintenance
        $scope.PostCategory = function () {
            var categorylist = {
                categorydesc: $scope.categorydesc,
                createdby: empId
            };
            $http.post(coreapi + 'PMS/PostCategoryMaintenance', categorylist).success(function (data, status, headers, config) {
               
                 
               
                $http.get(coreapi + 'PMS/GetCategoryMaintenance').success(function (data, status, headers, config) {
                    $scope.categorylistmaintenance = data;
                    $scope.categorydesc = '';
                    Notification.success('Save Category Completed');
                    $scope.categoryId = '';
                    document.getElementById("categorydesc").focus();

                });

            }).error(function (data, status, headers, config) {
                document.getElementById("categorydesc").focus();
                Notification.error('Failed to Add Category');
                HttpErrorService.getStatus(status, data);
            });
        };





        //Post Goal Maintenance
        $scope.PostGoal = function () {
            var goallist = {
                goaldesc: $scope.goaldesc,
                goalweight: $scope.goalweight,
                categoryId: $scope.categoryId,
                createdby: empId

            };
            $http.post(coreapi + 'PMS/PostGoalMaintenance', goallist).success(function (data, status, headers, config) {
                $http.get(coreapi + 'PMS/GetCategoryMaintenance').success(function (data, status, headers, config) {
                    $scope.categorylistmaintenance = data;
                    $scope.goaldesc = '';
                    Notification.success('Save Goal Completed');                
                    document.getElementById("goaldesc").focus();

                });
          



            }).error(function (data, status, headers, config) {
                document.getElementById("goaldesc").focus();
                Notification.error('Failed to Add Goal');
                HttpErrorService.getStatus(status, data);
            });
        };
   

        $scope.ChangeGoalWeight = function () {
            for (var i = 0; i < $scope.goalweightOptions.length; i++) {
                if ($scope.goalweightOptions[i].value === $scope.goalweight) {
                    $scope.goalweight = $scope.goalweightOptions[i].value;
                    break;
                }
            }
        };










































        //Open Add Goal Modal
        $scope.OpenAddCD = function () {

            $scope.goaldesc = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
            self.title = "Add Career Development";



            //for (var i = 1; i <= 3; i++) {
            //    $scope.year = moment().format()
            //    $scope.yearOptions.push({ value: $scope.categorylist[i].id, text: $scope.categorylist[i].drpdisplay });

            //}



            $rootScope.openModalForm('#modal-panel-viewcdp');
        };

        //Open Add Goal Modal
        $scope.OpenAddGoalModal = function () {


            $scope.goaldesc = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
            self.title = "Add Goal";
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                $scope.categoryId;
                $scope.categoryOptions = [];
                angular.element('#goaldesc').focus();

                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].drpdata, text: $scope.categorylist[i].drpdisplay });

                }
            });


            $rootScope.openModalForm('#modal-panel-addgoalplan');
            $scope.categoryId;
        };

        //Open Add Action Modal
        $scope.OpenAddActionModal = function (goalplanList) {
            $scope.actiondesc = '';
            var dateend = moment().endOf('year').format();
            $scope.actiontargetdate = new Date($filter('date')(new Date(dateend), "yyyy-MM-dd"));
            $scope.goaldesc = goalplanList.goaldescription;
            $scope.goalId = goalplanList.goalId;
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                $scope.categoryId;
                $scope.categoryOptions = [];
                angular.element('#actiondesc').focus();

                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].drpdata, text: $scope.categorylist[i].drpdisplay });

                }
            });

            $rootScope.openModalForm('#modal-panel-addactionplan');

        };

        //Open Update Action Modal
        $scope.OpenUpdateActionModal = function () {
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                $scope.categoryId;
                $scope.categoryOptions = [];
                angular.element('#comment').focus();

                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].drpdata, text: $scope.categorylist[i].drpdisplay });

                }
            });
            self.title = "Update Action Plan";
            $rootScope.openModalForm('#modal-panel-updateactionplan');

        };


        //Open Close Action Modal
        $scope.OpenCloseActionModal = function () {

            self.title = "Close Action Plan";
            $rootScope.openModalForm('#modal-panel-closeactionplan');
        };




        //Get Goal Plan
        $scope.GetGoalPlan = function (goalplanList) {
            angular.element('#goaldesc').focus();

            $scope.goalId = goalplanList.goalId;
            $scope.goaldesc = goalplanList.goaldescription;
            $scope.createby = goalplanList.createby;
            $scope.createdate = goalplanList.createdate;
            $scope.employeeId = goalplanList.employeeId;
            $scope.status = goalplanList.status;
            $scope.isachieved = goalplanList.isachieved;

            // $scope.cdpId = goalplanList.cdpId;
            $scope.categoryId = goalplanList.categoryId;
            $scope.actionplan = goalplanList.actionplan;
            $scope.actioncomment = $scope.actionplan.actioncomment;
            if ($scope.actionplan.length > 0) {
                $scope.showEdit = true;
                $scope.showDelete = false;
                $scope.showDeleteAction = true;
            } else {
                $scope.showDelete = true;
                $scope.showDeleteAction = false;
                $scope.showEdit = false;
            }

            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                //$scope.categoryId;
                $scope.categoryOptions = [];


                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].drpdata, text: $scope.categorylist[i].drpdisplay });

                }
            });
        };

        //Get Action Plan
        $scope.GetActionPlan = function (actionplanList) {

            $scope.actionId = actionplanList.actionId;
            $scope.actiondesc = actionplanList.actiondescription;
            $scope.actiontargetdate = new Date($filter('date')(new Date(actionplanList.targetdate), "yyyy-MM-dd"));
            $scope.goalId = actionplanList.goalId;
            $scope.goaldesc = actionplanList.goaldescription;
            $scope.categoryId = actionplanList.categoryId;
            $scope.createby = actionplanList.createby;
            $scope.datecreated = actionplanList.createdate;
            $scope.actioncomment = actionplanList.actioncomment;
            if ($scope.actioncomment.length > 0) {
                $scope.showEdit = true;
                $scope.showDelete = false;
                $scope.showDeleteAction = true;
            } else {
                $scope.showDelete = true;
                $scope.showDeleteAction = false;
                $scope.showEdit = false;
            }
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;


                angular.element('#actiondesc').focus();


            });
            //$rootScope.openModalForm('#modal-panel-updateactionplan');
        };


        //Get Goal Plan
        //$scope.GetGoalPlan = function (categoryList) {
        //    $scope.cdpgoalplan = categoryList;
        //};

        //Get Subordinate CDP
        $scope.ViewCdpSubordinate = function (subordinateinfoList) {
            $scope.employeeId = subordinateinfoList.employeeId;
            $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                $scope.category = data;
                $scope.showCdp = true;
            });
            //$rootScope.openModalForm('#modal-panel-viewcdp');

        };
        //Get Personal CDP
        $scope.ViewCdpPersonal = function (personalinfoList) {
            $scope.employeeId = empId;
            $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                $scope.category = data;
                $scope.showCdp = true;
            });
            // $rootScope.openModalForm('#modal-panel-viewcdp');

        };

        self.clearGoalPlan = function () {
            $scope.goaldesc = '';
            $scope.actiondesc = '';
            $scope.actiontargetdate = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
        };


        //Add CDP
        $scope.AddSubordinateCDP = function () {
            $scope.yearoption;
            $scope.yearOptions = ['2019', '2020', '2021'];
            $state.go('pms-cd-goalaction-plan');

        };


        //Add Goal Plan
        $scope.goalplanlist = [];
        $scope.AddGoalPlan = function () {


            var cdpgoal = {
                goaldescription: $scope.goaldesc,
                employeeid: $scope.employeeId,
                categoryid: $scope.categoryId,
                cdpid: parseInt($scope.cdpId),
                status: 'O',
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'GoalPlan', cdpgoal).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.goaldesc = '';
                    $scope.goalId = '';
                    Notification.success('Save Goal Completed');
                    $scope.categoryId = '';
                    document.getElementById("goaldesc").focus();
                });


            }).error(function (data, status, headers, config) {
                document.getElementById("goaldesc").focus();
                HttpErrorService.getStatus(status, data);
            });



            //else {
            //    $scope.goalplanlist.push({
            //        goalId: $scope.goalplanlist.length,
            //        goaldescription: $scope.goaldesc,
            //        employeeid: $scope.employeeId,
            //        categoryid: $scope.categoryId,
            //        categoryname: $scope.categoryname,
            //        status: 'O',
            //        createby: empFullName,
            //        createdate: datecreated
            //    });

            //    document.getElementById("goaldesc").focus();
            //    $scope.categoryId = '';
            //    $scope.goaldesc = '';
            //    Notification.success('Save Successful');



            //}   

        };

        //Add Action Plan
        $scope.actionplanlist = [];
        $scope.AddActionPlan = function () {

            var cdpaction = {
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                targetdate: new Date($filter('date')(new Date($scope.actiontargetdate), "yyyy-MM-dd")),
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'ActionPlan', cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.actiondesc = '';
                    var dateend = moment().endOf('year').format();
                    $scope.actiontargetdate = new Date($filter('date')(new Date(dateend), "yyyy-MM-dd"));
                    Notification.success('Save Action Completed');
                    document.getElementById("actiondesc").focus();
                });


            }).error(function (data, status, headers, config) {
                document.getElementById("actiondesc").focus();
                HttpErrorService.getStatus(status, data);
            });




            //else {
            //    $scope.actionplanlist.push({
            //        actionId: $scope.actionplanlist.length,
            //        actiondescription: $scope.actiondesc,
            //        goalId: $scope.goalId,
            //        targetdate: new Date($filter('date')(new Date($scope.actiontargetdate), "yyyy-MM-dd")),
            //        iscompleted: 0,
            //        createby: empFullName,
            //        createdate: datecreated
            //    });
            //    document.getElementById("actiondesc").focus();
            //    Notification.success('Save Successful');
            //    $scope.actiondesc = '';
            //    $scope.ishasGoal = true;
            //}

        };



        //Add CD
        $scope.AddCD = function () {
            var cdplan = {
                yearno: $scope.year,
                employeeid: $scope.employeeId,
                status: 'O',
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'CareerDevelopment', cdplan).success(function (data, status, headers, config) {
                Notification.success('Save  Completed');
            });
        };


        //Save CDP
        $scope.SaveCDP = function () {
            var cdplan = {
                yearno: $scope.year,
                employeeid: $scope.employeeId,
                status: 'O',
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'CareerDevelopment', cdplan).success(function (data, status, headers, config) {
                $scope.cdpId = data.cdpid;

                $scope.addCdpyear = true;

                Notification.success('Save Successful');



            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });





        };


        //Save Goal Plan
        $scope.SaveGoalPlan = function () {

            for (var i = 0; i < $scope.goalplanlist.length; i++) {
                var cdpgoal = {
                    goaldescription: $scope.goalplanlist[i].goaldescription,
                    employeeid: $scope.goalplanlist[i].employeeid,
                    categoryid: $scope.goalplanlist[i].categoryid,
                    status: $scope.goalplanlist[i].status,
                    cdpid: parseInt($scope.cdpId),
                    createby: $scope.goalplanlist[i].createby,
                    createdate: $scope.goalplanlist[i].createdate





                };
                $http.post(coreapi + 'GoalPlan', cdpgoal).success(function (data, status, headers, config) {
                    $http.get(coreapi + 'GetGoalPlanperCDP?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                        $scope.goalList = data;
                        $scope.SaveActionPlan();

                    });

                });



            }



        };



        //Save Action
        $scope.SaveActionPlan = function () {





            for (var i = 0; i < $scope.goalplanlist.length; i++) {
                if ($scope.goalplanlist[i].categoryid === $scope.goalList[i].categoryId && $scope.goalplanlist[i].goaldescription === $scope.goalList[i].goaldescription) {
                    $scope.goalId = $scope.goalList[i].goalId;

                    for (var j = 0; j < $scope.actionplanlist.length; j++) {



                        if ($scope.goalplanlist[i].goalId === $scope.actionplanlist[j].goalId) {


                            var cdpaction = {
                                actiondescription: $scope.actionplanlist[j].actiondescription,
                                goalid: $scope.goalId,
                                targetdate: $scope.actionplanlist[j].targetdate,
                                iscompleted: 0,
                                createby: $scope.actionplanlist[j].createby,
                                createdate: $scope.actionplanlist[j].createdate

                            };
                            $http.post(coreapi + 'ActionPlan', cdpaction).success(function (data, status, headers, config) {
                                $scope.BacktoCDP();
                            });
                        }

                    }

                }

            }





        };


        //Edit Goal Plan       
        $scope.EditGoal = function () {


            var cdpgoal = {
                goalid: $scope.goalId,
                goaldescription: $scope.goaldesc,
                categoryid: $scope.categoryId,
                employeeid: $scope.employeeId,
                status: $scope.status,
                isachieved: $scope.isachieved,
                achievedate: $scope.modifydate,
                createby: $scope.createby,
                createdate: $scope.createdateOpen,
                cdpid: parseInt($scope.cdpId)
            };
            $http.put(coreapi + 'GoalPlan/' + cdpgoal.goalid, cdpgoal).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    if ($scope.category.length === 0) {
                        $scope.BacktoCDP();
                    }


                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });





            //for (var i = 0; i < $scope.goalplanlist.length; i++) {
            //    if ($scope.goalplanlist[i].goalId === $scope.goalId) {
            //        var goalplanlist = {
            //            goalId: $scope.goalplanlist[i].goalId,
            //            goaldescription: $scope.goaldesc,
            //            employeeid: $scope.goalplanlist[i].employeeId,
            //            categoryid: $scope.categoryId,
            //            categoryname: $scope.categoryname,
            //            status: $scope.goalplanlist[i].status,
            //            createby: $scope.goalplanlist[i].createby,
            //            createdate: $scope.goalplanlist[i].createdate
            //        };
            //        $scope.goalplanlist.splice($scope.goalplanlist[i].goalId, 1, goalplanlist);
            //        break;
            //    }

            //}
            //Notification.success('Edit Successful');


        };

        //Edit Action Plan
        $scope.EditAction = function () {


            var cdpaction = {
                actionid: $scope.actionId,
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                comment: $scope.currentcomment,
                targetdate: $scope.actiontargetdate,
                modifiedby: empFullName,
                modifieddate: $scope.modifydate,
                createby: $scope.createby,
                createdate: $scope.datecreated
            };
            $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;


                    Notification.success('Edit Successful');
                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });





            //else {
            //    for (var i = 0; i < $scope.actionplanlist.length; i++) {
            //        if ($scope.actionplanlist[i].actionId === $scope.actionId) {
            //            var actionplanlist = {
            //                actionId: $scope.actionplanlist[i].actionId,
            //                actiondescription: $scope.actiondesc,
            //                goalId: $scope.goalId,
            //                targetdate: new Date($filter('date')(new Date($scope.actiontargetdate), "yyyy-MM-dd")),
            //                iscompleted: $scope.actionplanlist[i].iscompleted,
            //                createby: $scope.actionplanlist[i].createby,
            //                createdate: $scope.actionplanlist[i].createdate
            //            };
            //            $scope.actionplanlist.splice($scope.actionplanlist[i].actionId, 1, actionplanlist);
            //            break;
            //        }

            //    }
            //    Notification.success('Edit Successful');
            //}


        };

        //Delete Goal Plan
        $scope.DeleteGoalPlan = function () {

            for (var i = 0; i < $scope.actionplan.length; i++) {
                for (var j = 0; j < $scope.actionplan[i].actioncomment.length; j++) {
                    $scope.actioncomment = $scope.actionplan[i].actioncomment;
                    $http.delete(coreapi + 'ActionComment/' + $scope.actioncomment[j].commentid).success(function (data, status, headers, config) {




                    }).error(function (data, status, headers, config) {
                        HttpErrorService.getStatus(status, data);
                    });
                }

                $http.delete(coreapi + 'ActionPlan/' + $scope.actionplan[i].actionId).success(function (data, status, headers, config) {

                }).error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });
            }
            $http.delete(coreapi + 'GoalPlan/' + $scope.goalId).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    Notification.success('Delete Successful');
                });
            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });





        };

        //Delete Action Plan
        $scope.DeleteActionPlan = function () {


            $http.delete(coreapi + 'ActionPlan/' + $scope.actionId).success(function (data, status, headers, config) {
                for (var i = 0; i < $scope.actioncomment.length; i++) {
                    $http.delete(coreapi + 'ActionComment/' + $scope.actioncomment[i].commentid).success(function (data, status, headers, config) {




                    }).error(function (data, status, headers, config) {
                        HttpErrorService.getStatus(status, data);
                    });
                }

                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    Notification.success('Delete Successful');
                });

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });


            $scope.showEdit = false;


        };

        //Open Delete Goal Modal     
        $scope.OpenDeleteGoalModal = function (GoalPlanList) {
            $scope.goalId = GoalPlanList.goalId;
            $scope.tempactionplan = [];
            for (var i = 0; i < $scope.actionplanlist.length; i++) {
                if ($scope.actionplanlist[i].goalId === GoalPlanList.goalId) {
                    $scope.tempactionplan.push({
                        actiondescription: $scope.actionplanlist[i].actiondescription,
                        goalId: $scope.actionplanlist[i].goalId,
                        targetdate: $scope.actionplanlist[i].targetdate,
                        iscompleted: $scope.actionplanlist[i].iscompleted,
                        createby: $scope.actionplanlist[i].createby,
                        createdate: $scope.actionplanlist[i].createdate
                    });
                }
            }

            if ($scope.tempactionplan.length > 0) {
                $scope.showDelete = false;
                $scope.showDeleteAction = true;
            } else {
                $scope.showDelete = true;
                $scope.showDeleteAction = false;

            }
            $scope.goalId = GoalPlanList.goalId;
            $scope.goaldesc = GoalPlanList.goaldescription;
            $scope.createby = GoalPlanList.createby;
            $scope.createdate = GoalPlanList.createdate;
            $rootScope.openModalForm('#modal-panel-deletegoalplan');
        };



        //Open Edit Goal Modal
        $scope.OpenEditGoalModal = function (GoalPlanList) {
            $scope.tempactionplan = [];
            for (var i = 0; i < $scope.actionplanlist.length; i++) {
                if ($scope.actionplanlist[i].goalId === GoalPlanList.goalId) {
                    $scope.tempactionplan.push({
                        actiondescription: $scope.actionplanlist[i].actiondescription,
                        goalId: $scope.actionplanlist[i].goalId,
                        targetdate: $scope.actionplanlist[i].targetdate,
                        iscompleted: $scope.actionplanlist[i].iscompleted,
                        createby: $scope.actionplanlist[i].createby,
                        createdate: $scope.actionplanlist[i].createdate
                    });
                }
            }

            if ($scope.tempactionplan.length > 0) {
                $scope.showEdit = true;

            }
            $scope.goalId = GoalPlanList.goalId;
            $scope.goaldesc = GoalPlanList.goaldescription;
            $scope.createby = GoalPlanList.createby;
            $scope.createdate = GoalPlanList.createdate;
            $rootScope.openModalForm('#modal-panel-editgoalplan');
        };



        //Open Delete Action Modal
        $scope.OpenDeleteActionModal = function (actionplanList) {

            $scope.tempactionplan = [];
            for (var i = 0; i < $scope.actionplanlist.length; i++) {
                if ($scope.actionplanlist[i].goalId === actionplanList.goalId) {
                    $scope.tempactionplan.push({
                        actiondescription: $scope.actionplanlist[i].actiondescription,
                        goalId: $scope.actionplanlist[i].goalId,
                        targetdate: $scope.actionplanlist[i].targetdate,
                        iscompleted: $scope.actionplanlist[i].iscompleted,
                        createby: $scope.actionplanlist[i].createby,
                        createdate: $scope.actionplanlist[i].createdate
                    });
                }
            }


            $scope.actionId = actionplanList.actionId;
            $scope.actiondesc = actionplanList.actiondescription;
            $scope.actiontargetdate = actionplanList.targetdate;
            $scope.goalId = actionplanList.goalId;
            $scope.datecreated = actionplanList.createdate;

            $rootScope.openModalForm('#modal-panel-deleteactionplan');
        };


        //Open Edit Action Modal
        $scope.OpenEditActionModal = function (actionplanlist) {
            $scope.actionId = actionplanlist.actionId;
            $scope.actiondesc = actionplanlist.actiondescription;
            $scope.actiontargetdate = actionplanlist.targetdate;
            $scope.goalId = actionplanlist.goalId;
            $scope.datecreated = actionplanlist.createdate;

            $rootScope.openModalForm('#modal-panel-editactionplan');
        };




        //Update Action Plan
        $scope.UpdateActionPlan = function () {



            var cdpactioncomment = {
                actioncomment: $scope.comment,
                actionid: $scope.actionId,
                createby: empFullName,
                createdate: $scope.datecreated
            };
            $http.post(coreapi + 'ActionComment', cdpactioncomment).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.comment = '';

                    Notification.success('Update Successful');
                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });

        };


        //Close Action Plan
        $scope.CloseActionPlan = function () {
            var cdpactioncomment = {
                actioncomment: 'Completed',
                actionid: $scope.actionId,
                createby: empFullName,
                createdate: $scope.datecreated
            };
            $http.post(coreapi + 'ActionComment', cdpactioncomment).success(function (data, status, headers, config) {



            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });



            var cdpaction = {
                actionid: $scope.actionId,
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                iscompleted: 1,
                completedate: $scope.completedate,
                comment: '',
                targetdate: $scope.actiontargetdate,
                modifiedby: empFullName,
                modifieddate: $scope.modifydate,
                createby: $scope.createby,
                createdate: $scope.datecreated
            };
            $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.comment = '';
                    $scope.UpdateGoalPlan();

                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });



        };

        //Back to CDP List
        $scope.BacktoCDP = function () {

            $state.go('637115112082442032');
        };

        //Update Goal Plan
        $scope.UpdateGoalPlan = function () {
            $http.get(coreapi + 'GetAllOpenActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                $scope.cdpactionplanopen = data;
                if ($scope.cdpactionplanopen.length === 0) {

                    var cdpgoal = {
                        goalid: $scope.goalId,
                        goaldescription: $scope.goaldesc,
                        categoryid: $scope.categoryId,
                        employeeid: $scope.employeeId,
                        status: 'C',
                        isachieved: 1,
                        achievedate: $scope.modifydate,
                        createby: empFullName,
                        createdate: datecreated,
                        cdpid: $scope.cdpId
                    };
                    $http.put(coreapi + 'GoalPlan/' + cdpgoal.goalid, cdpgoal).success(function (data, status, headers, config) {
                        $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                            $scope.category = data;
                            if ($scope.category.length === 0) {
                                $scope.BacktoCDP();
                            }


                        });


                    }).error(function (data, status, headers, config) {
                        HttpErrorService.getStatus(status, data);
                    });





                    Notification.success('Close Goal Successful');

                } else {
                    Notification.success('Close Action Successful');

                }
            });
        };




        //Close Goal Plan
        $scope.CloseGoalPlan = function () {



            $http.get(coreapi + 'GetAllOpenActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                $scope.cdpactionplanopen = data;

                if ($scope.cdpactionplanopen.length > 0) {
                    //for (var i = 0; i < $scope.cdpactionplanopen.length; i++) {


                    //    var cdpactioncomment = {
                    //        actioncomment: 'Completed',
                    //        actionid: $scope.cdpactionplanopen[i].actionId,
                    //        createby: empFullName,
                    //        createdate: $scope.modifydate
                    //    };
                    //    $http.post(coreapi + 'ActionComment', cdpactioncomment).success(function (data, status, headers, config) {



                    //    }).error(function (data, status, headers, config) {
                    //        HttpErrorService.getStatus(status, data);
                    //    });



                    //    var cdpaction = {
                    //        actionid: $scope.cdpactionplanopen[i].actionId,
                    //        actiondescription: $scope.cdpactionplanopen[i].actiondescription,
                    //        goalid: $scope.cdpactionplanopen[i].goalId,
                    //        iscompleted: 1,
                    //        completedate: $scope.modifydate,
                    //        comment: '',
                    //        targetdate: $scope.cdpactionplanopen[i].targetdate,
                    //        modifiedby: empFullName,
                    //        modifieddate: $scope.modifydate,
                    //        createby: $scope.cdpactionplanopen[i].createby,
                    //        createdate: $scope.cdpactionplanopen[i].createdate
                    //    };
                    //    $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {
                    //        $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    //            $scope.category = data;
                    //            $scope.comment = '';


                    //        });


                    //    }).error(function (data, status, headers, config) {
                    //        HttpErrorService.getStatus(status, data);
                    //    });



                    //}










                    //var cdpgoal = {
                    //    goalid: $scope.goalId,
                    //    goaldescription: $scope.goaldesc,
                    //    categoryid: $scope.categoryId,
                    //    employeeid: $scope.employeeId,
                    //    status: 'C',
                    //    isachieved: 1,
                    //    achievedate: $scope.modifydate,
                    //    createby: $scope.createby,
                    //    createdate: $scope.createdate,
                    //    cdpid: $scope.cdpId
                    //};
                    //$http.put(coreapi + 'GoalPlan/' + cdpgoal.goalid, cdpgoal).success(function (data, status, headers, config) {
                    //    $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                    //        $scope.category = data;

                    //        Notification.success('Close Goal Successful');

                    //    });


                    //}).error(function (data, status, headers, config) {
                    //    HttpErrorService.getStatus(status, data);
                    //});
                    Notification.error('Cant Close Goal.Please Close All of your Action Plan');
                } else {

                    $http.get(coreapi + 'GetAllActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                        $scope.cdpallactionplan = data;


                        if ($scope.cdpallactionplan.length > 0) {



                            var cdpgoalplan = {
                                goalid: $scope.goalId,
                                goaldescription: $scope.goaldesc,
                                categoryid: $scope.categoryId,
                                employeeid: $scope.employeeId,
                                status: 'C',
                                isachieved: 1,
                                achievedate: $scope.modifydate,
                                createby: $scope.createby,
                                createdate: $scope.createdate,
                                cdpid: $scope.cdpId
                            };
                            $http.put(coreapi + 'GoalPlan/' + cdpgoalplan.goalid, cdpgoalplan).success(function (data, status, headers, config) {
                                $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                                    $scope.category = data;

                                    Notification.success('Close Goal Successful');

                                });


                            }).error(function (data, status, headers, config) {
                                HttpErrorService.getStatus(status, data);
                            });
                        }
                        else {
                            Notification.error('No Action Plan. Cant Close Goal');
                        }
                    });





                }






            });








        };





        //Close Cdp
        $scope.CloseCdp = function () {

            $scope.counterror = 0;
            $http.get(coreapi + 'GetAllOpenGoalAction?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                $scope.opengoal = data;
                //for (var i = 0; i < $scope.opengoal.length; i++) {
                //    for (var j = 0; j < $scope.opengoal[i].actionplan.length; j++) {
                //        $scope.actionId = $scope.opengoal[i].actionplan[j].actionId;
                //        if ($scope.actionId !== undefined) {

                //            var cdpactioncomment = {
                //                actioncomment: 'Completed',
                //                actionid: $scope.opengoal[i].actionplan[j].actionId,
                //                createby: empFullName,
                //                createdate: $scope.modifydate
                //            };
                //            $http.post(coreapi + 'ActionComment', cdpactioncomment).success(function (data, status, headers, config) {



                //            }).error(function (data, status, headers, config) {
                //                HttpErrorService.getStatus(status, data);
                //            });



                //            var cdpaction = {
                //                actionid: $scope.opengoal[i].actionplan[j].actionId,
                //                actiondescription: $scope.opengoal[i].actionplan[j].actiondescription,
                //                goalid: $scope.opengoal[i].actionplan[j].goalId,
                //                iscompleted: 1,
                //                completedate: $scope.modifydate,
                //                comment: '',
                //                targetdate: $scope.opengoal[i].actionplan[j].targetdate,
                //                modifiedby: empFullName,
                //                modifieddate: $scope.modifydate,
                //                createby: $scope.opengoal[i].actionplan[j].createby,
                //                createdate: $scope.opengoal[i].actionplan[j].createdate
                //            };
                //            $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {



                //            }).error(function (data, status, headers, config) {
                //                HttpErrorService.getStatus(status, data);
                //            });

                //        }

                //    }



                //        if ($scope.opengoal[i].actionplan.length > 0) {



                //            var cdpgoalplan = {
                //                goalid: $scope.opengoal[i].goalId,
                //                goaldescription: $scope.opengoal[i].goaldescription,
                //                categoryid: $scope.opengoal[i].categoryId,
                //                employeeid: $scope.opengoal[i].employeeId,
                //                status: 'C',
                //                isachieved: 1,
                //                achievedate: $scope.modifydate,
                //                createby: $scope.opengoal[i].createby,
                //                createdate: $scope.opengoal[i].createdate,
                //                cdpid: $scope.opengoal[i].cdpId
                //            };
                //            $http.put(coreapi + 'GoalPlan/' + cdpgoalplan.goalid, cdpgoalplan).success(function (data, status, headers, config) {



                //            }).error(function (data, status, headers, config) {
                //                HttpErrorService.getStatus(status, data);
                //            });
                //        }
                //        else {
                //            $scope.counterror = 1;
                //        }



                //}

                if ($scope.opengoal.length > 0) {
                    $scope.counterror = 1;
                }

                if ($scope.counterror !== 1) {
                    $http.get(coreapi + 'GetCDPperYear?employeeId=' + $scope.employeeId + '&cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                        $scope.cdpheader = data;

                        var cdpheader = {
                            cdpid: parseInt($scope.cdpId),
                            yearno: $scope.cdpheader.yearno,
                            employeeid: $scope.cdpheader.employeeid,
                            status: 'C',
                            datecompleted: $scope.modifydate,
                            createby: $scope.cdpheader.createby,
                            createdate: $scope.cdpheader.createdate

                        };
                        $http.put(coreapi + 'CareerDevelopment/' + cdpheader.cdpid, cdpheader).success(function (data, status, headers, config) {

                            $http.get(coreapi + 'GetAllOpenCategory?cdpId=' + parseInt($scope.cdpId)).success(function (data, status, headers, config) {
                                $scope.category = data;

                                Notification.success('Close Cdp Successful');
                                $scope.BacktoCDP();

                            });

                        }).error(function (data, status, headers, config) {
                            HttpErrorService.getStatus(status, data);
                        });


                    });
                } else {
                    Notification.error('Cant Close Cdp.Please Check your Goal Plan and Action Plan');

                }


            });


        };




        //Change in Category
        $scope.ChangeCategoryDropdown = function () {
            for (var i = 0; i < $scope.categorylist.length; i++) {
                var categoryId = $scope.categorylist[i].drpdata;
                if ($scope.categoryId === categoryId) {
                    $scope.categoryId = $scope.categorylist[i].drpdata;
                    $scope.categoryname = $scope.categorylist[i].drpdisplay;
                    break;
                }
            }
        };



        //Change in Employee
        $scope.ChangeEmployeeName = function () {

            for (var i = 0; i < $scope.subordinateInfo.length; i++) {
                var employeeId = $scope.subordinateInfo[i].employeeId;

                if ($scope.employeeId === employeeId) {
                    $scope.employeeId = $scope.subordinateInfo[i].employeeId;

                    break;
                }
            }

        };

        //Change in Year
        $scope.ChangeinYearCovered = function () {

            $scope.hasCdp = false;
            for (var i = 0; i < $scope.cdplist.length; i++) {
                if ($scope.year === $scope.cdplist[i].yearno) {
                    $scope.hasCdp = true;
                    break;
                }


            }


        };

        $scope.GetAllCdp = function () {
            $http.get(coreapi + 'CareerDevelopment?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                $scope.cdplist = data;

            });
        };
        //Update Image
        $scope.PostSignature = function () {
            html2canvas(document.getElementById('uploadedimageupdate')).then(function (canvas) {

                var dataString = canvas.toDataURL("image/png");
                dataString = dataString.replace('data:image/png;base64,', '');



                var image = {
                    imageId: $scope.imageId,
                    productId: $scope.productId,
                    imagedata: dataString
                };


                ProductService.putImage(image).then(function () {


                    ProductService.getImage().then(function (response) {
                        $scope.images = response.data;

                    });

                    ProductService.getProduct().then(function (response) {
                        $scope.product = response.data;

                    });


                    $scope.productId = '';
                    $scope.productcode = '';
                    $scope.productname = '';
                    $scope.productdesc = '';
                    $scope.shelflife = '';
                    $scope.shelflifetype = '';
                    $scope.price = '';
                    $scope.discount = '';
                    $scope.classifications = '';
                    $scope.barcode = '';


                    document.getElementById('inp2').value = null;


                    var canvas = document.getElementById('canvasupdate');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    var canvas2 = document.getElementById('uploadedimageupdate');
                    canvas2.width = this.width;
                    canvas2.height = this.height;
                    var ctx2 = canvas2.getContext('2d');
                    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);


                });







            });

        };








    }
]);








