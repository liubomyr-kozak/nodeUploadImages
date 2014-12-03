var gtest = angular.module('gtest', ['ngRoute', 'ngCookies']);

gtest.controller('mainController', function ($scope, $http) {

  var urlImg = "http://www.google.co.uk/images/logos/ps_logo2.png";


  //VkAppInit();
  //VkLogin(VkWallPost);
  $http.post('/image', {
    url: urlImg
  })
    .success(function (imgData, status) {
      var image = new FormData(imgData);
      console.log("image", image);
    });

  function VkAppInit() {

    VK.init({
      apiId: 4585205,
      nameTransportPath: 'http://durov.at/xd_receiver.html',
      vk: 1
    });
  }

  function VkLogin(VkWallPostFunc) {

    VK.Auth.login(function (response) {

      if (response.status == 'connected') {

        VK.Auth.getLoginStatus(function (user) {

          if (user.session) {

            console.info('    LOGIN', user);
            VkWallPostFunc()
          }
        });
      } else {

        console.error('VK.Auth.login -> response.status not connected')
      }
    }, 8223);
  }

  function VkWallPost() {
    VK.api('photos.getWallUploadServer', {uid: 9453772}, responseFromServer, onError);
  }


  function responseFromServer(data) {
    console.log("data", data);

    var response_url = data.response.upload_url;

    $http.post('/image', {
      url: urlImg
    })
    .success(function (imgData, status) {

        //console.log("new FormData(imgData)", new FormData(imgData))
      $http.post(response_url, {

        data: new FormData(imgData)

      }).success(function(data){

        console.log("data", data);
        //VK.Api.call('photos.saveWallPhoto', {
        //  uid: 9453772
        //}, function (result) {
        //
        //  VK.Api.call('wall.post', { // постим на стену
        //    owner_id: result.owner_id,
        //    attachments: '<photo><' + result.owner_id + '>_<' + result.id + '>',
        //    message: 'фото для тебя '
        //  });
        //
        //});
      }).error(function(err){
        console.log(err)})
    })
    .error(function (err) {
      console.log(err)
    });


  }

  function onError(err) {
    console.log(err)
  }
});