import React from 'react';

type TimelineNodeProps = {
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  index: number;
  isLast?: boolean;
};

export function TimelineNode({ 
  title, 
  icon: Icon, 
  isActive, 
  onClick, 
  index,
  isLast = false 
}: TimelineNodeProps) {
  return (
    <div className={`relative flex flex-col items-center transform transition-all duration-300 px-2 ${
      isActive ? 'translate-y-[-5px]' : ''
    } min-w-[80px] xs:min-w-[100px] sm:min-w-[140px] flex-shrink-0`}>
      <button
        onClick={onClick}
        className={`relative z-10 p-2 sm:p-4 rounded-lg sm:rounded-full transition-all duration-300 w-[40px] h-[40px] sm:w-[56px] sm:h-[56px] flex items-center justify-center ${
          isActive 
            ? 'bg-blue-600 text-white scale-110' 
            : 'bg-white text-blue-600 hover:bg-blue-50'
        } shadow-lg hover:shadow-xl`}
      >
        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
      </button>
      <p className={`mt-2 text-[10px] xs:text-xs sm:text-sm font-medium text-center ${
        isActive ? 'text-blue-600' : 'text-gray-600'
      }`}>
        {title}
      </p>
    </div>
  );
}