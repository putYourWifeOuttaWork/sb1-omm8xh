import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-element mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-xxs italic text-gray-600 dark:text-gray-400 space-y-4">
          <p>
            This options trading algorithm provides guidance based on common market scenarios and predetermined rules. 
            However, financial markets are complex and dynamic systems that can present unexpected situations.
          </p>
          
          <div className="space-y-2">
            <p>Users should be aware that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rare market events, extreme volatility, or unusual circumstances may create situations not explicitly covered by these trading rules.</li>
              <li>Corporate actions (splits, mergers, special dividends), market-wide circuit breakers, or trading halts may require manual intervention.</li>
              <li>Technical constraints such as option chain availability, strike price limitations, or liquidity issues may prevent execution of the ideal trading action.</li>
              <li>The algorithm assumes normal market conditions and standard option chain structures.</li>
              <li>This system is designed as a decision support tool and should not be used as an autonomous trading system.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p>Users of this system should always:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Monitor positions regularly</li>
              <li>Understand their total risk exposure</li>
              <li>Be prepared for manual intervention when necessary</li>
              <li>Consult with financial professionals regarding their specific situation</li>
              <li>Maintain appropriate position sizes and risk management protocols</li>
            </ul>
          </div>

          <p><b>
            Past performance does not guarantee future results. Trading options involves significant risk of loss and is not suitable for all investors.
          </b></p>
        </div>
      </div>
    </footer>
  );
}