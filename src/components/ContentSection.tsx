import React from 'react';
import { Mail, Phone, Globe2, LineChart, DollarSign, TrendingUp, Home, Shield } from 'lucide-react';
import { PartnershipSection } from './PartnershipSection';
import { StartingChecklist } from './StartingChecklist';
import { SingularityChart } from './SingularityChart';
import { ForecastChart } from './ForecastChart';
import { SingularityTimeline } from './SingularityTimeline';
import { WheelComparison } from './WheelComparison';
import { LoadingOverlay } from './LoadingOverlay';

type ContentSectionProps = {
  activeSection: number;
};

export function ContentSection({ activeSection }: ContentSectionProps) {
  const sections = [
    {
      title: "Economic Singularity 2030",
      content: (
        <div className="space-y-6">
          <center><h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">What Happens When AI Does Your Job (better than you, for less pay)? </h2></center>
          <div className="prose prose-blue max-w-none space-y-4 dark:prose-invert">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
A "Financial Singularity" is coming for you. For all of us... When Will It Happen? How Will You Survive and Thrive?
              For some, it will happen soon, for others 5 years. What will you do to survive if there's not enough pay available to keep your house? DeflationProof is the only community focused on offsetting the human labor deflation of value... We build monthly income with the best quant strategies but we have the tools and community to know what to do and when... Will you reach a level of self-generating income before that day, enough to replace your income today? God Bless You!
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">How AI Will Do Every Job For Less Than You Can Afford To Work For</h3>
            <SingularityTimeline />
            <SingularityChart />
            <p className="text-gray-600 dark:text-gray-300">
             Have you wondered what happens when AI is "smart enough"? Most people have. It's 2025, and I can tell you, It IS. Most people think they will be able to pay their fixed mortgage, because inflation makes it cheaper over time... But if your wages are near zero, how can you pay a fixed rate anything? We survive here. We Thrive. 
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Strategy",
      content: (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Our Rolling Wheel Strategy</h2>
          <div className="prose prose-blue max-w-none dark:prose-invert">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
              Understanding the difference between conventional and rolling wheel strategies is crucial for long-term success.
            </p>
            <WheelComparison />
            <p className="mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              The Rolling Wheel strategy consistently outperforms by avoiding capital-intensive assignments and maintaining steady income growth through strategic position management.
            </p>
            <ForecastChart />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 sm:p-4 rounded-lg border border-cyan-100 dark:border-cyan-800">
                <h3 className="text-base sm:text-lg font-semibold text-cyan-800 dark:text-cyan-200 mb-2">Tortoise Strategy</h3>
                <ul className="space-y-2 text-sm text-cyan-700 dark:text-cyan-300">
                  <li>• Consistent compounding monthly return</li>
                  <li>• 0.25x leverage</li>
                  <li>• Lower risk profile</li>
                  <li>• Steady, predictable growth, less management</li>
                </ul>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-3 sm:p-4 rounded-lg border border-pink-100 dark:border-pink-800">
                <h3 className="text-base sm:text-lg font-semibold text-pink-800 dark:text-pink-200 mb-2">Hare Strategy</h3>
                <ul className="space-y-2 text-sm text-pink-700 dark:text-pink-300">
                  <li>• Consistent compounding monthly return</li>
                  <li>• 0.5x leverage</li>
                  <li>• Higher risk profile</li>
                  <li>• Accelerated growth potential, more management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Getting Started",
      content: <StartingChecklist />
    },
    {
      title: "Together",
      content: <PartnershipSection />
    },
    {
      title: "Connect",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Connect With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="mailto:weisbergmm@gmail.com"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-element rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Mail className="text-accent-blue dark:text-accent-teal" />
              <span className="text-gray-600 dark:text-gray-300">weisbergmm@gmail.com</span>
            </a>
            <a
              href="tel:201-264-9169"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-element rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Phone className="text-accent-green dark:text-accent-green" />
              <span className="text-gray-600 dark:text-gray-300">201-264-9169</span>
            </a>
            <a
              href="https://manage.tradFiWife.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-element rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Globe2 className="text-accent-purple dark:text-accent-purple" />
              <span className="text-gray-600 dark:text-gray-300">Management Module</span>
            </a>
            <a
              href="https://TradFiWife.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-dark-element rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <LineChart className="text-accent-blue dark:text-accent-teal" />
              <span className="text-gray-600 dark:text-gray-300">Check Your Freedom Date</span>
            </a>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-element rounded-xl p-4 sm:p-6 shadow-lg min-h-[300px]">
      <LoadingOverlay loading={false}>
        {sections[activeSection].content}
      </LoadingOverlay>
    </div>
  );
}