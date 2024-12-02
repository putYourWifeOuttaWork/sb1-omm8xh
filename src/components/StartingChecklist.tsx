import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
  input?: string;
  understanding?: boolean;
};

export function StartingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'broker',
      text: 'Open a brokerage account',
      checked: false,
      input: ''
    },
    {
      id: 'tier3',
      text: 'Get approved for Tier 3 Options Trading',
      checked: false,
      understanding: false
    },
    {
      id: 'fundamentals',
      text: 'Learn Options fundamentals',
      checked: false
    },
    {
      id: 'mag7',
      text: 'Choose your favorite Mag7 stock',
      checked: false
    },
    {
      id: 'community',
      text: 'Join the TradFi Family community',
      checked: false
    }
  ]);

  const handleCheck = (id: string) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, input: e.target.value } : item
    ));
  };

  const handleUnderstandingChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, understanding: e.target.checked } : item
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Path to Financial Freedom</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-3">
            <div 
              className={`flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                item.checked ? 'bg-green-50' : ''
              }`}
              onClick={() => handleCheck(item.id)}
            >
              <CheckCircle2 
                className={`flex-shrink-0 transition-colors duration-200 ${
                  item.checked ? 'text-green-500' : 'text-gray-300'
                }`}
                fill={item.checked ? "currentColor" : "none"}
                size={20}
              />
              <span className={`text-gray-700 ${item.checked ? 'line-through text-gray-500' : ''}`}>
                {item.text}
              </span>
            </div>

            {item.checked && item.id === 'broker' && (
              <div className="ml-8 animate-fade-in">
                <input
                  type="text"
                  placeholder="What broker did you choose?"
                  value={item.input}
                  onChange={(e) => handleInputChange(e, item.id)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {item.checked && item.id === 'tier3' && (
              <div className="ml-8 p-4 bg-orange-50 rounded-lg border border-orange-100 animate-fade-in">
                <label className="flex items-start space-x-3 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={item.understanding || false}
                    onChange={(e) => handleUnderstandingChange(e, item.id)}
                    className="mt-1.5"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="text-orange-500" size={16} />
                      <span className="font-medium text-orange-700">Risk Acknowledgment</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      I understand that Tier 3 Options enable margin and selling naked options. 
                      I acknowledge the risks of leverage and understand that TradFiWife.com does 
                      not engage in high-risk trading, but requires Tier 3 accounts to execute strategies.
                    </p>
                    <p className="text-sm">
                      <a 
                        href="https://tastytrade.com/learn/accounts/margin-vs-cash-accounts/#trading-levels"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Tasty Level Basics
                      </a>
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}