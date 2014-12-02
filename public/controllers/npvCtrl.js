angular.module('RapidNPV', []);

function NpvCtrl ($scope, $http){

  $scope.submitForm = function(isValid) {
    console.log('called from submitForm', isValid) 
  };
  
  // the NPV function
  var npvFunction = function (rate, cf0) {
    console.log('called', arguments)
    var rate = rate/100, npv = cf0;
    for (var i = 2; i < arguments.length; i++){
      npv +=(arguments[i] / Math.pow((1 + rate), i - 1));
    }
    console.log(npv*100)
    return (Math.round(npv * 100) / 100);
  };


  $scope.calculateNPV = function(){
    console.log($scope.npv);
    var rate = $scope.npv.rate;
    var cf0 = $scope.npv.cf0;
    var cf1 = $scope.npv.cf1;
    var cf2 = $scope.npv.cf2;
    var cf3 = $scope.npv.cf3;

    var npvValue = npvFunction(Number(rate), Number(cf0), Number(cf1), Number(cf2), Number(cf3));
    var npvValueToMoney = npvValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    var message = 'The Net Present Value (NPV) is $'+npvValueToMoney+'.' ;
    
    $('#results').html(message);

    if (npvValue > 0) {
      $('#status').removeClass('alert alert-caution');
      $('#status').removeClass('alert alert-danger');
      $('#status').html('Worth It!').addClass('alert alert-success');
    } else if (npvValue === 0) {
      $('#status').removeClass('alert alert-danger');
      $('#status').removeClass('alert alert-success');
      $('#status').html('Worth It! \n The investment earns a rate of return equal to the discount rate').addClass('alert alert-warning');
    } else {
      $('#status').removeClass('alert alert-caution');
      $('#status').removeClass('alert alert-success');
      $('#status').html('Not Worth It!').addClass('alert alert-danger');
    }
  };

  $scope.renderNPV = function (response){
    $scope.npv = response; 
  };

  $http.get('/npvs')
    .success($scope.renderNPV);
};