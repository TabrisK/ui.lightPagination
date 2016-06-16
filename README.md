# ui.lightPagination
ui.lightPagination使用向导

#依赖
1、angular。版本必须高于1.3.x;<br>
2、ui.bootstrap.pagination模块。这是一个经过angular封装的bootstrap组件,你可以从<a href="https://angular-ui.github.io/bootstrap/#/pagination">这里</a>或者本工程中得到该模块;

#angular主模块中添加相关module
```javascript
angular.module("demo", ["ui.bootstrap","ui.lightPagination"]);//ui.bootstrap中应当包含pagination模块
```

#基本配置

###前台动态分页
```html
<light-pagination total-data="List.totalList" sub-data="subList" conf="List.conf" setting="List.setting"></light-pagination>
```

在相关controller中的List对象配置
```javascript
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
```

###后台动态分页
```html
<light-pagination total-data="List.totalList" sub-data="subList" conf="List.conf" setting="List.setting" server-query="List.refresh()"></light-pagination>
```

```javascript
$scope.List = {
    conf: {
        serverSide: true
    },
    totalList: [],
    loadData: function (currentPage, itemsPerPage) {
        $scope.queryData.rows = itemsPerPage; //当前每页条数
        $scope.queryData.page = currentPage; //当前页数
        service.getData($scope.queryData).then(
            function (res) {
                $scope.countNum = res.data.code;
                $scope.List.setting.count = res.data.count;
                $scope.List.totalList = res.data; //非serverSide直接返回Array
                toastr.success("刷新成功！");
            },
            function (err) {
                toastr.error("加载数据失败!");
            }
        );

    },
    setting: {
        page: 1,
        row: 10,
    },
    refresh: function () {
        $scope.List.totalList = undefined; //清空
        $scope.List.loadData($scope.List.setting.page, $scope.List.setting.row); //重新请求
    }
}
```

#Options

###conf
####noPagination
####serverSide