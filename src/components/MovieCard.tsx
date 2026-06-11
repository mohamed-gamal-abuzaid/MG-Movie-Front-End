import React from "react";
import type { Movie } from "../types/movie";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
  isGrid?: boolean; 
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, isGrid = false }) => {
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
  const navigate = useNavigate();

  const poster = (movie as any)?.poster_path || movie?.posterPath;
  const ratingValue = (movie as any)?.vote_average || movie?.rating;
  const releaseDateValue = (movie as any)?.release_date || movie?.releaseDate;

  return (
    <div 
      onClick={() => navigate(`/movie/${movie.id}`)}
      /* 💡 لقطة السينيور: لو في الـ Grid بياخد w-full، ولو في الـ Row بياخد العرض الثابت القديم */
      className={`group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-600/20 border border-slate-200 dark:border-slate-800/60 cursor-pointer ${
        isGrid ? "w-full" : "flex-none w-[140px] sm:w-[180px] md:w-[210px]"
      }`}
    >
      
      {/* البوستر */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img
          src={poster ? `${TMDB_IMAGE_BASE}${poster}` : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=500"}
          alt={movie.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* شارة التقييم */}
        <div className="absolute top-2 left-2 flex items-center bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] sm:text-xs font-black px-2 py-1 rounded-lg border border-slate-800">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current mr-1" />
          <span>{ratingValue ? Number(ratingValue).toFixed(1) : "0.0"}</span>
        </div>
      </div>

      {/* التفاصيل السفلية */}
      <div className="p-3 bg-white dark:bg-slate-900">
        <h3 className="text-xs sm:text-sm font-bold truncate text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
          {releaseDateValue && releaseDateValue.includes("-")
            ? releaseDateValue.split("-")[0]
            : "N/A"}
        </p>
      </div>
    </div>
  );
};