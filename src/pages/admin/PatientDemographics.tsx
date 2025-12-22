import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';

export default function PatientDemographics() {
  const { ageDistribution, genderDistribution, visitFrequency } = useSelector((state: RootState) => state.demographics);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Demographics</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
          <div className="space-y-3">
            {ageDistribution.map(age => (
              <div key={age.range}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{age.range} years</span>
                  <span className="text-gray-600">{age.count} ({age.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-3">
                  <div className="bg-blue-500 h-3 rounded" style={{ width: `${age.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
          <div className="flex items-center justify-center h-48">
            {genderDistribution.map(g => (
              <div key={g.gender} className="flex-1 text-center">
                <div className={`text-6xl font-bold ${g.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'}`}>
                  {g.percentage}%
                </div>
                <div className="text-lg font-semibold mt-2">{g.gender}</div>
                <div className="text-sm text-gray-600">{g.count} patients</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Visit Frequency</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-3xl font-bold text-green-600">{visitFrequency.regular}</div>
            <div className="text-sm text-gray-600">Regular Patients</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-3xl font-bold text-blue-600">{visitFrequency.occasional}</div>
            <div className="text-sm text-gray-600">Occasional Patients</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-3xl font-bold text-purple-600">{visitFrequency.firstTime}</div>
            <div className="text-sm text-gray-600">First-Time Patients</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
