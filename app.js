const API_URL  = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&key=AIzaSyCsYH0IWkrX4X4FE81v_92VzL3ygzGKgvA'

const app = new Vue({
  el: '#app',
  
  data: {
    currentPage: 'home',
    nowPlaying: {
      id: {videoId: ''}
    },
    videos: JSON.parse(localStorage.getItem('videos')) || [],
    keyword: '',
    results: {
      items: [],
      nextPage: '',
    },
    loading: false
  },

  methods: {
    changePage: function (page) {
      this.currentPage = page;
    },

    processSearch: function () {
      this.changePage('search')
      this.loading = true

      var url = API_URL + '&q=' + this.keyword

      $.getJSON(url)
        .done(function (response) {
          app.results.items = response.items
          app.results.nextPage = response.nextPageToken
        })
        .fail(function (response) {
          console.log(response);
        })
        .always(function () {
          app.loading = false;
        })

      return false
    },

    loadMore: function () {
      this.loading = true

      var url = API_URL + '&q=' + this.keyword + '&pageToken=' + this.results.nextPage

      $.getJSON(url)
        .done(function (response) {
          response.items.forEach(function (item) {
            app.results.items.push(item)
          })
          app.results.nextPage = response.nextPageToken
        })
        .fail(function (response) {
          console.log(response);
        })
        .always(function () {
          app.loading = false;
        })

      return false
    },

    checkVideo: function (item) {
      return this.videos.find(function (val) {
        return item.id.videoId == val.id.videoId
      })
    },

    saveVideo: function (item) {
      this.videos.push(item)
      localStorage.setItem('videos', JSON.stringify(this.videos))
    },

    deleteVideo: function (item) {
      var index = this.videos.findIndex(function (val) {
        return item.id.videoId === val.id.videoId
      })
      console.log(index);
      this.videos.splice(index, 1)
      localStorage.setItem('videos', JSON.stringify(this.videos))
    },

    getVideoUrl: function () {
      return 'https://www.youtube.com/embed/'+this.nowPlaying.id.videoId+'?autoplay=1'
    }
  }
})

$('#video-modal').on('hidden.bs.modal', function () {
    $('#video-modal iframe').removeAttr('src');
})