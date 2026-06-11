import React, { useState, useEffect } from "react";
import type { Movie } from "../types/movie";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  movies: Movie[];
}

export const FeaturedCarousel: React.FC<CarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, movies]);

  if (!movies || movies.length === 0) {
    return <div className="h-[450px] md:h-[550px] w-full bg-slate-900 animate-pulse"></div>;
  }

  const currentMovie = movies[currentIndex];
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

  // تظبيط الـ Mapping الآمن
  const backdrop = (currentMovie as any)?.backdrop_path || currentMovie?.backdropPath;
  const ratingValue = (currentMovie as any)?.vote_average || currentMovie?.rating;
  const releaseDateValue = (currentMovie as any)?.release_date || currentMovie?.releaseDate;

  return (
    <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden bg-slate-950">
      {/* صورة الخلفية العريضة */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{ 
          backgroundImage: backdrop 
            ? `url(${TMDB_IMAGE_BASE}${backdrop})` 
            : `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000')`
        }}
      >
        {/* ماسك التعتيم (Gradient Overlays) ليعطي طابع Premium */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* بيانات الفيلم المكتوبة */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 text-white z-10 max-w-2xl">
        <span className="bg-indigo-600 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-md w-max mb-4 shadow-lg shadow-indigo-600/30">
          Featured
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
          {currentMovie.title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>{ratingValue ? Number(ratingValue).toFixed(1) : "0.0"}</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            {releaseDateValue && releaseDateValue.includes("-") ? releaseDateValue.split("-")[0] : "N/A"}
          </span>
        </div>

        <p className="text-slate-300 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">
          {currentMovie.description}
        </p>

        <button className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition w-max shadow-lg shadow-indigo-600/20 active:scale-95">
          <Play className="w-5 h-5 mr-2 fill-current" /> Watch Trailer
        </button>
      </div>

      {/* أزرار الأسهم يمين وشمال */}
      <button 
        onClick={() => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)} 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 hover:bg-indigo-600 text-white transition z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setCurrentIndex((prev) => (prev + 1) % movies.length)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 hover:bg-indigo-600 text-white transition z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};