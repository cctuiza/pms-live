app.constant("moment", moment);
app.controller('pms.careerdeveplopmentplan', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', 'filterFilter', '$AspCookie', 'HttpErrorService', 'GlobalHelper', 'Notification', '$localForage', '$timeout',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, filterFilter, $AspCookie, HttpErrorService, GlobalHelper, Notification, $localForage,$timeout) {

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
        $scope.showCdp = false;
        var datecreated = moment().format();

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


        self.missedKPIWithImprovementPlan = {};

        $scope.onInit = function () {

            //var UserID = $AspCookie.get('_214', 'empId');
            //$http.get(coreapi + 'GetAllOpenGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
            //    $scope.cdpgoalplan = data;
             
            //});
            $http.get(coreapi + 'PersonalInfo?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.personalInfo = data;
                
            });
            $http.get(coreapi + 'SubordinateInfo?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.subordinateInfo = data;

            });
       
            //    HttpErrorService.getStatus(status, data);
            //});
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


                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].id, text: $scope.categorylist[i].drpdisplay });

                }
            });

         
            $rootScope.openModalForm('#modal-panel-addgoalplan');
        };

        //Open Add Action Modal
        $scope.OpenAddActionModal = function () {
            $scope.actiondesc = '';
            var dateend = moment().endOf('year').format();
            $scope.actiontargetdate = new Date($filter('date')(new Date(dateend), "yyyy-MM-dd"));

            self.title = "Add Action Plan";
            $rootScope.openModalForm('#modal-panel-addactionplan');
        };

        //Open Update Action Modal
        $scope.OpenUpdateActionModal = function () {

            self.title = "Update Action Plan";
            $rootScope.openModalForm('#modal-panel-updateactionplan');
        };


        //Open Close Action Modal
        $scope.OpenCloseActionModal = function () {

            self.title = "Close Action Plan";
            $rootScope.openModalForm('#modal-panel-closeactionplan');
        };

    

        //Get All Action Plan
        $scope.GetAllActionPlan = function (goalplanList) {
            $scope.goalId = goalplanList.goalId;
            $scope.goaldesc = goalplanList.goaldescription;
            $scope.createby = goalplanList.createby;
            $scope.createdate = goalplanList.createdate;

           // $scope.employeeId = goalplanList.employeeId;
            $http.get(coreapi + 'GetAllActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                $scope.cdpactionplan = data;
           
            });
        };

        //Get Action Plan
        $scope.GetActionPlan = function (actionplanList) {
            $scope.actionId = actionplanList.actionId;
            $scope.actiondesc = actionplanList.actiondescription;
            $scope.targetdate = actionplanList.targetdate;
            $scope.goalId = actionplanList.goalId;
            $scope.currentcomment = actionplanList.comment;
            $scope.lastcomment = actionplanList.comment + '\n'; 
            $scope.datecreated = actionplanList.createdate;
            //$rootScope.openModalForm('#modal-panel-updateactionplan');
        };


        //Get Goal Plan
        $scope.GetGoalPlan = function (categoryList) {
            $scope.cdpgoalplan = categoryList;
        };





        //Get Subordinate CDP
        $scope.ViewCdpSubordinate = function (subordinateinfoList) {
            $scope.employeeId = subordinateinfoList.employeeId;
            

            $http.get(coreapi + 'CareerDevelopment?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                $scope.cdplist = data;
                $scope.type = 2;
                //$scope.showCdp = true;
                });
            //$rootScope.openModalForm('#modal-panel-viewcdp');

            $rootScope.openModalForm('#modal-panel-viewcdp');
        };
        //Get Personal CDP
        $scope.ViewCdpPersonal = function (personalinfoList) {
            $scope.employeeId = empId;
            $http.get(coreapi + 'CareerDevelopment?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.cdplist = data;
                $scope.type = 1;
                //$scope.showCdp = true;
               });
           // $rootScope.openModalForm('#modal-panel-viewcdp');
            $rootScope.openModalForm('#modal-panel-viewcdp');
        };

        //Update  CDP per Year
        $scope.UpdateCdpperyear = function (cdList) {
            $state.go('pms-cd-goalaction-plan', { 'em': $scope.employeeId, 'type': $scope.type, 'action': 'edit', 'cdpId':cdList.cdpid });
        };

        //Get  CDP per Year
        $scope.ViewCdpperyear = function (cdList) {
            $state.go('pms-cd-goalaction-plan', { 'em': $scope.employeeId, 'type': $scope.type, 'action': 'view', 'cdpId': cdList.cdpid });
        };


        self.clearGoalPlan = function () {
            $scope.goaldesc = '';
            $scope.actiondesc = '';
            $scope.actiontargetdate = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
        };

       
        //Add  CDP
        $scope.AddCDP = function () {    
            $state.go('pms-cd-goalaction-plan', { 'em': $scope.employeeId, 'type': 1, 'action': 'new', 'cdpId':0 });
        };

        ////Add Personal CDP
        //$scope.AddPersonalCDP = function () {
        //    $state.go('pms-cd-goalaction-plan', { 'em': $scope.employeeId, 'type': 1, 'action': 'new', 'cdpId':0 });

        //};
        //Add All Subordiante CDP
        $scope.AddAllSubordinateCDP = function () {
            $state.go('pms-cd-goalaction-plan', { 'em': '', 'type': 2, 'action': 'new', 'cdpId': 0  });
        };
    
        //Add Goal Plan
        $scope.AddGoalPlan = function () {
            var cdpgoal = {
                goaldescription: $scope.goaldesc,
                employeeid: $scope.employeeId,
                categoryid: $scope.categoryId,
                status: 'O',
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'GoalPlan', cdpgoal).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.goaldesc = '';
                    $scope.goalId = '';
                    Notification.success('Save Goal Completed');
                });
                //$http.get(coreapi + 'GetLastGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
                //    $scope.goalId = data[0].goalId;

                //});

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });



            $scope.shownewGoal = true;
            $scope.showaddGoal = false;
        };

        //Add Action Plan
        $scope.AddActionPlan = function () {
            var cdpaction = {
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                targetdate: new Date($filter('date')(new Date($scope.actiontargetdate), "yyyy-MM-dd")),               
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'ActionPlan', cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.actiondesc = '';
                    var dateend = moment().endOf('year').format();
                    $scope.actiontargetdate = new Date($filter('date')(new Date(dateend), "yyyy-MM-dd"));
                    Notification.success('Save Action Completed');
                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
            $scope.ishasGoal = true;
        };

        //Update Action Plan
        $scope.UpdateActionPlan = function () {

            var comment = '';
            if ($scope.currentcomment === null) {
                comment = '*' + $scope.comment;
            } else {
                comment = $scope.lastcomment + '*' +  $scope.comment;
            }

            var cdpaction = {
                actionid: $scope.actionId,
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                comment: comment,
                targetdate: $scope.targetdate,
                modifiedby: empFullName,
                modifieddate: $scope.modifydate,
                createby: empFullName,
                createdate: $scope.datecreated
            };
            $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
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

            var comment = '';
            if ($scope.currentcomment === null) {
                comment = '*' + 'Completed';
            } else {
                comment = $scope.lastcomment + '*' + 'Completed';
            }

            var cdpaction = {
                actionid: $scope.actionId,
                actiondescription: $scope.actiondesc,
                goalid: $scope.goalId,
                iscompleted: 1,
                completedate: $scope.completedate,
                comment: comment,
                targetdate: $scope.targetdate,
                modifiedby: empFullName,
                modifieddate: $scope.modifydate,
                createby: empFullName,
                createdate: $scope.datecreated
            };
            $http.put(coreapi + 'ActionPlan/' + cdpaction.actionid, cdpaction).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenCategory?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                    $scope.category = data;
                    $scope.comment = '';

                   
                });


            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });

            

        };

        //Update Goal Plan
        $scope.UpdateGoalPlan = function () {
            $http.get(coreapi + 'GetAllOpenActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                $scope.cdpactionplanopen = data;
                if ($scope.cdpactionplanopen.length === 0) {

                    var cdpgoal = {
                        goalid: $scope.goalId,
                        goaldescription: $scope.goaldesc,
                        employeeid: $scope.employeeId,
                        status: 'C',
                        isachieved: 1,
                        achievedate: $scope.modifydate,
                        createby: empFullName,
                        createdate: datecreated
                    };
                    $http.put(coreapi + 'GoalPlan/' + cdpgoal.goalid, cdpgoal).success(function (data, status, headers, config) {
                        $http.get(coreapi + 'GetAllOpenCategory?employeeId=' + $scope.employeeId).success(function (data, status, headers, config) {
                            $scope.category = data;
                          


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

        //Change in Category
        $scope.ChangeCategoryDropdown = function () {
            for (var i = 0; i < $scope.categorylist.length; i++) {
                var categoryId = $scope.categorylist[i].id;
                if (parseInt($scope.categoryId) === categoryId) {
                    $scope.categoryId = $scope.categorylist[i].id;
                    break;
                }
            }
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

        }
      


    

    }
]);





