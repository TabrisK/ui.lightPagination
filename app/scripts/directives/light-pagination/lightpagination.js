'use strict';

/**
 * @ngdoc directive
 * @name docthospitalApp.directive:lightPagination
 * @description
 * # lightPagination
 */
angular.module('ui.lightPagination', [])
    .directive('lightPagination', function ($parse, $log, $timeout) {
        return {
            templateUrl: 'scripts/directives/light-pagination/lightpagination.html',
            restrict: 'E',
            scope: {
                conf: "=",
                totalData: "=",
                setting: "=",
                serverQuery: "&"
            },
            link: function postLink(scope, element, attrs) {
                var subDataGetter, settingGetter;

                subDataGetter = $parse(attrs["subData"]);
                settingGetter = $parse(attrs["setting"]);
                //totalDataGetter = $parse(attrs['totalData']);

                scope.totalItems = 0; //总条数
                scope.currentPage = 1; //当前页
                scope.maxSize = 5; //最多可见几页
                scope.itemsPerPage = 10; //每页显示几条

                if (scope.conf.noPagination) scope.itemsPerPage = -1;


                if (attrs["setting"] != undefined && scope.setting != undefined) {

                    if (scope.setting.page != undefined && scope.setting.row != undefined) {
                        scope.currentPage = scope.setting.page;
                        scope.itemsPerPage = scope.setting.row;
                    } else {
                        settingGetter.assign(scope.$parent, {
                            page: scope.currentPage,
                            row: scope.itemsPerPage
                        });
                    }

                }

                scope.setPage = function (pageNo) {
                    scope.currentPage = pageNo;
                };

                scope.$watch("itemsPerPage", function (newVal, oldVal) {
                    console.log(newVal);
                }, true);

                scope.pageChanged = function (itemsPerPage) {
                    scope.itemsPerPage = itemsPerPage;
                    settingGetter.assign(scope.$parent, {
                        page: scope.currentPage,
                        row: scope.itemsPerPage == -1 ? 99999 : scope.itemsPerPage,
                    });
                    if (scope.conf.serverSide) {
                        if (attrs["serverQuery"] && scope.serverQuery != undefined) {
                            $timeout(
                                function () {
                                    return scope.$apply(scope.serverQuery())
                                },
                                0
                            );
                        } else {
                            console.log("没有定义请求新数据方法。请在标签中添加server-query='请求方法()'");
                        }
                    } else {
                        refreshSubData(scope.conf.serverSide)
                    }
                };

                scope.$watchCollection("totalData", function () {
                    console.log(scope.totalData);
                    if (attrs["totalData"] && scope.totalData != undefined) {
                        scope.conf.serverSide == false ?
                            (scope.totalItems = scope.totalData.length) :
                            (scope.totalItems = scope.totalData.count);
                        refreshSubData(scope.conf.serverSide);
                    }
                });

                //the first table update start
                refreshSubData(scope.conf.serverSide);
                //the first table update end

                function refreshSubData(isServerSide) {
                    var tempSub = [],
                        i = 0;
                    if (attrs["totalData"] && scope.totalData != undefined) {
                        if (isServerSide) { //服务器端分页
                            tempSub = scope.totalData.message;
                            if (typeof (tempSub) == "string") return;

                            var targetIndex = (scope.currentPage - 1) * scope.itemsPerPage + 1;
                            if (scope.totalData.message != undefined) {

                                for (; i < scope.totalData.message.length; i++) { //每页显示不是全部则按每页几条显示
                                    tempSub[i].sort = targetIndex + i;
                                }

                            }

                            subDataGetter.assign(scope.$parent, tempSub);

                        } else { //前端分页
                            if (scope.itemsPerPage == -1) { //用户选择了全部显示则全部显示
                                for (; i < scope.totalItems; i++) { //每页显示不是全部则按每页几条显示
                                    tempSub.push($.extend(true, scope.totalData[i], {
                                        sort: i + 1
                                    }));
                                }
                            } else {
                                for (; i < scope.itemsPerPage; i++) { //每页显示不是全部则按每页几条显示
                                    var targetIndex = (scope.currentPage - 1) * scope.itemsPerPage + i;
                                    if (scope.totalData[targetIndex] != undefined)
                                        tempSub.push($.extend(true, scope.totalData[targetIndex], {
                                            sort: targetIndex + 1
                                        }));
                                }
                            }
                            subDataGetter.assign(scope.$parent, tempSub);
                        }
                    }
                }
            }
        };
    })
    .directive('convertToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (val) {
                    return val ? parseInt(val, 10) : null;
                });
                ngModel.$formatters.push(function (val) {
                    return val ? '' + val : null;
                });
            }
        };
    });