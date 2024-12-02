import React, { useState } from 'react';
import { Users, Trophy, Calendar, Share2, HelpingHand, BookOpen, Lightbulb, ScrollText } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections: string[];
}

export function Community() {
  const [activeSection, setActiveSection] = useState('family');

  const sections: Section[] = [
    {
      id: 'family',
      title: 'The Family',
      icon: <Users className="w-6 h-6" />,
      subsections: ['General', 'Leaderboards', 'Events, AMAs, and Podcasts']
    },
    {
      id: 'sharing',
      title: 'The Sharing',
      icon: <Share2 className="w-6 h-6" />,
      subsections: ['Sharing Your Experiences', 'Help Each Other']
    },
    {
      id: 'learning',
      title: 'The Learning',
      icon: <BookOpen className="w-6 h-6" />,
      subsections: ['Technicalities', 'Philosophies', 'Reasons Why']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-2">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-white dark:bg-dark-element shadow-md'
                      : 'hover:bg-white/50 dark:hover:bg-dark-element/50'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </button>
                {activeSection === section.id && (
                  <div className="pl-9 space-y-2">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection}
                        className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 
                          hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {subsection}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-dark-element rounded-xl p-6 shadow-lg min-h-[600px]">
            <div className="text-center p-12">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our community features are under development. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}