const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZDgzYjRlZTZkMDVlZTc0NGMyODRjYmQwNTliOTE2ZSIsInN1YiI6IjY2MjVhYzFiMDdmYWEyMDE4NzlhMGRjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XUYHliAwrHDj9KkTNjYNbcF_qnR2lvjpXe_tECYKZe8",
  },
};
// TMDB API를 사용하여 영화 데이터 가져오기
const fetchData = async () => {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      options
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 영화 카드를 생성하는 함수
const createMovieCard = (movie) => {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  // 영화 포스터 이미지
  const image = document.createElement("img");
  image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  image.alt = movie.title;

  // 이미지를 클릭하면 해당 영화의 ID를 알려주는 알림창
  image.addEventListener("click", () => {
    alert(`영화 ID: ${movie.id}`);
  });

  // 영화 정보 영역
  const movieInfo = document.createElement("div");
  movieInfo.classList.add("movie-info");

  // 영화 제목
  const title = document.createElement("h3");
  title.textContent = movie.title;

  // 영화 개요
  const overview = document.createElement("p");
  overview.textContent = movie.overview;

  // 평점
  const voteAverage = document.createElement("p");
  voteAverage.textContent = `평점: ${movie.vote_average}`;

  // 영화 정보 영역에 자식 요소 추가
  movieInfo.appendChild(title);
  movieInfo.appendChild(overview);
  movieInfo.appendChild(voteAverage);

  // 영화 카드에 자식 요소 추가
  movieCard.appendChild(image);
  movieCard.appendChild(movieInfo);

  document.getElementById("movie-container").appendChild(movieCard);
};

// 영화 목록을 업데이트하는 함수
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

// 평점에 따라 영화를 정렬하는 함수
const sortByRating = (movies, order) => {
  console.log(order);
  return movies.sort((a, b) => {
    if (order === "desc") {
      return b.vote_average - a.vote_average;
    } else {
      return a.vote_average - b.vote_average;
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  let originalData = await fetchData();
  let sortedData = sortByRating([...originalData.results], "desc");

  if (originalData) {
    const searchInput = document.getElementById("search");
    searchInput.focus();

    const searchButton = document.querySelector(".search");
    const sortOrderSelect = document.getElementById("sort-order");

    // 영화 제목 검색 버튼 클릭 시
    searchButton.addEventListener("click", () => {
      // 검색어를 소문자로 변환하여 일치하는 영화 필터링
      const searchTerm = searchInput.value.toLowerCase();
      const filteredMovies = originalData.results.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm)
      );
      updateMovieList(filteredMovies);
    });

    // 영화 제목 검색 입력란에서 Enter 키 입력 시
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        // 검색어를 소문자로 변환하여 일치하는 영화 필터링
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = originalData.results.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm)
        );
        updateMovieList(filteredMovies);
      }
    });

    // sortByRating 함수를 사용하여 평점 순으로 정렬
    sortOrderSelect.addEventListener("change", () => {
      const selectedOrder = sortOrderSelect.value;
      sortedData = sortByRating([...originalData.results], selectedOrder);
      updateMovieList(sortedData);
    });

    const cardsPerPage = 10; // 한 페이지에 표시할 카드의 수
    let currentPage = 1; // 현재 페이지

    const updatePagination = () => {
      const prevPageBtn = document.getElementById("prev-page");
      const nextPageBtn = document.getElementById("next-page");
      const currentPageSpan = document.getElementById("current-page");
      const totalPages = Math.ceil(sortedData.length / cardsPerPage);

      currentPageSpan.textContent = currentPage;

      if (currentPage === 1) {
        prevPageBtn.disabled = true;
      } else {
        prevPageBtn.disabled = false;
      }

      if (currentPage === totalPages) {
        nextPageBtn.disabled = true;
      } else {
        nextPageBtn.disabled = false;
      }
    };

    // 현재 페이지에 맞게 영화 목록 업데이트 및 페이지네이션 초기화
    const updateMovieList = (movies) => {
      const movieContainer = document.getElementById("movie-container");
      movieContainer.innerHTML = "";

      const startIndex = (currentPage - 1) * cardsPerPage;
      const endIndex = startIndex + cardsPerPage;
      const moviesToShow = movies.slice(startIndex, endIndex);

      if (moviesToShow.length === 0) {
        const noResultMessage = document.createElement("p");
        noResultMessage.classList.add("button-p");
        noResultMessage.textContent = "검색 결과가 없습니다.";
        movieContainer.appendChild(noResultMessage);
      } else {
        moviesToShow.forEach((movie) => {
          createMovieCard(movie);
        });
      }

      updatePagination();
    };

    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updateMovieList(sortedData);
        
        // 페이지가 넘어갈 때 스크롤을 맨 위로 이동
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.getElementById("next-page").addEventListener("click", () => {
      const totalPages = Math.ceil(sortedData.length / cardsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateMovieList(sortedData);
        
        // 페이지가 넘어갈 때 스크롤을 맨 위로 이동
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    // 초기 영화 목록 업데이트
    updateMovieList(sortedData);
  }
});
