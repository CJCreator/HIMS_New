/**
 * Test Runner Component
 * Comprehensive testing dashboard for development
 * Usage: Add <TestRunner /> to App.tsx in development mode
 */

import React, { useState } from 'react';
import { perfMonitor } from '../utils/performanceMonitor';
import { runAccessibilityAudit } from '../utils/accessibilityTester';
import { runCompatibilityTest } from '../utils/browserCompatibility';
import { FaFlask, FaBolt, FaUniversalAccess, FaGlobe, FaRocket, FaHourglass, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

export const TestRunner: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string>('');

  const runPerformanceTest = async () => {
    setLoading(true);
    setActiveTest('performance');
    
    const fpsTest = await perfMonitor.measureFPS(3000);
    const memory = perfMonitor.measureMemory();
    
    setResults({
      type: 'performance',
      fps: fpsTest,
      memory,
      passed: fpsTest.avgFPS >= 55,
    });
    
    setLoading(false);
  };

  const runA11yTest = () => {
    setLoading(true);
    setActiveTest('accessibility');
    
    const auditResults = runAccessibilityAudit();
    
    setResults({
      type: 'accessibility',
      ...auditResults,
      passed: auditResults.score >= 90,
    });
    
    setLoading(false);
  };

  const runBrowserTest = async () => {
    setLoading(true);
    setActiveTest('compatibility');
    
    const compatResults = await runCompatibilityTest();
    
    setResults({
      type: 'compatibility',
      ...compatResults,
      passed: compatResults.compatible >= 80,
    });
    
    setLoading(false);
  };

  const runAllTests = async () => {
    await runPerformanceTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    runA11yTest();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await runBrowserTest();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-neutral-200 p-4 w-96 max-h-[600px] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <FaFlask /> Test Runner
        </h3>
        <button
          onClick={() => setResults(null)}
          className="text-neutral-400 hover:text-neutral-600"
        >
          <FaTimes />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={runPerformanceTest}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading && activeTest === 'performance' ? (
            <><FaHourglass className="inline mr-2" />Testing...</>
          ) : (
            <><FaBolt className="inline mr-2" />Performance Test</>
          )}
        </button>

        <button
          onClick={runA11yTest}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading && activeTest === 'accessibility' ? (
            <><FaHourglass className="inline mr-2" />Testing...</>
          ) : (
            <><FaUniversalAccess className="inline mr-2" />Accessibility Test</>
          )}
        </button>

        <button
          onClick={runBrowserTest}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading && activeTest === 'compatibility' ? (
            <><FaHourglass className="inline mr-2" />Testing...</>
          ) : (
            <><FaGlobe className="inline mr-2" />Compatibility Test</>
          )}
        </button>

        <button
          onClick={runAllTests}
          disabled={loading}
          className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 disabled:opacity-50 text-sm font-medium"
        >
          {loading ? (
            <><FaHourglass className="inline mr-2" />Running All Tests...</>
          ) : (
            <><FaRocket className="inline mr-2" />Run All Tests</>
          )}
        </button>
      </div>

      {results && (
        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-700">
              {results.type.toUpperCase()} RESULTS
            </span>
            <span className={`text-sm font-bold flex items-center gap-1 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.passed ? <><FaCheckCircle /> PASSED</> : <><FaTimesCircle /> FAILED</>}
            </span>
          </div>

          {results.type === 'performance' && (
            <div className="text-xs space-y-1 text-neutral-600">
              <div>Avg FPS: <span className="font-mono font-semibold">{results.fps.avgFPS}</span></div>
              <div>Min FPS: <span className="font-mono font-semibold">{results.fps.minFPS}</span></div>
              <div>Max FPS: <span className="font-mono font-semibold">{results.fps.maxFPS}</span></div>
              {results.memory && (
                <div>Memory: <span className="font-mono font-semibold">{results.memory.usedJSHeapSize}MB</span></div>
              )}
            </div>
          )}

          {results.type === 'accessibility' && (
            <div className="text-xs space-y-1 text-neutral-600">
              <div>Score: <span className="font-mono font-semibold">{results.score}/100</span></div>
              <div>ARIA Issues: <span className="font-mono font-semibold">{results.aria.missing}</span></div>
              <div>Focus Issues: <span className="font-mono font-semibold">{results.focus.missing}</span></div>
              <div>Image Issues: <span className="font-mono font-semibold">{results.images.missing}</span></div>
            </div>
          )}

          {results.type === 'compatibility' && (
            <div className="text-xs space-y-1 text-neutral-600">
              <div>Browser: <span className="font-mono font-semibold">{results.browser.name} {results.browser.version}</span></div>
              <div>Score: <span className="font-mono font-semibold">{results.compatible}/100</span></div>
              <div>Framer Motion: <span className="font-mono font-semibold">{results.framerMotion ? <FaCheckCircle className="inline text-green-600" /> : <FaTimesCircle className="inline text-red-600" />}</span></div>
              <div>Inter Font: <span className="font-mono font-semibold">{results.interFont ? <FaCheckCircle className="inline text-green-600" /> : <FaTimesCircle className="inline text-red-600" />}</span></div>
            </div>
          )}

          <div className="mt-2 text-xs text-neutral-500">
            Check console for detailed results
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-neutral-200 text-xs text-neutral-500">
        💡 Open DevTools Console for detailed logs
      </div>
    </div>
  );
};
