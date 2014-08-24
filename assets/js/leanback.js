leanback = function() {

	var self = this;

	self.perPage = 25;
	self.cutoff = new Date(new Date().setDate(new Date().getDate()-20));
	self.player = null;
	self.activeCategory = 0;
	self.hasShownOverlay = false;
	self.playlist = [];
	self.slideTimeout = null;
	self.requests = [
		{
			name: 'Trending',
			icon: 'signal',
			ajax: {
		    url: 'https://gdata.youtube.com/feeds/api/users/trends/favorites',
		    data: {
		      alt: 'json',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      'max-results': self.perPage
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
		      alt: 'json',
		      'max-results': self.perPage
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
		      alt: 'json',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
		    }
		  },
		  results: []
		},
		{
			name: 'Science & Technology',
			icon: 'beaker',
			ajax: {
		    url: 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular_Tech',
		    data: {
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
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
		      alt: 'json',
		      time: 'today',
		      'max-results': self.perPage
		    }
		  },
		  results: []
		},
		{
			name: 'Search',
			icon: 'search',
			ajax: {
		    url: 'https://gdata.youtube.com/feeds/api/videos',
		    data: {
		      alt: 'json',
		      orderby: 'relevance'
		    }
		  },
		  results: []
		}
	];

	self.showInfo = function() {

		var videoData = self.requests[self.activeCategory].results[self.player.getPlaylistIndex()];

		$('#video-category').html('<span class="icon-' + self.requests[self.activeCategory].icon + '"></span> ' + self.requests[self.activeCategory].name);
		$('#video-title').text(videoData['media$group']['media$title']['$t']);
		$('#video-text').text(videoData['media$group']['media$description']['$t']);

		$('#info-overlay').stop().animate({
			left: '0'
		}, 500);

		clearTimeout(app.slideTimeout);
		self.slideTimeout = setTimeout(function(){
			app.hideInfo();
		}, 5000);

	}

	self.hideInfo = function() {
		$('#info-overlay').stop().animate({
			left: '-80%'
		}, 500);
	}

	self.showStatic = function() {
		$('#static').show();
	}

	self.hideStatic = function() {
		$('#static').hide();
	}

	self.getUrl = function(url) {
		var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
		return videoid[1];
	}

	self.loadActiveRequest = function() {

		self.playlist = [];

		$.ajax(self.requests[self.activeCategory].ajax)
	  .done(function(data) {

	  	if(typeof self.requests[self.activeCategory].ajax.data['start-index'] == "undefined") {
	  		self.requests[self.activeCategory].ajax.data['start-index'] = self.perPage + 1;
	  	} else {
				self.requests[self.activeCategory].ajax.data['start-index'] = self.requests[self.activeCategory].ajax.data['start-index'] + self.perPage;
	  	}

	  	self.requests[self.activeCategory].results = [];
	  	for(var i = 0; i < data.feed.entry.length; i++) {

	  		var raw_url = data.feed.entry[i]['media$group']['media$player'];

	  		if(typeof raw_url !== "undefined") {
		  		self.playlist.push(self.getUrl(raw_url[0].url));
					self.requests[self.activeCategory].results.push(data.feed.entry[i]);
	  		}

	  	}

	  	self.player.loadPlaylist({playlist: self.playlist});

	  });

	}

	self.onPlayerStateChange = function(event) {

	  if (event.data == 1) {
	  	self.hideStatic();
	  	self.showInfo();
	  }

	  if (event.data == -1 ||
	  	event.data == 0 ||
	  	event.data == 3 ||
	  	event.data == 5
	  	) {
	  	self.showStatic();
	  }

	  if (event.data == 0) {
	  	self.loadNextPageIfLast();
	  }

	}

	self.loadNextPageIfLast = function() {
		if(self.player.getPlaylistIndex() == (self.perPage - 1)) {
			self.loadActiveRequest();
		}
	}

	self.nextVideo = function() {
		self.loadNextPageIfLast();
		self.player.nextVideo();
	}

	self.previousVideo = function() {
		self.player.previousVideo();
	}

	self.changeCategory= function(a) {
		self.activeCategory = a;
		delete self.requests[self.activeCategory].ajax.data['start-index'];
		self.loadActiveRequest();
	}

	self.search = function(q) {
		self.activeCategory = 13;
		self.requests[self.activeCategory].ajax.data.q = q;
		self.requests[self.activeCategory].name = "Search results for " + q;
		delete self.requests[self.activeCategory].ajax.data['start-index'];
		self.loadActiveRequest();
	}

	self.init = function() {
		self.showStatic();
	}

}

var app = null;

$(function() {

	var tag = document.createElement('script'),
		firstScriptTag = document.getElementsByTagName('script')[0];

	tag.src = "https://www.youtube.com/iframe_api";
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	app = new leanback();

});

onYouTubeIframeAPIReady = function() {

  app.player = new YT.Player('player', {
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
      'onReady': function(){
      	app.loadActiveRequest();
      },
      'onStateChange': function(e) {
      	app.onPlayerStateChange(e);
      }
    }
  });

	app.init();

}
