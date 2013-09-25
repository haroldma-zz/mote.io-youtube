var apiKey = "AIzaSyCkczmIB0LJZeoXjwYvVNHlD4asew7zBb4";
$(function() {
  $.ajax({
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      part: 'snippet',
      order: 'rating',
      safeSearch: 'none',
      type: 'video',
      videoDimension: '2d',
      videoEmbeddable: true,
      videoSyndicated: true,
      maxResults: 10,
      key: apiKey
    }
  })
  .done(function(data) {
    console.log(data)
  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {
  });
});
