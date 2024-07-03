import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ProfileCard({searchTerm, onClick}) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const readAccessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGNmMGVkYjg1MTZmZjQzNjM0NzE4YWRjYjk4OGFmNSIsInN1YiI6IjY2MTZiYmYxN2E0ZWU3MDE2MzBhNGFhYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NwHjomSj24e_eFSpivIagTQOGMB1Z7qePKGa-DssOYw"
    const [page, setPage] = useState(1)

    function nextPage(){
       setPage(page + 1)
    }
     function prevPage(){
        if(page === 1){
            setPage(1)
        } else {
            setPage(page - 1)
        }

     }

    useEffect(() => {
        async function movieDatabase(e, p){console.log('Fetching movies in getStaticProps...');
        const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
          const url = `https://api.themoviedb.org/3/search/movie?query=${e}&include_adult=false&language=en-US&page=${p}`
          const options = {
              method: 'GET',
              headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${readAccessToken}`
              }
          }   
          try {
              const movies = await axios.get(url, options)
              const movieData = movies.data
              const cleanedMovieData = movieData.results.slice(0, 6).map(movie => {
                return {
                  ...movie,
                  poster_path: movie.poster_path !== null ? `${imageBaseUrl}${movie.poster_path}` : 'img/noom-peerapong.jpg',
                  title: movie.title || 'Title not available',
                  popularity: movie.popularity !== null ? movie.popularity : 'Popularity not available',
                  vote_average: movie.vote_average !== null ? movie.vote_average : 'Vote average not available',
                  vote_count: movie.vote_count !== null ? movie.vote_count : 'Vote count not available',
                };
              });
              return setMovies(cleanedMovieData)
          } catch (error) {
              console.error('Error in getStaticProps:', error);
              return setMovies([]) // Return an empty array on error
          } finally{
                setLoading(false)

          }
        }
        movieDatabase(searchTerm, page)
      }, [searchTerm,page])
    
  // DatabaseApi
  return (
    <div className='container'>

        <div className='searchBox'>
            <div>
                <div className='searchInput'>
                    <input id='userInput' type="text" placeholder="Search for a movie" />
                </div>
                <div className='searchButton'>
                    <button type='button' onClick={onClick} >Search</button>
                </div>
            </div>
        
        </div>
        <h1>Movies searches for {searchTerm}</h1>
        <div className='profileContainer'>
            {loading && ( 
                <h1>Loading...</h1>
            )}
            {!loading && (movies.map((movies)=>{
                console.log(movies)
                return (
                    <div className='movieCard' key={movies.id}>
                        <img src={`${movies.poster_path}`} alt={movies.title} />
                        <h2>{movies.title}</h2>
                        <ul>
                            <li><span>Popularity</span> {movies.popularity}</li>
                            <li><span>Vote Average</span> {Math.round(movies.vote_average)}</li>
                            <li><span>Vote Count</span> {movies.vote_count}</li>
                            <li><span>Release Date</span> {movies.release_date}</li>
                        </ul>

                    </div>
                )
            }))}
        </div>
        <div className='nextPrev'>
                <button type='button' onClick={nextPage}>Next Page</button>
                <button type='button' onClick={prevPage}>Previous Page</button>
        </div>  
    </div>
  )
}

export default ProfileCard