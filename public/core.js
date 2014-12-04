var gtest = angular.module('gtest', ['ngRoute', 'ngCookies']);

gtest.controller('mainController', function ($scope, $http) {

  var urlImg = "http://www.google.co.uk/images/logos/ps_logo2.png";


  VkAppInit();
  VkLogin(VkWallPost);

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
    }, (2+4+8192));
    //}, 8223);
  }
  //
  //function VkWallPost() {
  //  VK.api('photos.getUploadServer',{
  //    'aid':1
  //  }, responseFromServer, onError);
  //  //VK.api('photos.getWallUploadServer', {}, responseFromServer, onError);
  //}

  function VkWallPost() {
    VK.api('photos.getWallUploadServer', {}, responseFromServer, onError);
  }

  function responseFromServer(data) {

    console.log(data);
    var response_url = data.response.upload_url;

    $http.post('/image', {
      url: urlImg
    }).success(function (imgData, status) {

      console.log(imgData)


      $http({
        method: 'POST',
        url: response_url,
        headers: {
          'Content-Type': undefined,
          Authorization: ""
        },
        photo: imgData
      }).success(function (data) {
        console.log("data", data)
      }).error(onError)


    //  $http.post(
    //    response_url,
    //    {
    //      "photo": imgData
    //    },
    //    {
    //      headers: {'Content-Type': 'multipart/form-data'}
    //    }).success(function (data) {
    //
    //    console.log("data", data);
    ////    //VK.Api.call('photos.saveWallPhoto', {
    ////    //  uid: 9453772
    ////    //}, function (result) {
    ////    //
    ////    //  VK.Api.call('wall.post', { // постим на стену
    ////    //    owner_id: result.owner_id,
    ////    //    attachments: '<photo><' + result.owner_id + '>_<' + result.id + '>',
    ////    //    message: 'фото для тебя '
    ////    //  });
    ////    //
    ////    //});
    //  }).error(onError);
    }).error(onError);

  }

  function onError(err) {
    console.log(err)
  }
});