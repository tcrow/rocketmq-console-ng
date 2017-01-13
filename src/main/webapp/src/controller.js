/**
 * Created by tcrow on 2016/3/24 0024.
 */
app.controller('AppCtrl', ['$scope','$rootScope','$cookies','$location','$translate', function ($scope,$rootScope,$cookies,$location,$translate) {
    $scope.gotoDemoPage = function(){
        $location.path("/demo");
    }

    $scope.changeTranslate = function(langKey){
        $translate.use(langKey);
    }
}]);


app.controller('ClusterController', ['$scope','$location','$http','Notification', function ($scope,$location,$http,Notification) {
    $scope.clusterMap = {};//cluster:brokerNameList
    $scope.brokerMap = {};//brokerName:{id:addr}
    $scope.brokerDetail = {};//{brokerName,id:detail}
    $scope.brokerAddrsArray = {};
    $http({
        method: "GET",
        url: "/cluster/list.query"
    }).success(function (resp) {
        if (resp.status == 0) {
            $scope.clusterMap = resp.data.clusterInfo.clusterAddrTable;
            $scope.brokerMap = resp.data.clusterInfo.brokerAddrTable;
            console.info($scope.brokerMap);
            $scope.brokerDetail = resp.data.brokerServer;
            $scope.clusterList = [];
            $.each($scope.clusterMap,function(key,brokerList){
                $scope.clusterList.push(key)
            })
            console.info($scope.brokerDetail)
            $.each($scope.brokerMap,function(key,broker){
                $.each(broker.brokerAddrs,function(i,brokerAddrs){
                    var brokerAddrs = {
                        index:i,
                        brokerAddrs:brokerAddrs,
                        brokerName:brokerName
                    }
                    brokerAddrsArray.push(brokerAddrs);
                })
            })
            $scope.switchCluster('DefaultCluster');
        }else{
            Notification.error({message: resp.errMsg, delay: 2000});
        }
    });

    $scope.switchCluster = function(clusterName){
        $scope.brokerNameList = $scope.clusterMap[clusterName];
    }

    $scope.showDetail = function (brokerDetail,brokerName,index) {
        $scope.detail = brokerDetail[brokerName][index];
        $scope.brokerName = brokerName;
        $scope.index = index;
        $(".brokerModal").modal();
    }

    $scope.showConfig = function (brokerAddr,brokerName,index) {
        $scope.brokerAddr = brokerAddr;
        $scope.brokerName = brokerName;
        $scope.index = index;
        $http({
            method: "GET",
            url: "cluster/brokerConfig.query",
            params:{brokerAddr:brokerAddr}
        }).success(function (resp) {
            if (resp.status == 0) {
                $scope.brokerConfig = resp.data;
            }else{
                Notification.error({message: resp.errMsg, delay: 2000});
            }
        })
    }
}])

