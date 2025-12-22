import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addDownload } from '../../store/recordDownloadSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function RecordDownload() {
  const { availableRecords, downloadHistory } = useSelector((state: RootState) => state.recordDownload);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string[]>([]);
  const [format, setFormat] = useState('PDF');

  const handleDownload = () => {
    dispatch(addDownload({
      id: `D${Date.now()}`,
      recordIds: selected,
      format,
      date: new Date().toISOString(),
      size: `${(selected.length * 1.2).toFixed(1)} MB`,
    }));
    alert(`Downloading ${selected.length} records as ${format}`);
    setSelected([]);
  };

  const categories = [...new Set(availableRecords.map(r => r.category))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Download Medical Records</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Select Records</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Filter by Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 capitalize">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {availableRecords.map(record => (
              <label key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selected.includes(record.id)}
                  onChange={(e) => setSelected(e.target.checked ? [...selected, record.id] : selected.filter(id => id !== record.id))}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">{record.type}</div>
                  <div className="text-sm text-gray-600">{record.date}</div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">{record.category}</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <div className="flex gap-2">
              {['PDF', 'CCD', 'CDA'].map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2 rounded ${format === f ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleDownload} disabled={selected.length === 0} className="w-full">
            Download {selected.length} Record{selected.length !== 1 ? 's' : ''}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Download History</h2>
          <div className="space-y-3">
            {downloadHistory.map(download => (
              <div key={download.id} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{download.recordIds.length} Records</div>
                    <div className="text-sm text-gray-600">{new Date(download.date).toLocaleString()}</div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{download.format}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">{download.size}</div>
                  <Button variant="outline" size="sm">Re-download</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm text-blue-800">
              <div className="font-semibold mb-1">📋 About Export Formats</div>
              <div className="text-xs space-y-1">
                <div><strong>PDF:</strong> Human-readable document</div>
                <div><strong>CCD:</strong> Continuity of Care Document (XML)</div>
                <div><strong>CDA:</strong> Clinical Document Architecture</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
