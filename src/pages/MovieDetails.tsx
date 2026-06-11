import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieApi } from "../services/api";
import { Star, Clock, Calendar, ArrowLeft, Play } from "lucide-react";

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await movieApi.getMovieDetails(Number(id));
          setMovie(data);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500 font-bold animate-pulse">
        Loading Movie Masterpiece...
      </div>
    );
  }

  if (!movie) return <div className="text-center p-10">Movie not found!</div>;

  const TMDB_IMAGE_ORIGINAL = "https://image.tmdb.org/t/p/original";
  const TMDB_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";

  // استخراج الـ Trailer (بندور على فيديو من نوع Trailer على يوتيوب)
  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const cast = movie.credits?.cast?.slice(0, 10) || []; // أول 10 ممثلين

  return (
    <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* الـ Hero Section مع الخلفية المغبشة */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-105"
          style={{ backgroundImage: `url(${TMDB_IMAGE_ORIGINAL}${movie.backdrop_path || movie.backdropPath})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/70" />
        
        {/* زرار الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-slate-900/80 text-white px-4 py-2 rounded-xl backdrop-blur-md hover:bg-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* محتوى تفاصيل الفيلم الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* البوستر الطولي */}
          <div className="w-[220px] md:w-[300px] flex-none rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <img
              src={`${TMDB_IMAGE_W500}${movie.poster_path || movie.posterPath}`}
              alt={movie.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* البيانات النصية */}
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{movie.title}</h1>
            
            {/* الشارات (Badges) */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <div className="flex items-center text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{(movie.vote_average || movie.rating)?.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-slate-500 bg-slate-500/10 px-3 py-1 rounded-lg dark:text-slate-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{(movie.release_date || movie.releaseDate)?.split("-")[0]}</span>
              </div>
            </div>

            {/* التصنيفات (Genres) */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <span key={genre.id} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* قصة الفيلم */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold border-l-4 border-indigo-500 pl-2">Storyline</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                {movie.overview || movie.description}
              </p>
            </div>
          </div>
        </div>

        {/* قسم الـ Trailer (يفضل عرضه إذا وجد) */}
        {trailer && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-indigo-500 pl-2">Official Trailer</h2>
            <div className="aspect-video w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Movie Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* قسم الـ Cast (الممثلين) */}
        {cast.length > 0 && (
          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-indigo-500 pl-2">Top Billed Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {cast.map((actor: any) => (
                <div key={actor.id} className="flex-none w-[120px] text-center space-y-2">
                  <div className="w-[120px] h-[150px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={actor.profile_path ? `${TMDB_IMAGE_W500}${actor.profile_path}` : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-bold line-clamp-1">{actor.name}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};