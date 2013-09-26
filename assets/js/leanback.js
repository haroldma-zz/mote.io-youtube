
var apiKey = "AIzaSyCkczmIB0LJZeoXjwYvVNHlD4asew7zBb4",
	perPage = 10,
	cutoff = new Date(new Date().setDate(new Date().getDate()-20));
	player = null,
	activeCategory = 0,
	hasShownOverlay = false,
	playlist = [],
	slideTimeout = null;
	requests = [
	{
		name: 'Trending',
		icon: 'signal',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/users/trends/favorites',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Music',
		icon: 'headphones',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Music',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Gaming',
		icon: 'gamepad',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/users/YTOTVgaming/favorites',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Sports',
		icon: 'dribbble',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/users/YTOTVsports/favorites',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Film & Animation',
		icon: 'film',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/users/YTOTVfilm/favorites',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Entertainment',
		icon: 'youtube-play',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Entertainment',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'News & Politics',
		icon: 'list-alt',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_News',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'People & Blogs',
		icon: 'group',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_People',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Scient & Technology',
		icon: 'beaker',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Tech',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Howto & Style',
		icon: 'question-sign',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Howto',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Education',
		icon: 'book',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Education',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Pets & Animals',
		icon: 'linux',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Animals',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	},
	{
		name: 'Most Popular',
		icon: 'star',
		ajax: {
	    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular',
	    data: {
	      key: apiKey,
	      alt: 'json',
	      time: 'today',
	      'max-results': perPage
	    }
	  },
	  results: []
	}
];

$(function() {

	showStatic();

	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

function showInfo() {

	var videoData = requests[activeCategory].results[player.getPlaylistIndex()];

	console.log(videoData)

	$('#video-category').html('<span class="icon-' + requests[activeCategory].icon + '"></span> ' + requests[activeCategory].name);
	$('#video-title').text(videoData['media$group']['media$title']['$t']);
	$('#video-text').text(videoData['media$group']['media$description']['$t']);

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

function getUrl(url) {
	var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	return videoid[1];
}

function loadActiveRequest() {

	playlist = [];

	$.ajax(requests[activeCategory].ajax)
  .done(function(data) {

  	if(typeof requests[activeCategory].ajax.data['start-index'] == "undefined") {
  		requests[activeCategory].ajax.data['start-index'] = perPage + 1;
  	} else {
			requests[activeCategory].ajax.data['start-index'] = requests[activeCategory].ajax.data['start-index'] + perPage;
  	}

  	requests[activeCategory].results = [];
  	for(var i = 0; i < data.feed.entry.length; i++) {

  		playlist.push(getUrl(data.feed.entry[i]['media$group']['media$player'][0].url));
			requests[activeCategory].results.push(data.feed.entry[i]);

  	}

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

function changeCategory(a) {
	activeCategory = a;
	loadActiveRequest();
}
