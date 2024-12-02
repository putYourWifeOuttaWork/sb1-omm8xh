import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export function PartnershipSection() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Trading Together</h2>
      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
        <div className="flex items-center justify-center mb-4">
          <Heart className="text-pink-500" size={32} fill={agreed ? "#ec4899" : "none"} />
        </div>
        <p className="text-center text-gray-700 font-medium">
          Our Golden Rule: Never trade without your spouse's involvement
        </p>
      </div>
      <p className="text-gray-600">
        DeflationProof is built on the foundation of partnership and mutual growth. 
       We work as families and as a community to defy AI as the largest corporations begin to drive AI into your job market. What happens when AI does your job for less than you? When will it happen? Will you survive or thrive? 
      </p>
      
      <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
        <label className="flex items-start space-x-3 cursor-pointer group">
          <div className="flex-shrink-0 mt-1">
            <button
              onClick={() => setAgreed(!agreed)}
              className="focus:outline-none"
            >
              <Heart 
                size={24} 
                className={`transition-colors ${agreed ? 'text-pink-500' : 'text-gray-300 group-hover:text-pink-200'}`}
                fill={agreed ? "#ec4899" : "none"}
              />
            </button>
          </div>
          <span className="text-sm text-gray-600 leading-relaxed">
            I agree to follow the Golden Rule of transparency and teamwork. I will always work with my wife. 
            We will log our actual PnL each month, together. We will make trades together and agree that we 
            should do so. We will aim to follow the TradFiFam best practices if it is suitable to our situation. 
            We will not give up, because Consistency and Gratitude are how compound interest works.
          </span>
        </label>
      </div>

      {agreed && (
        <div className="flex justify-center mt-6 animate-fade-in">
          <a
            href="https://tradFiWife.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full 
              transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Now
          </a>
        </div>
      )}
    </div>
  );
}