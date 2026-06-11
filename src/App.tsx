import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDarkMode } from "./hooks/useDarkMode";
import { Navbar } from "./components/Navbar";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { MovieRow } from "./components/MovieRow";
import { SearchGrid } from "./components/SearchGrid"; 
import type { Movie } from "./types/movie";
import { movieApi } from "./services/api";
import { MovieDetails } from "./pages/MovieDetails";
import { Login } from "./pages/Login";

function App() {
  const { theme, toggleTheme } = useDarkMode();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [arabicFeaturedMovies, setArabicFeaturedMovies] = useState<Movie[]>([]);
  const [arabicTopRatedMovies, setArabicTopRatedMovies] = useState<Movie[]>([]);
  const [arabicPopularMovies, setArabicPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [featuredData, topRatedData, popularData, arabicFeaturedData, arabicTopRatedData, arabicPopularData] = await Promise.all([
      movieApi.getFeatured(),  
      movieApi.getTopRated(),  
      movieApi.getPopular(),
      movieApi.getArabicFeatured(),
      movieApi.getArabicTopRated(),
      movieApi.getArabicPopular(),    
    ]);

        setFeaturedMovies(featuredData.results.slice(0, 5));
        setPopularMovies(popularData.results);
        setTopRatedMovies(topRatedData.results);
        setArabicFeaturedMovies(arabicFeaturedData.results.slice(0, 5));
        setArabicTopRatedMovies(arabicTopRatedData.results);
        setArabicPopularMovies(arabicPopularData.results);
      } catch (error) {
        console.error("Error fetching movies data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  
  useEffect(() => {
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    
    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await movieApi.searchMovies(searchQuery);
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Error during live search:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} onSearch={setSearchQuery} />
      
      <Routes>
        <Route path="/" element={
          <main>
            {loading ? (
              <div className="h-[500px] w-full flex items-center justify-center text-indigo-500 font-bold animate-pulse">
                Loading MG Movie Platform...
              </div>
            ) : (
              <>
                
                {!searchQuery && <FeaturedCarousel movies={featuredMovies} />}
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                  {searchLoading ? (
                    <div className="text-center py-20 text-indigo-500 font-bold animate-pulse">
                      Searching for masterpieces...
                    </div>
                  ) : searchQuery ? (
                    
                    <SearchGrid query={searchQuery} movies={searchResults} />
                  ) : (
                    
                    <>
                      <MovieRow title="Trending & Popular" movies={popularMovies} />
                      <MovieRow title="Top Rated Movies" movies={topRatedMovies} />
                      <MovieRow title="Featured Arabic Movies" movies={arabicFeaturedMovies} />
                      <MovieRow title="Top Rated Arabic Movies" movies={arabicTopRatedMovies} />
                      <MovieRow title="Popular Arabic Movies" movies={arabicPopularMovies} />
                    </>
                  )}
                </div>
              </>
            )}
          </main>
        } />

        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login isRegister={true} />} />
      </Routes>
    </div>
  );
}

export default App;