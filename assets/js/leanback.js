/*

/people
/tv
/film
/sports
/cvg - video games
/internet
/m/05p553 - comedy
/m/05jhg - news
/m/07c1v - technology
/m/017rcq - how to
/m/02jfc - education

*/
var apiKey = "AIzaSyCkczmIB0LJZeoXjwYvVNHlD4asew7zBb4",
	perPage = 2,
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

var player = null,
	activeCategory = 1,
	hasShownOverlay = false,
	playlist = [],
	slideTimeout = null;

$(function() {

	showStatic();

	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

function showInfo() {

	var videoData = requests[1].results.items[player.getPlaylistIndex()].snippet;

	$('#video-title').text(videoData.title);
	$('#video-text').text(videoData.description);

	$('#info-overlay').stop().animate({
		left: '0'
	}, 500);

	clearTimeout(slideTimeout);
	slideTimeout = setTimeout(function(){
		hideInfo();
	}, 5000);

}

function hideInfo() {
	$('#info-overlay').stop().animate({
		left: '-80%'
	}, 500);
}

function showStatic() {
	$('#static').show();
}

function hideStatic() {
	$('#static').hide();
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    playerVars: {
    	controls: 0,
    	enablejsapi: 1,
    	showinfo: 0,
    	showsearch: 0,
    	modestbranding: 1
    },
    events: {
      'onReady': loadActiveRequest,
      'onStateChange': onPlayerStateChange
    }
  });
}

function loadActiveRequest() {

	console.log('load active')

	playlist = [];

	$.ajax(requests[activeCategory].ajax)
  .done(function(data) {

  	requests[activeCategory].results = data;
  	requests[activeCategory].ajax.data.pageToken = data.nextPageToken;

  	for(var i = 0; i < data.items.length; i++) {
	  	playlist.push(data.items[i].id);
  	}

  	console.log(playlist)

  	player.loadPlaylist({playlist: playlist});
  	player.mute();

  });

}

function onPlayerStateChange(event) {

  if (event.data == 1) {
  	hideStatic();
  	showInfo();
  }

  if (event.data == -1 ||
  	event.data == 0 ||
  	event.data == 3 ||
  	event.data == 5
  	) {
  	console.log('not playing')
  	showStatic();
  }

  if (event.data == 0) {
  	loadNextPageIfLast();
  }

}

function loadNextPageIfLast() {
	if(player.getPlaylistIndex() == (perPage - 1)) {
		loadActiveRequest();
	}
}

function nextVideo() {
	loadNextPageIfLast();
	player.nextVideo();
}

function previousVideo() {
	player.previousVideo();
}
