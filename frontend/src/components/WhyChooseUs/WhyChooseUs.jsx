import React, { useState, useEffect } from 'react';
import {
  Sparkles, Clock, Users, Zap, Globe,
  Crown, Shield, Truck, RefreshCw, Award, Heart
} from 'lucide-react';

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  const advantages = [
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer service" },
    { icon: Users, title: "Expert Stylists", description: "Professional fashion consultations" },
    { icon: Zap, title: "Trend Leaders", description: "Always ahead of fashion curves" },
    { icon: Globe, title: "Global Presence", description: "Serving customers worldwide" }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative py-20 bg-white overflow-hidden">
      
      {/* Floating Icons (subtle) */}
      <div className="absolute top-1/3 right-10 text-gray-100 animate-bounce">
        <Crown className="w-12 h-12" />
      </div>
      <div className="absolute bottom-1/4 left-10 text-gray-100 animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Why Choose NepalWears?
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Experience The
            <span className="block text-gray-700">NepalWears Difference</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're not just another fashion brand. We're your partners in style — dedicated to delivering quality, trust, and timeless elegance.
          </p>
        </div>

        {/* Advantages */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Plus Many More Advantages
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((adv, i) => {
                const Icon = adv.icon;
                return (
                  <div key={i} className="text-center group hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <h4 className="text-gray-900 font-semibold mb-2">{adv.title}</h4>
                    <p className="text-gray-600 text-sm">{adv.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of stylish customers who have made NepalWears their trusted fashion destination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                Start Shopping Now
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <button className="px-8 py-4 border-2 border-gray-800 text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">5+ Years</div>
            <div className="text-gray-600">Industry Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">50k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
            <div className="text-gray-600">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
