import React, { useMemo } from 'react';
import { Tooltip, ResponsiveContainer } from 'recharts';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  xCategories: string[];
  yCategories: string[];
  title: string;
  colorScale?: (value: number, min: number, max: number) => string;
  width?: number;
  height?: number;
  showValues?: boolean;
}

const defaultColorScale = (value: number, min: number, max: number): string => {
  const normalized = (value - min) / (max - min);
  if (normalized < 0.25) return '#E3F2FD'; // Light blue
  if (normalized < 0.5) return '#2196F3';  // Blue
  if (normalized < 0.75) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export function HeatmapChart({
  data,
  xCategories,
  yCategories,
  title,
  colorScale = defaultColorScale,
  width = 800,
  height = 400,
  showValues = false,
}: HeatmapChartProps) {
  const { minValue, maxValue, dataMap } = useMemo(() => {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const map = new Map<string, HeatmapData>();
    data.forEach(item => {
      map.set(`${item.x}-${item.y}`, item);
    });

    return { minValue: min, maxValue: max, dataMap: map };
  }, [data]);

  const cellWidth = width / xCategories.length;
  const cellHeight = height / yCategories.length;

  const getCellData = (x: string, y: string): HeatmapData | null => {
    return dataMap.get(`${x}-${y}`) || null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>Low</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: defaultColorScale(0, 0, 1) }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: defaultColorScale(0.33, 0, 1) }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: defaultColorScale(0.66, 0, 1) }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: defaultColorScale(1, 0, 1) }}></div>
        </div>
        <span>High</span>
      </div>

      <ResponsiveContainer width="100%" height={height + 60}>
        <svg width={width} height={height + 60}>
          {/* Y-axis labels */}
          <g>
            {yCategories.map((category, index) => (
              <text
                key={`y-${index}`}
                x={-10}
                y={index * cellHeight + cellHeight / 2 + 30}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-xs fill-gray-600"
                transform={`rotate(-90, -10, ${index * cellHeight + cellHeight / 2 + 30})`}
              >
                {category}
              </text>
            ))}
          </g>

          {/* Heatmap cells */}
          <g transform="translate(30, 30)">
            {xCategories.map((xCat, xIndex) =>
              yCategories.map((yCat, yIndex) => {
                const cellData = getCellData(xCat, yCat);
                const color = cellData
                  ? colorScale(cellData.value, minValue, maxValue)
                  : '#F5F5F5';

                return (
                  <g key={`${xCat}-${yCat}`}>
                    <rect
                      x={xIndex * cellWidth}
                      y={yIndex * cellHeight}
                      width={cellWidth}
                      height={cellHeight}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={1}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <title>
                        {cellData
                          ? `${xCat} × ${yCat}: ${cellData.value}${cellData.label ? ` (${cellData.label})` : ''}`
                          : `${xCat} × ${yCat}: No data`
                        }
                      </title>
                    </rect>

                    {showValues && cellData && (
                      <text
                        x={xIndex * cellWidth + cellWidth / 2}
                        y={yIndex * cellHeight + cellHeight / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-gray-900 font-medium pointer-events-none"
                      >
                        {cellData.value}
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </g>

          {/* X-axis labels */}
          <g transform={`translate(30, ${height + 35})`}>
            {xCategories.map((category, index) => (
              <text
                key={`x-${index}`}
                x={index * cellWidth + cellWidth / 2}
                y={0}
                textAnchor="middle"
                dominantBaseline="hanging"
                className="text-xs fill-gray-600"
                transform={`rotate(-45, ${index * cellWidth + cellWidth / 2}, 0)`}
              >
                {category}
              </text>
            ))}
          </g>
        </svg>
      </ResponsiveContainer>
    </div>
  );
}