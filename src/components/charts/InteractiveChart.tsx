import React, { useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { Download, ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react';

interface ChartData {
  [key: string]: any;
}

interface DrillDownConfig {
  enabled: boolean;
  levels: Array<{
    key: string;
    label: string;
    dataKey: string;
  }>;
  currentLevel: number;
}

interface CrossFilterConfig {
  enabled: boolean;
  filters: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    selectedValues: string[];
  }>;
}

interface InteractiveChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: string[];
  drillDown?: DrillDownConfig;
  crossFilter?: CrossFilterConfig;
  onDrillDown?: (level: number, data: any) => void;
  onFilterChange?: (filters: CrossFilterConfig['filters']) => void;
  exportFormats?: ('png' | 'jpg' | 'svg' | 'csv' | 'pdf')[];
  realTime?: boolean;
  height?: number;
}

const DEFAULT_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
];

export function InteractiveChart({
  data,
  type,
  title,
  xAxisKey,
  yAxisKeys,
  colors = DEFAULT_COLORS,
  drillDown,
  crossFilter,
  onDrillDown,
  onFilterChange,
  exportFormats = ['png', 'csv'],
  realTime = false,
  height = 400,
}: InteractiveChartProps) {
  const [zoomed, setZoomed] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [brushIndices, setBrushIndices] = useState<[number, number] | null>(null);

  // Apply cross-filters
  const filteredData = useMemo(() => {
    if (!crossFilter?.enabled) return data;

    return data.filter(item => {
      return crossFilter.filters.every(filter => {
        if (filter.selectedValues.length === 0) return true;
        return filter.selectedValues.includes(item[filter.key]);
      });
    });
  }, [data, crossFilter]);

  // Handle drill-down
  const handleBarClick = useCallback((data: any, index: number) => {
    if (drillDown?.enabled && onDrillDown) {
      setSelectedData(data);
      onDrillDown(drillDown.currentLevel + 1, data);
    }
  }, [drillDown, onDrillDown]);

  // Handle cross-filter changes
  const handleFilterChange = useCallback((filterKey: string, values: string[]) => {
    if (!crossFilter?.enabled || !onFilterChange) return;

    const updatedFilters = crossFilter.filters.map(filter =>
      filter.key === filterKey
        ? { ...filter, selectedValues: values }
        : filter
    );

    onFilterChange(updatedFilters);
  }, [crossFilter, onFilterChange]);

  // Export functionality
  const handleExport = useCallback(async (format: string) => {
    const chartElement = document.querySelector('.recharts-wrapper') as HTMLElement;
    if (!chartElement) return;

    switch (format) {
      case 'csv':
        exportToCSV(filteredData, title);
        break;
      case 'png':
      case 'jpg':
        await exportToImage(chartElement, format);
        break;
      default:
        console.log(`Export format ${format} not implemented`);
    }
  }, [filteredData, title]);

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium">{`${label}`}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {`${entry.dataKey}: ${entry.value}`}
                        </p>
                      ))}
                      {drillDown?.enabled && (
                        <p className="text-xs text-gray-500 mt-1">Click to drill down</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
            {zoomed && <Brush dataKey={xAxisKey} height={30} />}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
            {zoomed && <Brush dataKey={xAxisKey} height={30} />}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
            {zoomed && <Brush dataKey={xAxisKey} height={30} />}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey={yAxisKeys[0]}
              onClick={handleBarClick}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setZoomed(!zoomed)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Export options */}
          {exportFormats.length > 0 && (
            <div className="relative">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Export chart"
              >
                <Download className="w-4 h-4" />
              </button>
              {/* Export dropdown would go here */}
            </div>
          )}

          {/* Real-time indicator */}
          {realTime && (
            <div className="flex items-center gap-1 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Cross-filters */}
      {crossFilter?.enabled && (
        <div className="mb-4 flex flex-wrap gap-4">
          {crossFilter.filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                multiple
                value={filter.selectedValues}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  handleFilterChange(filter.key, values);
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart() || <div>No chart available</div>}
        </ResponsiveContainer>
      </div>

      {/* Drill-down breadcrumb */}
      {drillDown?.enabled && selectedData && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Drill-down:</span>
          {drillDown.levels.slice(0, drillDown.currentLevel + 1).map((level, index) => (
            <React.Fragment key={level.key}>
              {index > 0 && <span>→</span>}
              <span className="font-medium">{selectedData[level.dataKey]}</span>
            </React.Fragment>
          ))}
          <button
            onClick={() => {
              setSelectedData(null);
              onDrillDown?.(0, null);
            }}
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Helper functions for export
function exportToCSV(data: ChartData[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

async function exportToImage(element: HTMLElement, format: string) {
  // This would require html2canvas or similar library
  console.log(`Exporting chart as ${format}`);
  // Implementation would go here
}