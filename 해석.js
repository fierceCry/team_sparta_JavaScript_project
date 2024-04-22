const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZDgzYjRlZTZkMDVlZTc0NGMyODRjYmQwNTliOTE2ZSIsInN1YiI6IjY2MjVhYzFiMDdmYWEyMDE4NzlhMGRjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XUYHliAwrHDj9KkTNjYNbcF_qnR2lvjpXe_tECYKZe8",
  },
};
// options는 토큰을 보내어 데이터값을 받는다.
fetch(
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
  options
)
  .then((response) => response.json())
  // responst를 json의 형태로 변경
  .then((data) => {
    const movieContainer = document.getElementById("movie-container");
    // html에 movie-container id이름을 가져온다
    const searchInput = document.getElementById("search");
    // html에 search id이름을 가져온다
    const sortOrderSelect = document.getElementById("sort-order");
    // html에 sort-order id이름을 가져온다

    const createMovieCard = (movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      const image = document.createElement("img");
      image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      image.alt = movie.title;

      image.addEventListener("click", () => {
        alert(`영화 ID: ${movie.id}`);
      });
      // div태그를 생성할떄 movie-card라는 클래스이름으로 만든다 
      // img태그 생성 img 경로를 지정 img 이벤트를 생성하여 클릭하였을때 movie.id를 alert로 생성

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");
      // div 태그생성해서 클래스이름 지정

      const title = document.createElement("h3");
      title.textContent = movie.title;
      // h3태그 생성하여 h3태그 내용을 movie.title로 지정

      const overview = document.createElement("p");
      overview.textContent = movie.overview;
      // p태그 생성하여 내용을 movie.overview로 지정

      const voteAverage = document.createElement("p");
      voteAverage.textContent = `평균 평점: ${movie.vote_average}`;
      
      // p태그 생성하여 평균평점 지정

      movieInfo.appendChild(title);
      movieInfo.appendChild(overview);
      movieInfo.appendChild(voteAverage);
      movieCard.appendChild(image);
      movieCard.appendChild(movieInfo);
      movieContainer.appendChild(movieCard);

    };

    const sortByRating = (movies, order) => {
      return movies.sort((a, b) => {
        if (order === "high-to-low") {
          return b.vote_average - a.vote_average;
        } else {
          return a.vote_average - b.vote_average;
        }
      });
    };

    sortOrderSelect.addEventListener("change", () => {
      const selectedOrder = sortOrderSelect.value;
      const sortedMovies = sortByRating(data.results, selectedOrder);
      movieContainer.innerHTML = "";
      sortedMovies.forEach((movie) => {
        createMovieCard(movie);
      });
    });

    data.results.forEach((movie) => {
      createMovieCard(movie);
    });

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      if (searchTerm === "") {
        movieContainer.innerHTML = "";

        data.results.forEach((movie) => {
          createMovieCard(movie);
        });
      } else {
        const filteredMovies = data.results.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm)
        );
        movieContainer.innerHTML = "";

        if (filteredMovies.length === 0) {
          const noResultMessage = document.createElement("p");
          noResultMessage.classList.add("search");
          noResultMessage.textContent = "검색 결과가 없습니다.";
          movieContainer.appendChild(noResultMessage);
        } else {
          filteredMovies.forEach((movie) => {
            createMovieCard(movie);
          });
        }
      }
    });
  })
  .catch((err) => console.error(err));
