var gtest = angular.module('gtest', ['ngRoute', 'ngCookies']);

gtest.controller('mainController', function($scope, $http){
    $scope.formData = {};

    var urlImg = "http://www.google.co.uk/images/logos/ps_logo2.png";

    $http.post('/image', {
        url: urlImg
    })
    .success(function (dataImg, status) {

        VK.init({
          apiId: 4585205,
          nameTransportPath: 'http://durov.at/xd_receiver.html',
          vk: 1
        });
        VK.Auth.login(function (response) {
          if(response.status == 'connected'){
            VK.Auth.getLoginStatus(function (user) {
              if (user.session){

                console.info('    LOGIN', user)
                vkPost()
                // VK.api('photos.getWallUploadServer',{ uid:  9453772 },responseFromServer,onError);
              }
            });
          }else{
            console.error('VK.Auth.login -> response.status not connected')
          }
        }, 8223);

            function vkPost(){
            VK.api('wall.getPhotoUploadServer', function (data) {
                if (data.response) {
                    var uploadUrl = data.response.upload_url;
                    $.post(app.baseUrl + 'upload.php', {uploadUrl: uploadUrl}, function(data) {
                        if (data) {
                            var upload = data;
                            var message = 'Ку-Ку';
                            VK.api('wall.savePost', {
                                wall_id: VK.params.viewer_id,
                                server: upload.server,
                                photo: upload.photo,
                                hash: upload.hash,
                                message: message
                            }, function (data) {
                                if (data.response) {
                                    VK.addCallback('onWallPostSave', app.onWallPost);
                                    VK.addCallback('onWallPostCancel', app.onWallPost);
                                    VK.callMethod('saveWallPost', data.response.post_hash);
                                }
                            });
                        }
                    }, 'json');
                }
            });
}
        function responseFromServer(data) {
         
          var response_url = data.response.upload_url;
          console.log(data.response.upload_url, dataImg);

          $.ajax({
                type: "POST",
                url: response_url,
                data: dataImg,
                success: function (request) {
                  console.log(request)

                  VK.Api.call('photos.saveWallPhoto', {
                        uid: 9453772
                      }, function (result) {

                         VK.Api.call('wall.post', { // постим на стену
                          owner_id: result.owner_id,
                          attachments: '<photo><' + result.owner_id + '>_<' + result.id + '>',
                          message: 'фото для тебя '
                        });

                      }
                  );
                },
                error: function(err){
                  console.log(err)
                }
              }
          );

        } 

        function onError(err){
          console.log(err)
        }  
    })
    .error(function(err){
        console.log(err)
    })

   
});