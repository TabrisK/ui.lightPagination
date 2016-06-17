# ui.lightPagination
ui.lightPagination使用向导

#依赖
1、angular。版本必须高于1.3.x;<br>
2、ui.bootstrap.pagination模块。这是一个经过angular封装的bootstrap组件,你可以从<a href="https://angular-ui.github.io/bootstrap/#/pagination">这里</a>或者本工程中得到该模块;<br>


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

#attribute

###total-data
必填。请求返回得到的所有数据。如果是前端分页则直接把一个包含所有数据的数组传入即可；如果是后台分页则要求返回的数据必须满足以下结构再传入，该分页插件才能正常工作。
```javascript
//共130条数据，每页10条，当前第4页
{
    count: 130,
    rows: 10,
    page: 4,
    message: [/*...第4页的10条数据在此...*/]
}
```

###sub-data
必填。在该属性中的对象将返回经过该分页插件切割得到的Array。例如配置为静态分页，当前为第3、每页5条数据，则sub-data将返回total-data数组中第10到底14条数据。

###conf
该属性对表格进行一些配置，以下是它的options
```javascript
{
    noPagination: false,//boolean。默认缺省(即false)，当为true时隐藏可切换每页几条的select
    serverSide: false//boolean。缺省时默认是前端分页(建议必填)
}
```

###setting
必填。该属性实时同步分页插件的一些属性，目前这些属性包括
```javascript
{
    page: currentPage,//同步当前第几页
    row: currentRowperPage//同步当前每页几条数据
}

PS:row目前只有5、10、15、30、50、-1(全部)几种可供选择
```
###server-query
必填（[conf](https://github.com/TabrisK/ui.lightPagination#conf).serverSide为true时）。该属性定义了当本插件的实例化对象发生page变化或row变化时调用的请求方法。
