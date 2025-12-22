import { Card, Button, Badge, EmptyState } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateAppointmentStatus } from '@/store/appointmentSlice';

const weekSchedule = [
  { day: 'Mon', slots: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'], isToday: false },
  { day: 'Tue', slots: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'], isToday: false },
  { day: 'Wed', slots: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'], isToday: true },
  { day: 'Thu', slots: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'], isToday: false },
  { day: 'Fri', slots: ['10:00 AM - 01:00 PM', '05:00 PM - 08:00 PM'], isToday: false },
  { day: 'Sat', slots: ['10:00 AM - 01:00 PM'], isToday: false },
];

export function DoctorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const myAppointments = appointments.filter(apt => 
    apt.doctorName === (user?.name || 'Dr. Wilson') && 
    apt.date === new Date().toISOString().split('T')[0]
  ).slice(0, 5);

  const todayStats = {
    total: 8,
    completed: 6,
    pending: 2,
    rating: 4.8
  };

  const nextAppointment = myAppointments.find(apt => apt.status === 'confirmed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Welcome back, {user?.name || 'Dr. Wilson'}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Patients Today</p>
              <p className="text-3xl font-semibold text-doctor">{todayStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-doctor/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Completed</p>
              <p className="text-3xl font-semibold text-success">{todayStats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Pending</p>
              <p className="text-3xl font-semibold text-warning">{todayStats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏱</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Avg Rating</p>
              <p className="text-3xl font-semibold text-neutral-900">{todayStats.rating}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Queue */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Today's Appointment Queue</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {myAppointments.length > 0 ? (
                  <>
                    <span className="font-medium text-doctor">{myAppointments.length} patients</span> waiting
                    {nextAppointment && <> • Next at {nextAppointment.time}</>}
                  </>
                ) : (
                  'No appointments scheduled'
                )}
              </p>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/doctor/queue')}
              aria-label="View full patient queue"
            >
              View Queue
            </Button>
          </div>

          {myAppointments.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No appointments today"
              description="You have no scheduled appointments for today. Check back later or view your full schedule."
              actionLabel="View All Appointments"
              onAction={() => navigate('/doctor/appointments')}
            />
          ) : (
            <>
              <div className="space-y-2">
                {myAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors border border-transparent hover:border-primary-200"
                    onClick={() => navigate('/doctor/consultation')}
                  >
                    <div className="flex-1">
                      <p className="text-base font-medium text-neutral-900">{apt.patientName}</p>
                      <p className="text-sm text-neutral-600">{apt.time} • {apt.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={apt.status === 'confirmed' ? 'delivered' : apt.status === 'in-progress' ? 'pending' : 'sent'}>
                        {apt.status}
                      </Badge>
                      {apt.status === 'confirmed' && (
                        <Button size="sm" onClick={(e) => { 
                          e.stopPropagation(); 
                          dispatch(updateAppointmentStatus({ id: apt.id, status: 'in-progress' }));
                          navigate('/doctor/consultation'); 
                        }}>
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate('/doctor/appointments')}
                  className="w-full"
                >
                  View All Appointments
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Doctor Profile */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-doctor/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Dr. Sarah Wilson</h2>
            <p className="text-sm text-neutral-600">Cardiologist</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <span className="text-lg">🎓</span>
              <div className="flex-1">
                <p className="text-xs text-neutral-600">Qualifications</p>
                <p className="text-sm font-medium text-neutral-900">MBBS, MD</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <span className="text-lg">📋</span>
              <div className="flex-1">
                <p className="text-xs text-neutral-600">Registration</p>
                <p className="text-sm font-medium text-neutral-900">TNMC1234</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <span className="text-lg">💼</span>
              <div className="flex-1">
                <p className="text-xs text-neutral-600">Experience</p>
                <p className="text-sm font-medium text-neutral-900">3 Years</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
              <span className="text-lg">👥</span>
              <div className="flex-1">
                <p className="text-xs text-neutral-600">Total Patients</p>
                <p className="text-sm font-medium text-neutral-900">60</p>
              </div>
            </div>
          </div>

          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/doctor/profile')}
            className="w-full"
            aria-label="Edit your profile"
          >
            Edit Profile
          </Button>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Weekly Schedule</h2>
          <Button 
            variant="tertiary" 
            size="sm"
            onClick={() => navigate('/doctor/profile')}
            aria-label="Manage your schedule"
          >
            Manage
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {weekSchedule.map((schedule) => (
            <div 
              key={schedule.day} 
              className={`p-3 rounded-lg border-2 transition-colors ${
                schedule.isToday 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="text-center">
                <p className={`text-sm font-semibold mb-2 ${
                  schedule.isToday ? 'text-primary-700' : 'text-neutral-900'
                }`}>
                  {schedule.day}
                  {schedule.isToday && <span className="ml-1 text-xs">(Today)</span>}
                </p>
                <div className="space-y-1">
                  {schedule.slots.map((slot, idx) => (
                    <p key={idx} className="text-xs text-neutral-600">{slot}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
