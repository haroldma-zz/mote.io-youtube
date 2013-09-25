var apiKey = "AIzaSyCkczmIB0LJZeoXjwYvVNHlD4asew7zBb4",
	perPage = 10,
	requests = [
	{
		name: 'Trending',
		ajax: {
	    url: 'https://www.googleapis.com/youtube/v3/search',
	    data: {
	      part: 'snippet',
	      order: 'rating',
	      safeSearch: 'none',
	      type: 'video',
	      videoDimension: '2d',
	      videoEmbeddable: true,
	      videoSyndicated: true,
	      maxResults: perPage,
	      key: apiKey
	    }
	  }
	},
	{
		name: 'Most Popular',
		ajax: {
	    url: 'https://www.googleapis.com/youtube/v3/videos',
	    data: {
	      part: 'snippet',
	      chart: 'mostPopular',
	      maxResults: perPage,
	      key: apiKey
	    }
	  }
	},
	{
		name: 'Music',
		ajax: {
	    url: 'https://www.googleapis.com/youtube/v3/search',
	    data: {
	      part: 'snippet',
	      order: 'rating',
	      safeSearch: 'none',
	      type: 'video',
	      videoDimension: '2d',
	      videoEmbeddable: true,
	      videoSyndicated: true,
	      topId: '/music',
	      maxResults: perPage,
	      key: apiKey
	    }
	  }
	},
];

var player = null;

$(function() {

	var params = { allowScriptAccess: "always" };
    var atts = { id: "ytapiplayer" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
                       "ytapiplayer", "100%", "100%", "8", null, null, params, atts);

});

function onYouTubePlayerReady(playerId) {

	var playlist = [];
	player = document.getElementById('ytapiplayer');

  $.ajax(requests[1].ajax)
  .done(function(data) {

  	console.log(player)

  	for(var i = 0; i < data.items.length; i++) {
	  	playlist.push(data.items[i].id);
  	}
  	player.loadPlaylist(playlist);

  })
  .fail(function() {
    alert( "error" );
  })
  .always(function() {

  });

}
