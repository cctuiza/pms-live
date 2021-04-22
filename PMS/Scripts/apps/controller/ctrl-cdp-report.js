
app.constant("moment", moment);
app.controller('ctrlReport', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', 'filterFilter', '$AspCookie', 'HttpErrorService', 'GlobalHelper', 'Notification', '$localForage', '$timeout', '$window',
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
            $http.get(coreapi + 'PersonalInfo?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.personalInfo = data;


            });
            $http.get(coreapi + 'SubordinateInfo?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.subordinateInfo = data;

            });
       
            $http.get(coreapi + 'EmployeeSignature?employeeId=' + empId).success(function (data, status, headers, config) {
                $scope.signatureinfo = data;
                if ($scope.signatureinfo.length === 0) {
                    $scope.employeesignature = "";
                } else {
                    $scope.employeesignature = $scope.signatureinfo[0].empl_signature;
                    $scope.datecreated = new Date($filter('date')(new Date($scope.signatureinfo[0].createddate), "yyyy-MM-dd"));
                }
            });

            //    HttpErrorService.getStatus(status, data);
            //});


        };

        self.addImprovementPlan = function (param) {
            let newDate = new Date();
            self.actionPlan = {
                impplanId: 0,
                kpiId: param.kpiId,
                description: param.kpidescription,
                createdby: empFullName,
                createdate: newDate,
            };
            self.title = "Add Improvement Plan";
            $rootScope.openModalForm('#modal-panel-improvementplan-setup');
        }

        //Open Add Goal Modal
        $scope.OpenAddGoalModal = function () {
            $scope.actiondesc = '';
            $scope.actiontargetdate = '';
            $scope.goaldesc = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
            self.title = "Add Goal/Action Plan";
            $http.get(coreapi + 'DropdownMaster').success(function (data, status, headers, config) {
                $scope.categorylist = data;
                $scope.categoryId;
                $scope.categoryOptions = [];


                for (var i = 0; i < $scope.categorylist.length; i++) {
                    $scope.categoryOptions.push({ value: $scope.categorylist[i].drpdata, text: $scope.categorylist[i].drpdisplay });

                }
            });


            $rootScope.openModalForm('#modal-panel-addgoalplan');
        };

        //Open Add Action Modal
        $scope.OpenAddActionModal = function () {
            $scope.actiondesc = '';
            $scope.actiontargetdate = '';
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
            $scope.currentcomment = actionplanList.comment;
            $scope.lastcomment = actionplanList.comment + '\n';
            $scope.datecreated = actionplanList.createdate;

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

                //$scope.showCdp = true;
            });
            // $rootScope.openModalForm('#modal-panel-viewcdp');
            $rootScope.openModalForm('#modal-panel-viewcdp');
        };

        self.clearGoalPlan = function () {
            $scope.goaldesc = '';
            $scope.actiondesc = '';
            $scope.actiontargetdate = '';
            $scope.showaddGoal = true;
            $scope.shownewGoal = false;
            $scope.ishasGoal = false;
        };

        //Add Goal Plan
        $scope.AddGoalPlan = function () {
            var cdpgoal = {
                goaldescription: $scope.goaldesc,
                employeeid: empId,
                categoryid: $scope.categoryId,
                status: 'O',
                createby: empFullName,
                createdate: datecreated
            };
            $http.post(coreapi + 'GoalPlan', cdpgoal).success(function (data, status, headers, config) {
                $http.get(coreapi + 'GetAllOpenGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
                    $scope.cdpgoalplan = data;
                    Notification.success('Save Goal Completed');
                });
                $http.get(coreapi + 'GetLastGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
                    $scope.goalId = data[0].goalId;

                });

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
                $http.get(coreapi + 'GetAllActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                    $scope.cdpactionplan = data;
                    $scope.actiondesc = '';
                    $scope.actiontargetdate = '';
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
                comment = $scope.lastcomment + '*' + $scope.comment;
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
                $http.get(coreapi + 'GetAllActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                    $scope.cdpactionplan = data;
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
                comment = '*' + $scope.comment;
            } else {
                comment = $scope.lastcomment + '*' + $scope.comment;
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
                $http.get(coreapi + 'GetAllActionPlan?goalId=' + $scope.goalId).success(function (data, status, headers, config) {
                    $scope.cdpactionplan = data;

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
                if ($scope.cdpactionplanopen.length <= 0) {

                    var cdpgoal = {
                        goalid: $scope.goalId,
                        goaldescription: $scope.goaldesc,
                        employeeid: empId,
                        status: 'C',
                        isachieved: 1,
                        achievedate: $scope.modifydate,
                        createby: empFullName,
                        createdate: datecreated
                    };
                    $http.put(coreapi + 'GoalPlan/' + cdpgoal.goalid, cdpgoal).success(function (data, status, headers, config) {
                        $http.get(coreapi + 'GetAllOpenGoalPlan?employeeId=' + empId).success(function (data, status, headers, config) {
                            $scope.cdpgoalplan = data;




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

        //Capture Signature 
        $scope.CaptureSignature = function () {
            $scope.employeename = empFullName;
            $scope.employeeId = empId;
            var canvas = document.getElementById('signature-pad');
            canvas.width = 250;
            canvas.height = 140;
            canvas.addEventListener('mousedown', mouseDown, false);
            canvas.addEventListener('mousemove', mouseMove, false);
            canvas.addEventListener('mouseup', mouseUp, false);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';



            var started = false;
            var lastx = 0;
            var lasty = 0;

            // create an in-memory canvas
            var memCanvas = document.getElementById('signature-pad2');
            memCanvas.width = 250;
            memCanvas.height = 140;
            ctx.fillStyle = "#ffffff";
            var memCtx = memCanvas.getContext('2d');
            memCtx.fillStyle = "#ffffff";
            var points = [];

            function mouseDown(e) {
                var m = getMouse(e, canvas);
                points.push({
                    x: m.x,
                    y: m.y
                });
                started = true;
            };

            function mouseMove(e) {
                if (started) {
                    ctx.clearRect(0, 0, 250, 250);
                    // put back the saved content
                    ctx.drawImage(memCanvas, 0, 0);
                    var m = getMouse(e, canvas);
                    points.push({
                        x: m.x,
                        y: m.y
                    });
                    drawPoints(ctx, points);
                }
            };

            function mouseUp(e) {
                if (started) {
                    started = false;
                    // When the pen is done, save the resulting context
                    // to the in-memory canvas
                    memCtx.clearRect(0, 0, 250, 250);
                    memCtx.drawImage(canvas, 0, 0);
                    points = [];
                }
            };

            // clear both canvases!
            function clear() {
                context.clearRect(0, 0, 250, 250);
                memCtx.clearRect(0, 0, 250, 250);
            };




            function drawPoints(ctx, points) {
                // draw a basic circle instead
                if (points.length < 6) {
                    var b = points[0];
                    ctx.beginPath(), ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0), ctx.closePath(), ctx.fill();
                    return
                }
                ctx.beginPath(), ctx.moveTo(points[0].x, points[0].y);
                // draw a bunch of quadratics, using the average of two points as the control point
                for (i = 1; i < points.length - 2; i++) {
                    var c = (points[i].x + points[i + 1].x) / 2,
                        d = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, c, d)
                }
                ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y), ctx.stroke()
            }

            // Creates an object with x and y defined,
            // set to the mouse position relative to the state's canvas
            // If you wanna be super-correct this can be tricky,
            // we have to worry about padding and borders
            // takes an event and a reference to the canvas
            function getMouse(e, canvas) {
                var element = canvas, offsetX = 0, offsetY = 0, mx, my;

                // Compute the total offset. It's possible to cache this if you want
                if (element.offsetParent !== undefined) {
                    do {
                        offsetX += element.offsetLeft;
                        offsetY += element.offsetTop;
                    } while ((element = element.offsetParent));
                }

                mx = e.pageX - offsetX;
                my = e.pageY - offsetY;

                // We return a simple javascript object with x and y defined
                return { x: mx, y: my };
            }
        };



        //Save or Update Signature of Employee
        $scope.SaveSignature = function () {
            var canvassignature = document.getElementById('signature-pad2').toDataURL("image/png");
            canvassignature = canvassignature.replace('data:image/png;base64,', '');
            //$scope.employeesignature = canvassignature;
            var canvasempty = document.getElementById('signature-pad-empty').toDataURL("image/png");
            canvasempty = canvasempty.replace('data:image/png;base64,', '');
            if (canvassignature === canvasempty) {
                alert('It is blank');
            } else {
                if ($scope.employeesignature === "") {
                    var signatureinfos = {
                        empl_id: empId,
                        empl_picture: $scope.employeepicture,
                        empl_signature: canvassignature,
                        createdby: empId,
                        createddate: $scope.datecreated

                    };
                    $http.post(coreapi + 'EmployeeSignature', signatureinfos).success(function (data, status, headers, config) {
                        $http.get(coreapi + 'EmployeeSignature?employeeId=' + empId).success(function (data, status, headers, config) {
                            $scope.signatureinfo = data;
                            $scope.employeesignature = $scope.signatureinfo[0].empl_signature;
                        });
                    }).error(function (data, status, headers, config) {
                        HttpErrorService.getStatus(status, data);
                    });
                } else {
                    var signatureupdateinfo = {
                        empl_id: empId,
                        empl_picture: $scope.employeepicture,
                        empl_signature: canvassignature,
                        createdby: empId,
                        createddate: $scope.datecreated,
                        modifiedby: empId,
                        modifieddate: $scope.modifydate

                    };
                    $http.put(coreapi + 'EmployeeSignature/' + signatureupdateinfo.empl_id, signatureupdateinfo).success(function (data, status, headers, config) {
                        $http.get(coreapi + 'EmployeeSignature?employeeId=' + empId).success(function (data, status, headers, config) {
                            $scope.signatureinfo = data;
                            $scope.employeesignature = $scope.signatureinfo[0].empl_signature;
                        });
                    }).error(function (data, status, headers, config) {
                        HttpErrorService.getStatus(status, data);
                    });
                }


            }
            Notification.success('Save Successful');
        };





        $scope.ClearSignature = function () {

            var canvas = document.getElementById('signature-pad');

            canvas.clear();

        };



        //Export Report
        $scope.Export = function () {
            var pdfreports = document.getElementById('cdpreport');
            //html2canvas(pdfreports).then(function (canvas) {
            //    pdfreports.appendChild(canvas);
            //    var ctx = canvas.getContext('2d');
            //    var imgData = canvas.toDataURL("image/png", 1.0);
            //    var pdfwidth = canvas.width;
            //    var pdfheight = canvas.clientHeight;
            //    pdf.addImage(imgData, 'PNG', 20, 20, (pdfwidth - 10), (pdfheight));
            //    pdf.save('sample.pdf');

            //});

            var HTML_Width = $(".cdpreport").width();
            var HTML_Height = $(".cdpreport").height();
            var top_left_margin = 15;
            var PDF_Width = HTML_Width + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
            var canvas_image_width = HTML_Width;
            var canvas_image_height = HTML_Height;

            var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;


            html2canvas(pdfreports, { allowTaint: true }).then(function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 280;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var pdf = new jsPDF('l', 'mm', 'letter');
                var position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save("CDP of (" + $scope.employeename + ")" + ".pdf");
            });

        };



        //View CDP Report 
        $scope.ViewCdpReport = function (cdList) {
            $window.open('http://apps.fastlogistics.com.ph/pmsapi/' + 'ViewCDP/CdpReport/?cdpId=' + cdList.cdpid + '&&employeeId=' + cdList.employeeid);
        };

    }


    
]);





