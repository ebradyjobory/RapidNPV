angular.module('RapidNPV', []);

function NpvCtrl ($scope, $http){
  
  $scope.isItNegative = function(){
    if ($scope.npv.cf0 > 0) {
      console.log("should be negative");
      $("input[type='number']:focus").addClass('inputError');
      $('.negativeInputMsg').show();
    }
    if ($scope.npv.cf0 < 0) {
      $('.negativeInputMsg').hide();
      console.log("should be negative");
      $("input[type='number']:focus").removeClass('inputError');
    }
  }

  $scope.submitForm = function(isValid) {
    console.log('called from submitForm', isValid) 
  };

  $scope.regExp = /[0-9]/;
  
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
    if (npvValueToMoney < 0) {
      npvValueToMoney = -npvValueToMoney;
      var message = 'The Net Present Value (NPV) is <strong>-$'+npvValueToMoney+'</strong>.';  
    } else {
      var message = 'The Net Present Value (NPV) is <strong>$'+npvValueToMoney+'</strong>.';  
    }
    
    $('#results').html(message);

    if (npvValue > 0) {
      $('#status').removeClass('alert alert-caution');
      $('#status').removeClass('alert alert-danger');
      $('#status').html('Yes, it\'s worth it!').addClass('alert alert-success');
    } else if (npvValue === 0) {
      $('#status').removeClass('alert alert-danger');
      $('#status').removeClass('alert alert-success');
      $('#status').html('Yes, it\'s worth it! \n The investment earns a rate of return equal to the discount rate.').addClass('alert alert-warning');
    } else {
      $('#status').removeClass('alert alert-caution');
      $('#status').removeClass('alert alert-success');
      $('#status').html('No, it\'s not worth it!').addClass('alert alert-danger');
      $('body').addClass('.filter');
    }
  };

  $scope.renderNPV = function (response){
    $scope.npv = response; 
  };

  $http.get('/npvs')
    .success($scope.renderNPV);
};