'use strict';

/**
 * @ngdoc demoService
 * @name uilightPaginationApp.demo
 * @description
 * # demo
 * Service in the uilightPaginationApp.
 */
angular.module('uilightPaginationApp')
    .service('demoService', function ($timeout) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return {
            getData: function () {
                return $timeout(function () {
                    return [
                        {
                            name: "Stark",
                            city: "NorthLand",
                            job: "King of the North"
                        },
                        {
                            name: "Bratheon",
                            city: "King's Landing",
                            job: "King of the seven kingdom"
                        },
                        {
                            name: "Lannister",
                            city: "King's landing",
                            job: "Queen"
                        },
                        {
                            name: "Tyrell",
                            city: "Highgarden",
                            job: "Protector of the south"
                        },
                        {
                            name: "Targaryen",
                            city: "Meereen",
                            job: "Mother of Dragons"
                        },
                        {
                            name: "Martell",
                            city: "Sunspear",
                            job: "King of the seven Doerne"
                        }
                           ]
                }, 1000);
            }
        }
    });