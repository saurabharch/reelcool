app.factory('VideoFactory', ($http) => {
  return {
    getVideoFile: (fileName) => {
      return $http.get(`/api/videos/${fileName}`)
      .then(response => response.data);
    }
  }
});
