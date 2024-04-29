const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZDgzYjRlZTZkMDVlZTc0NGMyODRjYmQwNTliOTE2ZSIsInN1YiI6IjY2MjVhYzFiMDdmYWEyMDE4NzlhMGRjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XUYHliAwrHDj9KkTNjYNbcF_qnR2lvjpXe_tECYKZe8'
  },
};

const fetchData = async () => {
  try {
    const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createMovieCard = (movie) => {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  image.alt = movie.title;

  image.addEventListener("click", () => {
    alert(`영화 ID: ${movie.id}`);
  });

  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const overview = document.createElement("p");
  overview.textContent = movie.overview;

  const voteAverage = document.createElement("p");
  voteAverage.textContent = `평점: ${movie.vote_average}`;

  movieInfo.appendChild(title);
  movieInfo.appendChild(overview);
  movieInfo.appendChild(voteAverage);
  movieCard.appendChild(image);
  movieCard.appendChild(movieInfo);

  document.getElementById("movie-container").appendChild(movieCard);
};

const updateMovieList = (movies) => {
  const movieContainer = document.getElementById("movie-container");
  movieContainer.innerHTML = "";

  if (movies.length === 0) {
    const noResultMessage = document.createElement("p");
    noResultMessage.classList.add("button-p");
    noResultMessage.textContent = "검색 결과가 없습니다.";
    movieContainer.appendChild(noResultMessage);
  } else {
    movies.forEach((movie) => {
      createMovieCard(movie);
    });
  }
};

const sortByRating = (movies, order) => {
  console.log(order)
  return movies.sort((a, b) => {
    if (order === "desc") {
      return b.vote_average - a.vote_average;
    } else {
      return a.vote_average - b.vote_average;
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData();

  if (data) {
    const searchInput = document.getElementById("search");
    searchInput.focus();

    const searchButton = document.querySelector(".search");
    const sortOrderSelect = document.getElementById("sort-order");

    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredMovies = data.results.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm)
      );
      updateMovieList(filteredMovies);
    });

    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = data.results.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm)
        );
        updateMovieList(filteredMovies);
      }
    });

    sortOrderSelect.addEventListener("change", () => {
      const selectedOrder = sortOrderSelect.value;
      const sortedMovies = sortByRating([...data.results], selectedOrder);
      updateMovieList(sortedMovies);
    });

    updateMovieList(data.results);
  }
});
