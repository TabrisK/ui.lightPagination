$scope.List = {
    conf: {
        serverSide: false
    },
    totalList: [],
    loadData: function () {
        service.getData().then( //一个返回数据请求promise的serivce
            function (res) {
                $scope.List.totalList = res.data; //非serverSide直接返回Array
                toastr.success("刷新成功！");
            },
            function (err) {
                toastr.error("加载数据失败!");
            }
        );
    },
    refresh: function () {
        $scope.List.totalList = undefined; //清空
        $scope.List.loadData(); //重新请求
    }
}