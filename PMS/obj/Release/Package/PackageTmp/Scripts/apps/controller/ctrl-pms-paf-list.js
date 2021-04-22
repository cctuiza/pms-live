var app = angular.module('apps');
//paf list for Main kpi
app.controller('pms.paflist', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie','filterFilter','HttpErrorService','GlobalHelper',
                    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, HttpErrorService, GlobalHelper) {
                                         
                        $("#toTopHover").trigger("click");

                                         $scope.onInit = function () {
                                             var UserID = $AspCookie.get('_214', 'empId');
                                             $http.get(coreapi +'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
                                                 if (!data.hasError) {
                                                     $scope.msgInvalid = false;
                                                     $scope.pafMaster = data.data;
                                                 }
                                                 else {
                                                     $scope.msgInvalid = true;
                                                     $scope.errorMsg = data.errorMessage
                                                 }

                                             }).error(function (data, status, headers, config) {
                                                 HttpErrorService.getStatus(status, data);
                                             });
                                         };


                                         $scope.hasOpenPaf = function (param) {
                                             if (filterFilter(param, { Status: "O" }).length > 0) {
                                                 return true;
                                             }
                                             else {
                                                 return false;
                                             }
                                         }


                                         $scope.OpenPAF = function (p) {
                                             $scope.tempEmpId = p;
                                             GlobalHelper.StartSpin();
                                             $http.get(coreapi + 'pms/get-paf/' + p).
                                                 success(function (response, status, headers, config) {
                                                     if (!response.hasError) {
                                                         $scope.paflist = response.data;
                                                         $rootScope.openModalForm('#modal-panel-paflist');
                                                     } else {
                                                         $scope.msg("Error", response.error_message, 2);
                                                     }
                                                 }).
                                                 error(function (data, status, headers, config) {
                                                     HttpErrorService.getStatus(status, data);
                                                 });

                                             GlobalHelper.StopSpin();

                                         };

                                         $scope.onCheckOpenPaf = function (p) {
                                                
                                             if (filterFilter(p, { Status: 'O' }).length > 0) {
                                                 return true;
                                             } else {
                                                 return false;
                                             }
                                         }

                                         $scope.onCheckClosePaf = function (p) {

                                             if (filterFilter(p, { Status: 'C' }).length > 0) {
                                                 return true;
                                             } else {
                                                 return false;
                                             }
                                         }

                                         $scope.onViewClosePAFHistory = function (p) {
                                             $state.go('paf-view-closed-setup', { pano: p });
                                             $rootScope.closeModalForm();
                                         }

                                         $scope.onViewClosePaf = function (p, itype) {
                                             $scope.panoList = p.pmsPafMaster;
                                             $rootScope.openModalForm('#modal-panel-paflist');
                                             switch (itype) {

                                                 case 2:
                                                     $scope.isEdit = p.pmsPafMaster[0].Status == 'C' ? false : true;
                                                     $scope.isdelete = p.pmsPafMaster[0].Status == 'C' ? false : true;
                                                     $scope.isview = true;
                                                     break;
                                                 case 3:
                                                     $scope.isEdit = p.pmsPafMaster[0].isEdit;
                                                     $scope.isdelete = false;
                                                     $scope.isview = true;
                                                     break;
                                             }
                                         }


                                         //edit pano
                                         $scope.onEditPano = function (p1, p2, p3) {
                                             if (p2 === "C") {
                                                 $scope.stopnote = "Enable to edit this paf is already 'CLOSE'";
                                             } else {
                                                 $scope.stopnote = "";
                                                 $state.go('paf-setup-edit', { 'pano': p1, 'pafid': p3});
                                                 $rootScope.closeModalForm();
                                             }
                                         };

                                         //override
                                         $scope.onOverride = function (p1, p2) {
                                           
                                                 $state.go('paf-setup-override', { 'pano': p1 });
                                                 $rootScope.closeModalForm();
                                             
                                         }


                                         $scope.hasOpen = function (p) {
                                             var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' }).length;
                                             if (PafDtl > 0) {
                                                 return true;
                                             } else {
                                                 return false;
                                             }
                                         }

                                        $scope.onClose = function (p) {
                                            console.log(p);
                                            $scope.tempEmpId = p;
                                            GlobalHelper.StartSpin();
                                            $http.get(coreapi + 'pms/get-paf/' + p).
                                                success(function (response, status, headers, config) {
                                                    if (!response.hasError) {
                                                        $scope.paflist = response.data;
                                                        $rootScope.openModalForm('#modal-panel-paflist');
                                                    } else {
                                                        $scope.msg("Error", response.error_message, 2);
                                                    }
                                                }).
                                                error(function (data, status, headers, config) {
                                                    HttpErrorService.getStatus(status, data);
                                                });

                                            GlobalHelper.StopSpin();
                                         }

                                        $scope.viewForClosePaf = function (p1, p2) {
                                            $state.go('closing-setup', { 'empId':p1, 'hashcode': p2 });
                                            $rootScope.closeModalForm();
                                        }
                                         
                                         $scope.onOpenOveridePaf = function (p) {
                                             $scope.panoList = p.pmsPafMaster;
                                             $rootScope.openModalForm('#modal-panel-override-paflist');
                                             console.log(p.pmsPafMaster);
                                             //var p1 = filterFilter(p.pmsPafMaster, { Status: 'O' })[0].hashcode;
                                             //$state.go('paf-setup-override', { 'pano': p1 });
                                         }
                                         

                                         //view pano
                                         $scope.onViewPano = function (p1, p2) {                                     
                                                 $scope.stopnote = "";
                                                 $state.go('paf-setup-view', { 'pano': p1 });
                                                 $rootScope.closeModalForm();
                                         };

                                   
                                         $scope.onNewPaf = function (val) {
                                             $rootScope.closeModalForm();
                                             $state.go('paf-setup-new', { 'pano': '', 'em': val, 'md':'nw' });
                                         }

                                         $scope.cancel = function () {
                                             $scope.modalInstance.dismiss();
                                         };

                                         $scope.onType = function (p) {

                                             switch (p) {
                                                 case 1:
                                                     return 'Personal Info';
                                                     break;
                                                 case 2:
                                                     return 'Subordinate Info';
                                                     break;
                                                 case 3:
                                                     return 'User Access';
                                                     break
                                             }
                                         };

                                         $scope.onViewDetails = function (p) {
                                             if (p.length != 0) {
                                                 return true;
                                             }
                                             else {
                                                 return false;
                                             }
                                         };


    }])

