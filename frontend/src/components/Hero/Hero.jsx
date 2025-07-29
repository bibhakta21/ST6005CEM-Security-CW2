import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import fashion from "../../assets/man1.png";
import fashion2 from "../../assets/model3.png"; // ← Your second collage image

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative py-16 lg:py-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-24 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/3 left-10 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Large Star Decoration */}
      <div className="absolute top-1/4 right-1/3 text-white/20 transform rotate-12">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-sm mb-6 hover:bg-white/30 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Trendy Collections 🔥
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Fashion Give
              <span className="block text-gray-900">Impression</span>
            </h1>

            <div className="border-l-4 border-cyan-400 pl-6 mb-8">
              <p className="text-lg text-white/90 leading-relaxed">
                Fashion is a part of daily air and it changes all the time, with all the events. Fashion give impression.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button className="group px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                SHOP NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button className="group px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-3">
                <Play className="w-5 h-5 fill-white" />
                What's Trending?
              </button>
            </div>
          </div>

          {/* Right - Main and Secondary Image */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative w-fit mx-auto">
              
              {/* Background shadow image */}
              <img 
                src={fashion}
                alt="Fashion Background"
                className="absolute top-6 left-6 h-[460px] w-auto object-cover rounded-2xl opacity-30 scale-[0.92] blur-[1px] shadow-md border border-white/10 z-0"
              />

              {/* Main Image */}
              <img 
                src={fashion}
                alt="Main Fashion"
                className="relative z-10 h-[480px] w-auto object-cover rounded-2xl shadow-xl border border-white/20"
              />

              {/* Second image for collage effect */}
              <img
                src={fashion2}
                alt="Collage Side Model"
                className="absolute top-12 -right-44 h-[360px] w-auto object-cover rounded-2xl shadow-lg border border-white/20 z-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/10 to-transparent" />
      <div className="absolute bottom-16 right-16 w-10 h-10 border-4 border-white/20 rounded-full animate-pulse" />
      <div className="absolute bottom-28 right-28 w-5 h-5 bg-white/20 rounded-full animate-bounce" />
    </div>
  );
};

export default Hero;
