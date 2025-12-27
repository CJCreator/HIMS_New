import { useRef, useState, useEffect, useCallback, useMemo, CSSProperties } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number; // Optional for variable height
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  estimatedItemHeight?: number; // For variable height estimation
  onEndReached?: () => void; // For infinite scroll
  endThreshold?: number;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  estimatedItemHeight = 50,
  onEndReached,
  endThreshold = 100,
  className,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeightsRef = useRef<Map<number, number>>(new Map());

  // Use fixed height if provided, otherwise estimate
  const actualItemHeight = itemHeight || estimatedItemHeight;

  // Calculate total height
  const totalHeight = useMemo(() => {
    if (itemHeight) {
      return items.length * itemHeight;
    }
    // For variable height, sum measured heights or use estimates
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += itemHeightsRef.current.get(i) || estimatedItemHeight;
    }
    return height;
  }, [items.length, itemHeight, estimatedItemHeight]);

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (itemHeight) {
      // Fixed height calculation
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const end = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
      return {
        startIndex: start,
        endIndex: end,
        offsetY: start * itemHeight,
      };
    } else {
      // Variable height calculation
      let currentHeight = 0;
      let start = 0;
      let end = items.length - 1;

      // Find start index
      for (let i = 0; i < items.length; i++) {
        const height = itemHeightsRef.current.get(i) || estimatedItemHeight;
        if (currentHeight + height > scrollTop - overscan * estimatedItemHeight) {
          start = Math.max(0, i - overscan);
          break;
        }
        currentHeight += height;
      }

      // Find end index
      let visibleHeight = 0;
      for (let i = start; i < items.length; i++) {
        const height = itemHeightsRef.current.get(i) || estimatedItemHeight;
        visibleHeight += height;
        if (visibleHeight > containerHeight + overscan * estimatedItemHeight) {
          end = Math.min(items.length - 1, i + overscan);
          break;
        }
      }

      return {
        startIndex: start,
        endIndex: end,
        offsetY: Array.from(itemHeightsRef.current.entries())
          .filter(([index]) => index < start)
          .reduce((sum, [, height]) => sum + height, 0),
      };
    }
  }, [scrollTop, containerHeight, items.length, itemHeight, overscan, estimatedItemHeight]);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Trigger onEndReached for infinite scroll
    if (onEndReached && totalHeight - newScrollTop - containerHeight < endThreshold) {
      onEndReached();
    }
  }, [onEndReached, totalHeight, containerHeight, endThreshold]);

  // Measure item heights for variable height lists
  const measureItemHeight = useCallback((index: number, height: number) => {
    if (!itemHeight && itemHeightsRef.current.get(index) !== height) {
      itemHeightsRef.current.set(index, height);
      // Force re-render to recalculate positions
      setScrollTop(prev => prev + 0.0001);
    }
  }, [itemHeight]);

  // Render item with height measurement
  const renderItemWithMeasurement = useCallback((item: T, index: number) => {
    const globalIndex = startIndex + index;
    return (
      <div
        key={globalIndex}
        style={{
          height: itemHeight || 'auto',
          minHeight: itemHeight || estimatedItemHeight,
        }}
        ref={(el) => {
          if (el && !itemHeight) {
            const height = el.offsetHeight;
            if (height > 0) {
              measureItemHeight(globalIndex, height);
            }
          }
        }}
      >
        {renderItem(item, globalIndex)}
      </div>
    );
  }, [startIndex, itemHeight, estimatedItemHeight, renderItem, measureItemHeight]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={className}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
        ...(!className && {
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
        }),
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => renderItemWithMeasurement(item, index))}
        </div>
      </div>
    </div>
  );
}
