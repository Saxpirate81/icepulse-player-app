import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ProgressChart = ({ data, title, height = 120 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-zinc-500 text-sm">
        No data available yet
      </div>
    );
  }

  const values = data.map(d => d.score || d.value || 0);
  const maxValue = Math.max(...values, 100);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  // Calculate trend
  const trend = values.length >= 2
    ? values[values.length - 1] - values[0]
    : 0;

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-zinc-400';

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-white font-bold text-sm uppercase">{title}</h4>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={16} />
            <span className="text-xs font-bold">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => (
            <line
              key={val}
              x1="0"
              y1={`${100 - ((val - minValue) / range) * 100}%`}
              x2="100%"
              y2={`${100 - ((val - minValue) / range) * 100}%`}
              stroke="rgba(113, 113, 122, 0.2)"
              strokeWidth="1"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="rgb(6, 182, 212)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1 || 1)) * 100;
              const y = 100 - ((d.score || d.value || 0 - minValue) / range) * 100;
              return `${x}%,${y}%`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1 || 1)) * 100;
            const y = 100 - ((d.score || d.value || 0 - minValue) / range) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="rgb(6, 182, 212)"
                className="hover:r-6 transition-all"
              />
            );
          })}
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] text-zinc-500 mt-2">
        <span>{data[0]?.date ? new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Start'}</span>
        <span>{data[data.length - 1]?.date ? new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Latest'}</span>
      </div>
    </div>
  );
};

export default ProgressChart;