//paf list for sub kpi
app.controller('pms.paflist-subkpi', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, HttpErrorService, GlobalHelper) {

        $("#toTopHover").trigger("click");

        $scope.onInit = function () {
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
                if (!data.hasError) {
                    $scope.msgInvalid = false;
                    $scope.pafMaster = data.data;
                }
                else {
                    $scope.msgInvalid = true;
                    $scope.errorMsg = data.errorMessage
                }

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
        };

        $scope.onManage = function (val) {
            $state.go('sub-kpi-setup', { id: val });
            $rootScope.closeModalForm();
        }

        $scope.hasOpenPaf = function (param) {
            if (filterFilter(param, { Status: "O" }).length > 0) {
                return true;
            }
            else {
                return false;
            }
        }


        $scope.OpenPAF = function (p) {
            $scope.tempEmpId = p;
            GlobalHelper.StartSpin();
            $http.get(coreapi + 'pms/get-paf/' + p).
                success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        $scope.paflist = response.data;
                        $rootScope.openModalForm('#modal-panel-paflist');
                    } else {
                        $scope.msg("Error", response.error_message, 2);
                    }
                }).
                error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });

            GlobalHelper.StopSpin();

        };

        $scope.onNewPaf = function (val) {
            console.log('test');
            $rootScope.closeModalForm();
            $state.go('paf-setup-new', { 'pano': '', 'em': val, 'md': 'nw' });
        }

        $scope.onCheckOpenPaf = function (p) {

            if (filterFilter(p, { Status: 'O' }).length > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onCheckClosePaf = function (p) {

            if (filterFilter(p, { Status: 'C' }).length > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onViewClosePAFHistory = function (p) {
            $state.go('paf-view-closed-setup', { pano: p });
            $rootScope.closeModalForm();
        }

        $scope.onViewClosePaf = function (p, itype) {
            $scope.panoList = p.pmsPafMaster;
            $rootScope.openModalForm('#modal-panel-paflist');
            switch (itype) {

                case 2:
                    $scope.isEdit = p.pmsPafMaster[0].Status == 'C' ? false : true;
                    $scope.isdelete = p.pmsPafMaster[0].Status == 'C' ? false : true;
                    $scope.isview = true;
                    break;
                case 3:
                    $scope.isEdit = p.pmsPafMaster[0].isEdit;
                    $scope.isdelete = false;
                    $scope.isview = true;
                    break;
            }
        }


    

        $scope.hasOpen = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' }).length;
            if (PafDtl > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onClose = function (p) {
            console.log(p);
            $scope.tempEmpId = p;
            GlobalHelper.StartSpin();
            $http.get(coreapi + 'pms/get-paf/' + p).
                success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        $scope.paflist = response.data;
                        console.log($scope.paflist);
                        $rootScope.openModalForm('#modal-panel-paflist');
                    } else {
                        $scope.msg("Error", response.error_message, 2);
                    }
                }).
                error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });

            GlobalHelper.StopSpin();
        }

        $scope.onOpenOveridePaf = function (p) {
            var p1 = filterFilter(p.pmsPafMaster, { Status: 'O' })[0].hashcode;
            $state.go('paf-setup-override', { 'pano': p1 });


        }



        $scope.cancel = function () {
            $scope.modalInstance.dismiss();
        };

        $scope.onType = function (p) {

            switch (p) {
                case 1:
                    return 'Personal Info';
                    break;
                case 2:
                    return 'Subordinate Info';
                    break;
                case 3:
                    return 'User Access';
                    break
            }
        };

        $scope.onViewDetails = function (p) {
            if (p.length != 0) {
                return true;
            }
            else {
                return false;
            }
        };


    }])

