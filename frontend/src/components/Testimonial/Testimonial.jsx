import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';

const Testimonial = () => {
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The quality of their clothing is absolutely incredible! Every piece I've purchased has exceeded my expectations. The attention to detail and craftsmanship is unmatched.",
      location: "New York, NY",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Style Blogger",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I've been shopping here for over two years now, and they never disappoint. Their trendy collections always keep me ahead of the fashion curve. Highly recommended!",
      location: "Los Angeles, CA",
      verified: true
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Professional Model",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As someone who works in fashion, I'm very particular about quality and style. This brand delivers on both fronts consistently. Their pieces photograph beautifully too!",
      location: "Miami, FL",
      verified: true
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Business Executive",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Perfect for my professional wardrobe. The fit is impeccable and the materials feel premium. I always receive compliments when wearing their pieces to important meetings.",
      location: "Chicago, IL",
      verified: true
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative py-20 bg-white overflow-hidden">
      
      {/* Floating Icons (subtle) */}
      <div className="absolute top-1/4 right-1/4 text-gray-200 animate-bounce">
        <Heart className="w-8 h-8" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 text-gray-100 animate-pulse">
        <ShoppingBag className="w-6 h-6" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium text-sm mb-4">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            Customer Stories
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Our 
            <span className="block text-gray-700">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their fashion needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">50k+</div>
            <div className="text-gray-500">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">4.9</div>
            <div className="text-gray-500">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">98%</div>
            <div className="text-gray-500">Would Recommend</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">24/7</div>
            <div className="text-gray-500">Customer Support</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(1, 4).map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-2xl p-6 shadow hover:shadow-md transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{testimonial.text.slice(0, 120)}..."
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
