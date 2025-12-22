import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFeedback } from '@/store/feedbackSlice';
import { Button } from './Button';

interface FeedbackFormProps {
  appointmentId: string;
  doctorName: string;
  onSubmit?: () => void;
}

export function FeedbackForm({ appointmentId, doctorName, onSubmit }: FeedbackFormProps) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [aspects, setAspects] = useState({
    waitTime: 0,
    doctorCare: 0,
    staffFriendliness: 0,
    cleanliness: 0,
    overall: 0
  });
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(addFeedback({
      patientId: 'P001',
      patientName: 'Current User',
      appointmentId,
      doctorName,
      rating,
      aspects,
      comments
    }));
    
    onSubmit?.();
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-3xl transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-neutral-300'
            } hover:text-yellow-400`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  const NPSRating = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        How likely are you to recommend us? (0-10)
      </label>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              num === rating
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-neutral-600 mt-1">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NPSRating />
      
      <StarRating
        value={aspects.waitTime}
        onChange={(v) => setAspects({ ...aspects, waitTime: v })}
        label="Wait Time"
      />
      
      <StarRating
        value={aspects.doctorCare}
        onChange={(v) => setAspects({ ...aspects, doctorCare: v })}
        label="Doctor Care & Attention"
      />
      
      <StarRating
        value={aspects.staffFriendliness}
        onChange={(v) => setAspects({ ...aspects, staffFriendliness: v })}
        label="Staff Friendliness"
      />
      
      <StarRating
        value={aspects.cleanliness}
        onChange={(v) => setAspects({ ...aspects, cleanliness: v })}
        label="Cleanliness"
      />
      
      <StarRating
        value={aspects.overall}
        onChange={(v) => setAspects({ ...aspects, overall: v })}
        label="Overall Experience"
      />

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us more about your experience..."
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Feedback
      </Button>
    </form>
  );
}
