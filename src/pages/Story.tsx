import React, { useState } from 'react';
import { ArrowRight, Briefcase, LineChart, CheckCircle2, Heart, HelpCircle } from 'lucide-react';
import { TimelineNode } from '../components/TimelineNode';
import { ContentSection } from '../components/ContentSection';

export function Story() {
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const nodes = [
    { title: "Intro", icon: Briefcase },
    { title: "Strategy", icon: LineChart },
    { title: "Start", icon: CheckCircle2 },
    { title: "Together", icon: Heart },
    { title: "Connect", icon: HelpCircle }
  ];

  const isFirstSection = activeSection === 0;
  const isLastSection = activeSection === nodes.length - 1;

  const handleNodeClick = (index: number) => {
    setActiveSection(index);
    // Add 200ms delay before scrolling
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Add consistent top padding */}
      <div className="pt-4 md:pt-6 overflow-hidden">
        <div className="flex flex-row flex-nowrap justify-start md:justify-center gap-2 xs:gap-4 md:gap-8 
          overflow-x-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8 no-scrollbar">
        {nodes.map((node, index) => (
          <TimelineNode
            key={index}
            title={node.title}
            icon={node.icon}
            isActive={activeSection === index}
            onClick={() => handleNodeClick(index)}
            isLast={index === nodes.length - 1}
            index={index}
          />
        ))}
      </div>
      </div>

      <div ref={contentRef} className="mt-4 sm:mt-6">
        <ContentSection activeSection={activeSection} />
      </div>

      <div className="flex justify-center space-x-2">
        {!isFirstSection && (
          <button
            onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
            className="p-2 text-accent-blue dark:text-accent-teal hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors"
            aria-label="Previous section"
          >
            <ArrowRight className="rotate-180" />
          </button>
        )}
        {!isLastSection && (
          <button
            onClick={() => setActiveSection(prev => Math.min(nodes.length - 1, prev + 1))}
            className="p-2 text-accent-blue dark:text-accent-teal hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors"
            aria-label="Next section"
          >
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}