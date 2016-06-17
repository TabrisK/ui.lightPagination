'use strict';

/**
 * @ngdoc function
 * @name uilightPaginationApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uilightPaginationApp
 */
angular.module('uilightPaginationApp')
  .controller('MainCtrl', function ($scope, demoService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    
    $scope.List = {
        conf: {
            serverSide: false
        },
        totalList: [],
        loadData: function () {
            demoService.getData().then(
                function (res) {
                    $scope.List.totalList = res; //非serverSide直接返回Array
                },
                function (err) {
                }
            );
        },
        setting: {
            page: 1,
            row: 5
        },
        refresh: function () {
            $scope.List.totalList = undefined; //清空
            $scope.List.loadData(); //重新请求
        }
    }
    
    $scope.List.refresh();
    
  });
