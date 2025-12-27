import React, { useMemo } from 'react';
import { ResponsiveContainer, Tooltip } from 'recharts';

interface SankeyNode {
  id: string;
  name: string;
  color?: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  label?: string;
}

interface SankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  title: string;
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export function SankeyChart({
  nodes,
  links,
  title,
  width = 800,
  height = 400,
  nodeWidth = 20,
  nodePadding = 10,
}: SankeyChartProps) {
  const { layout, maxValue } = useMemo(() => {
    // Create node map for quick lookup
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // Calculate node positions and dimensions
    const nodePositions = new Map<string, { x: number; y: number; height: number; value: number }>();

    // Group nodes by their role (source vs target)
    const sources = new Set(links.map(link => link.source));
    const targets = new Set(links.map(link => link.target));
    const intermediates = new Set([...sources].filter(x => targets.has(x)));

    // Calculate column positions
    const columns = [
      [...sources].filter(x => !intermediates.has(x)), // Pure sources
      [...intermediates], // Intermediate nodes
      [...targets].filter(x => !intermediates.has(x)), // Pure targets
    ].filter(col => col.length > 0);

    const columnWidth = (width - nodeWidth) / (columns.length - 1 || 1);

    // Calculate node positions within columns
    columns.forEach((columnNodes, columnIndex) => {
      const columnX = columnIndex * columnWidth;
      const totalValue = columnNodes.reduce((sum, nodeId) => {
        const outgoing = links
          .filter(link => link.source === nodeId)
          .reduce((sum, link) => sum + link.value, 0);
        const incoming = links
          .filter(link => link.target === nodeId)
          .reduce((sum, link) => sum + link.value, 0);
        return sum + Math.max(outgoing, incoming);
      }, 0);

      let currentY = (height - (totalValue * height) / maxValue) / 2;

      columnNodes.forEach(nodeId => {
        const node = nodeMap.get(nodeId);
        if (!node) return;

        const outgoing = links
          .filter(link => link.source === nodeId)
          .reduce((sum, link) => sum + link.value, 0);
        const incoming = links
          .filter(link => link.target === nodeId)
          .reduce((sum, link) => sum + link.value, 0);
        const nodeValue = Math.max(outgoing, incoming);
        const nodeHeight = (nodeValue * height) / maxValue;

        nodePositions.set(nodeId, {
          x: columnX,
          y: currentY,
          height: nodeHeight,
          value: nodeValue,
        });

        currentY += nodeHeight + nodePadding;
      });
    });

    const allValues = links.map(link => link.value);
    const maxVal = Math.max(...allValues, 1);

    return { layout: nodePositions, maxValue: maxVal };
  }, [nodes, links, width, height, nodeWidth, nodePadding]);

  const getNodeColor = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId);
    return node?.color || '#2196F3';
  };

  const getLinkPath = (link: SankeyLink): string => {
    const sourcePos = layout.get(link.source);
    const targetPos = layout.get(link.target);

    if (!sourcePos || !targetPos) return '';

    const sourceY = sourcePos.y + (link.value / sourcePos.value) * sourcePos.height;
    const targetY = targetPos.y + (link.value / targetPos.value) * targetPos.height;

    const curvature = 0.5;
    const midX = (sourcePos.x + nodeWidth + targetPos.x) / 2;

    return `M ${sourcePos.x + nodeWidth} ${sourceY}
            C ${midX} ${sourceY} ${midX} ${targetY} ${targetPos.x} ${targetY}
            L ${targetPos.x} ${targetY + (link.value / targetPos.value) * targetPos.height}
            C ${midX} ${targetY + (link.value / targetPos.value) * targetPos.height}
              ${midX} ${sourceY + (link.value / sourcePos.value) * sourcePos.height}
              ${sourcePos.x + nodeWidth} ${sourceY + (link.value / sourcePos.value) * sourcePos.height}
            Z`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={height}>
        <svg width={width} height={height}>
          {/* Links */}
          <g>
            {links.map((link, index) => (
              <path
                key={`link-${index}`}
                d={getLinkPath(link)}
                fill={getNodeColor(link.source)}
                fillOpacity={0.3}
                stroke={getNodeColor(link.source)}
                strokeWidth={1}
                className="hover:fill-opacity-50 transition-all cursor-pointer"
              >
                <title>{`${link.source} → ${link.target}: ${link.value}${link.label ? ` (${link.label})` : ''}`}</title>
              </path>
            ))}
          </g>

          {/* Nodes */}
          <g>
            {Array.from(layout.entries()).map(([nodeId, position]) => {
              const node = nodes.find(n => n.id === nodeId);
              if (!node) return null;

              return (
                <g key={`node-${nodeId}`}>
                  <rect
                    x={position.x}
                    y={position.y}
                    width={nodeWidth}
                    height={position.height}
                    fill={getNodeColor(nodeId)}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    rx={4}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  <text
                    x={position.x + nodeWidth / 2}
                    y={position.y + position.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-white font-medium pointer-events-none"
                    transform={`rotate(-90, ${position.x + nodeWidth / 2}, ${position.y + position.height / 2})`}
                  >
                    {node.name.length > 10 ? `${node.name.substring(0, 10)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {nodes.map(node => (
          <div key={node.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getNodeColor(node.id) }}
            ></div>
            <span className="text-sm text-gray-700">{node.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}