// paf list for record performance
app.controller('pms.paflist-record-performance', ['$scope', '$stateParams', '$state', '$http', '$rootScope', '$filter', '$AspCookie', 'filterFilter', 'HttpErrorService', 'GlobalHelper',
    function ($scope, $stateParams, $state, $http, $rootScope, $filter, $AspCookie, filterFilter, HttpErrorService, GlobalHelper) {

        $("#toTopHover").trigger("click");

        $scope.onInit = function () {
            var UserID = $AspCookie.get('_214', 'empId');
            $http.get(coreapi + 'pms/getPafMaster/' + UserID).success(function (data, status, headers, config) {
                if (!data.hasError) {
                    $scope.msgInvalid = false;
                    $scope.pafMaster = data.data;
                }
                else {
                    $scope.msgInvalid = true;
                    $scope.errorMsg = data.errorMessage
                }

            }).error(function (data, status, headers, config) {
                HttpErrorService.getStatus(status, data);
            });
        };

        $scope.onRate = function (val) {
            $state.go('paf-rate-entry', { id: val });
            $rootScope.closeModalForm();
        }

        $scope.hasOpenPaf = function (param) {
            if (filterFilter(param, { Status: "O" }).length > 0) {
                return true;
            }
            else {
                return false;
            }
        }


        $scope.OpenPAF = function (p) {
            $scope.tempEmpId = p;
            GlobalHelper.StartSpin();
            $http.get(coreapi + 'pms/get-paf/' + p).
                success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        $scope.paflist = response.data;
                        $rootScope.openModalForm('#modal-panel-paflist');
                    } else {
                        $scope.msg("Error", response.error_message, 2);
                    }
                }).
                error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });

            GlobalHelper.StopSpin();

        };

        $scope.onCheckOpenPaf = function (p) {

            if (filterFilter(p, { Status: 'O' }).length > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onCheckClosePaf = function (p) {

            if (filterFilter(p, { Status: 'C' }).length > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onViewClosePAFHistory = function (p) {
            $state.go('paf-view-closed-setup', { pano: p });
            $rootScope.closeModalForm();
        }

        $scope.onViewClosePaf = function (p, itype) {
            $scope.panoList = p.pmsPafMaster;
            $rootScope.openModalForm('#modal-panel-paflist');
            switch (itype) {

                case 2:
                    $scope.isEdit = p.pmsPafMaster[0].Status == 'C' ? false : true;
                    $scope.isdelete = p.pmsPafMaster[0].Status == 'C' ? false : true;
                    $scope.isview = true;
                    break;
                case 3:
                    $scope.isEdit = p.pmsPafMaster[0].isEdit;
                    $scope.isdelete = false;
                    $scope.isview = true;
                    break;
            }
        }


        //edit pano
        $scope.onEditPano = function (p1, p2) {
            if (p2 === "C") {
                $scope.stopnote = "Enable to edit this paf is already 'CLOSE'";
            } else {
                $scope.stopnote = "";
                $state.go('paf-setup-edit', { 'pano': p1 });
                $rootScope.closeModalForm();
            }
        };

        //override
        $scope.onOverride = function (p1, p2) {

            $state.go('paf-setup-override', { 'pano': p1 });
            $rootScope.closeModalForm();

        }


        $scope.hasOpen = function (p) {
            var PafDtl = filterFilter(p.pmsPafMaster, { Status: 'O' }).length;
            if (PafDtl > 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.onClose = function (p) {
            console.log(p);
            $scope.tempEmpId = p;
            GlobalHelper.StartSpin();
            $http.get(coreapi + 'pms/get-paf/' + p).
                success(function (response, status, headers, config) {
                    if (!response.hasError) {
                        $scope.paflist = response.data;
                        $rootScope.openModalForm('#modal-panel-paflist');
                    } else {
                        $scope.msg("Error", response.error_message, 2);
                    }
                }).
                error(function (data, status, headers, config) {
                    HttpErrorService.getStatus(status, data);
                });

            GlobalHelper.StopSpin();
        }

        $scope.onOpenOveridePaf = function (p) {
            var p1 = filterfilter(p.pmspafmaster, { status: 'o' })[0].hashcode;
            $state.go('modal-panel-override-paflis', { 'pano': p1 });


        }


        //view pano
        $scope.onViewPano = function (p1, p2) {
            $scope.stopnote = "";
            $state.go('paf-setup-view', { 'pano': p1 });
            $rootScope.closeModalForm();
        };


        $scope.onNewPaf = function (val) {
            $rootScope.closeModalForm();
            $state.go('paf-setup-new', { 'pano': '', 'em': val, 'md': 'nw' });
        }

        $scope.cancel = function () {
            $scope.modalInstance.dismiss();
        };

        $scope.onType = function (p) {

            switch (p) {
                case 1:
                    return 'Personal Info';
                    break;
                case 2:
                    return 'Subordinate Info';
                    break;
                case 3:
                    return 'User Access';
                    break
            }
        };

        $scope.onViewDetails = function (p) {
            if (p.length != 0) {
                return true;
            }
            else {
                return false;
            }
        };
        $scope.Export = function () {
            $("#subordinate").table2excel({
                filename: "PmsUtilization.xls"
            });
        };

    }]);




