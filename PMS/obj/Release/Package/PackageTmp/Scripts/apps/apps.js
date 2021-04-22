//'use strict';
var app = angular.module('apps',
    ['ui.router',
    'ng-context-menu',
    'ui.bootstrap',
    'rjg.cookie',
    'apps.global',
    'ngFileUpload',
    'angularUtils.directives.dirPagination',
    'ncy-angular-breadcrumb',
    'ui-notification',
    'apps.config',
    'LocalForageModule',
    'blockUI',
    'AxelSoft'])

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json' };
        $httpProvider.defaults.headers.put = { 'Content-Type': 'application/json' };
        $httpProvider.defaults.headers.patch = {};
        $httpProvider.defaults.headers.get = {};

        //add global token
        $httpProvider.interceptors.push(function ($q, $AspCookie) {
            return {
                'request': function (config) {

                    config.headers['Token'] = $AspCookie.get('_214', 'token');
                    return config;
                }
            };
        });
    }])
 .config(['NotificationProvider',function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    }])

.run(['$rootScope', '$AspCookie', '$http', 'filterFilter', '$state', '$stateParams','HttpErrorService',
function ($rootScope, $AspCookie, $http, filterFilter, $state, $stateParams, HttpErrorService) {
    var userId = $AspCookie.get('_214', 'empId');



    $rootScope.userFirstName = $AspCookie.get('_214', 'fname');
   
    $rootScope.userMenuList = {};
    $rootScope.userID;
    $rootScope.userEmail;
    $rootScope.siteOption;
    $rootScope.appClass = "messages-page";
    $rootScope.totalMsgCount = 0;
 
    $rootScope.StatusCount = [];

    $rootScope.onGetApplicatinDtl=function(){
        $http.get(coreapi +'application/get-apps-details/2').success(function (response, status, headers, config) {

            $rootScope.applicationDtl = response.sysdescription;

        }).error(function (data, status, headers, config) {
            HttpErrorService.getStatus(status, data);
        });
    }

    //logout function
    $rootScope.onSignOut = function () {
      
        window.location.replace('/account/Logout');//response redirect to logout page
    };



    $rootScope.onReleaseNote = function () {
        $state.go('releasenotes');
    }

    /*
   @p1 modal id
   @p2 msg prompt
   */
    $rootScope.ShowPrompt = function (p1,p2) {
        $rootScope.openModalForm(p1);
        $rootScope.msgPrompt = p2;
    }

    //open modal form
    //panel:element ID
    $rootScope.openModalForm = function (panel) {
        $rootScope.isError = false;
       
        openModalPanel(panel);
      
    }

    //close modal form
    $rootScope.closeModalForm = function () {
        jQuery.magnificPopup.close();
        $rootScope.isError = false;
    }

    //export table  to excel
    $rootScope.exportDataToExcel = function () {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };


    //close prompt panel
    $rootScope.onClosePrompt = function () {
        $rootScope.isSuccess = false;
        $rootScope.isError = false;
    };

    $rootScope.onGetAlias = function () {
        $http.get(coreapi +'account/getAlias/' + $AspCookie.get('_214', 'userid')).success(function (response, status, headers, config) {
            $rootScope.alias = response.alias;
        }).error(function (data, status, headers, config) {
            HttpErrorService.getStatus(status, data);
        });
    }

    $rootScope.onSetAlias = function () {
        $http.get(coreapi +'account/setAlias/?id=' + $AspCookie.get('_214', 'userid') + '&alias=' + $rootScope.alias).success(function (response, status, headers, config) {
            $rootScope.isEditAlias = response.hasError;
        }).error(function (data, status, headers, config) {
            HttpErrorService.getStatus(status, data);
        });
    }

    /*initialize access module*/
    $rootScope.onInitMenu = function (p) {
        var userId = $AspCookie.get('_214', 'userid')
        var params = p + ',' + userId;

        $http.get(coreapi +'user/get-user-menu-list/' + params).success(function (data, status, headers, config) {
            $rootScope.canAdd = data.canadd;
            $rootScope.canEdit = data.canedit;
            $rootScope.canDelete = data.candelete;
        }).error(function (data, status, headers, config) {
            HttpErrorService.getStatus(status, data);
        });
    };

    //select attachment to be upload
    $rootScope.onAttachment = function () {
        alert('Coming soon');
    }

    //redirect to about
    $rootScope.onAbout = function () {
        $state.go('about');
    }

    $rootScope.onGetApplicatinDtl();

    //check if user is login
    if (userId == "" || userId == undefined) {
        $rootScope.onSignOut();
    }


 

}]);











