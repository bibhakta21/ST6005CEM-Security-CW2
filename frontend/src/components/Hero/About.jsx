import React from "react";
import { ShieldCheck, Users, Sparkles, Globe, Smile, TrendingUp } from "lucide-react";

import model1 from "../../assets/model1.png";
import model2 from "../../assets/model7.png";
import fabric from "../../assets/fabric1.png";
import global from "../../assets/fabric1.png";

const AboutUs = () => {
  return (
    <div className="bg-white py-20 px-6 lg:px-12 font-[Poppins]">
      {/* Intro */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Redefining Fashion with Purpose
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          At NepalWears, we believe clothing is more than just fabric — it's an expression of identity, culture, and confidence. Our journey is rooted in empowering individuality with timeless fashion that blends tradition and innovation.
        </p>
      </div>

      {/* Image Collage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24 items-center">
        {/* Left: Tall image */}
        <img
          src={model1}
          alt="NepalWears Model 1"
          className="rounded-3xl object-cover shadow-xl w-full h-[500px] md:h-[550px]"
        />

        {/* Right: Two stacked images */}
        <div className="flex flex-col gap-6 h-full justify-center">
          <img
            src={model2}
            alt="NepalWears Model 2"
            className="rounded-3xl object-cover shadow-xl w-full h-[260px]"
          />
          <img
            src={fabric}
            alt="Premium Fabric"
            className="rounded-3xl object-cover shadow-xl w-full h-[260px]"
          />
        </div>
      </div>

      {/* Stats and Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto text-center mb-24">
        {[
          { icon: <Users className="w-6 h-6 text-gray-700 mb-2" />, label: "75K+", sub: "Happy Shoppers" },
          { icon: <Globe className="w-6 h-6 text-gray-700 mb-2" />, label: "50+", sub: "Countries Reached" },
          { icon: <Sparkles className="w-6 h-6 text-gray-700 mb-2" />, label: "500+", sub: "Styles Curated" },
          { icon: <TrendingUp className="w-6 h-6 text-gray-700 mb-2" />, label: "99%", sub: "Positive Feedback" },
          { icon: <ShieldCheck className="w-6 h-6 text-gray-700 mb-2" />, label: "Secure", sub: "Shopping Guarantee" },
          { icon: <Smile className="w-6 h-6 text-gray-700 mb-2" />, label: "100%", sub: "Style Confidence" }
        ].map((item, i) => (
          <div key={i}>
            <div className="flex flex-col items-center">
              {item.icon}
              <h4 className="text-xl font-semibold text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Vision Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            We aim to become the leading fashion destination for modern wardrobes. With sustainability at heart, our vision is to inspire self-expression while supporting ethical craftsmanship from Nepal to the world.
          </p>
        </div>
        <img
          src={global}
          alt="Global Reach"
          className="rounded-3xl shadow-lg w-full h-[300px] object-cover"
        />
      </div>

      {/* CTA */}
      <div className="text-center mt-20">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Step Into Timeless Fashion with NepalWears
        </h3>
        <p className="text-gray-600 mb-6">
          Join thousands of customers who trust us to keep their style timeless and their wardrobe elevated.
        </p>
        <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition duration-300">
          Explore Our Collection
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
