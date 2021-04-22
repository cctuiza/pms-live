angular.module('rpt', [])
.controller('applicant.info.sheet', ['$scope', '$location', '$http', '$sce', function ($scope, $location, $http, $sce) {

    $scope.self = {}
    var searchObject = $location.search();

    $scope.onInit = function () {

      //  alert(searchObject.id);
        $http.get(coreapi +'applicant/GetApplicant/' + searchObject.id).success(function (data, status, headers, config) {
            $scope.self = data;

        }).error(function (data, status, headers, config) {
            console.log('Error: Init');
        });
    };

    $scope.onChannel = function (p1, p2) {
        if (p1 == p2) {
            return true;
        }
    };

    $scope.getAge = function (dateString) { // birthday is a date
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

 
}]);