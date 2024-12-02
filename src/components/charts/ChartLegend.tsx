import React from 'react';

interface ChartLegendProps {
  padding: number;
}

export function ChartLegend({ padding }: ChartLegendProps) {
  return (
    <g transform={`translate(${padding}, 10)`}>
      <circle cx="0" cy="0" r="4" fill="#2563eb" />
      <text x="15" y="4" className="text-sm fill-gray-700">Account Liquidity</text>
      
      <circle cx="145" cy="0" r="4" fill="#ec4899" />
      <text x="160" y="4" className="text-sm fill-gray-700">Monthly Income</text>
      
      <circle cx="290" cy="0" r="4" fill="#dc2626" />
      <text x="305" y="4" className="text-sm fill-gray-700">Target Income</text>
    </g>
  );
}