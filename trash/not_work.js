function wallPost(id) {

  title = $("[titleid=" + id + "]").html();
  imglink = $("[imgid=" + id + "]").children("img").attr("src");

  VK.api('photos.getWallUploadServer', {
    gid: '%group_id%'
  },successGetWallUpload);
}

function successGetWallUpload(data){

  if (data.response) {

    $.post('index.php', {
      action: 'upload',
      upload_url: data.response.upload_url,
      imglink: imglink
    }, successPostImg, 'json');

  }
}

function successPostImg(json){
  VK.api("photos.saveWallPhoto", {
    server: json.server,
    photo: json.photo,
    hash: json.hash,
    gid: '%group_id%'
  }, responseVkImgData);
}

function responseVkImgData(data){
  VK.api('wall.post', {
    owner_id: '-%group_id%',
    from_group: '1',
    message: title,
    attachments: data.response['0'].id
  }, function (data) {
    if (data.response) {
      $.post("index.php", {
        action: "hide",
        id: id
      });
      window.location.reload();
    }
  });
}