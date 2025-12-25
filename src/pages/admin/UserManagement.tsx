import { useState } from 'react';
import { Card, Button, Input, Badge, Modal, EmptyState } from '@/components';
import { Table } from '@/components/Table';
import { UserRole } from '@/types';
import { sanitizer } from '@/utils/sanitizer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'disabled';
  lastLogin: string;
  department?: string;
  lastPasswordChange?: string;
  lastIPAddress?: string;
  deviceInfo?: string;
  location?: string;
  createdAt: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'password_change' | 'profile_update' | 'role_change';
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  location?: string;
  details?: string;
}

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Wilson', 
    email: 'sarah@hospital.com', 
    role: 'doctor', 
    status: 'active', 
    lastLogin: '2024-01-15 09:30 AM',
    department: 'Cardiology',
    lastPasswordChange: '2024-01-10 14:20 PM',
    lastIPAddress: '192.168.1.105',
    deviceInfo: 'Chrome on Windows',
    location: 'Main Building',
    createdAt: '2023-06-15 10:00 AM'
  },
  { 
    id: '2', 
    name: 'John Smith', 
    email: 'john@hospital.com', 
    role: 'nurse', 
    status: 'active', 
    lastLogin: '2024-01-14 02:15 PM',
    department: 'Emergency',
    lastPasswordChange: '2023-12-20 11:45 AM',
    lastIPAddress: '192.168.1.112',
    deviceInfo: 'Safari on iOS',
    location: 'Emergency Wing',
    createdAt: '2023-08-22 09:30 AM'
  },
  { 
    id: '3', 
    name: 'Mary Johnson', 
    email: 'mary@hospital.com', 
    role: 'receptionist', 
    status: 'inactive', 
    lastLogin: '2024-01-10 11:45 AM',
    department: 'Front Desk',
    lastPasswordChange: '2023-11-15 16:30 PM',
    lastIPAddress: '192.168.1.98',
    deviceInfo: 'Chrome on macOS',
    location: 'Main Entrance',
    createdAt: '2023-09-10 08:15 AM'
  },
  {
    id: '4',
    name: 'Dr. Robert Brown',
    email: 'robert@hospital.com',
    role: 'doctor',
    status: 'disabled',
    lastLogin: '2023-12-20 03:20 PM',
    department: 'Orthopedics',
    lastPasswordChange: '2023-12-15 10:00 AM',
    lastIPAddress: '192.168.1.87',
    deviceInfo: 'Firefox on Windows',
    location: 'Building A',
    createdAt: '2023-05-12 11:00 AM'
  },
  {
    id: '5',
    name: 'Lisa Chen',
    email: 'lisa@hospital.com',
    role: 'pharmacist',
    status: 'active',
    lastLogin: '2024-01-15 08:45 AM',
    department: 'Pharmacy',
    lastPasswordChange: '2024-01-01 12:00 PM',
    lastIPAddress: '192.168.1.156',
    deviceInfo: 'Chrome on Windows',
    location: 'Pharmacy Department',
    createdAt: '2023-07-18 02:30 PM'
  }
];

const mockUserActivities: UserActivity[] = [
  {
    id: '1',
    userId: '1',
    action: 'login',
    timestamp: '2024-01-15 09:30 AM',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Chrome on Windows',
    location: 'Main Building',
    details: 'Successful login'
  },
  {
    id: '2',
    userId: '1',
    action: 'password_change',
    timestamp: '2024-01-10 14:20 PM',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Chrome on Windows',
    location: 'Main Building',
    details: 'Password updated successfully'
  },
  {
    id: '3',
    userId: '2',
    action: 'login',
    timestamp: '2024-01-14 02:15 PM',
    ipAddress: '192.168.1.112',
    deviceInfo: 'Safari on iOS',
    location: 'Emergency Wing',
    details: 'Successful login'
  },
  {
    id: '4',
    userId: '3',
    action: 'login',
    timestamp: '2024-01-10 11:45 AM',
    ipAddress: '192.168.1.98',
    deviceInfo: 'Chrome on macOS',
    location: 'Main Entrance',
    details: 'Successful login'
  },
  {
    id: '5',
    userId: '4',
    action: 'logout',
    timestamp: '2023-12-20 03:30 PM',
    ipAddress: '192.168.1.87',
    deviceInfo: 'Firefox on Windows',
    location: 'Building A',
    details: 'Manual logout'
  }
];

export function UserManagement() {
  const [users] = useState<User[]>(mockUsers);
  const [userActivities] = useState<UserActivity[]>(mockUserActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [, setShowRoleModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<User | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete?.id) {
      console.log('Delete user:', sanitizer.forLog(userToDelete.id));
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Utility functions for enhanced user management
  const isUserInactive = (user: User): boolean => {
    const lastLogin = new Date(user.lastLogin);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 30;
  };

  const getDaysSinceLastLogin = (user: User): number => {
    const lastLogin = new Date(user.lastLogin);
    const now = new Date();
    return Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleBulkAction = async (action: 'enable' | 'disable' | 'reset_password') => {
    setBulkActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'enable':
          console.log(`Enabling ${selectedUsers.length} users:`, selectedUsers);
          break;
        case 'disable':
          console.log(`Disabling ${selectedUsers.length} users:`, selectedUsers);
          break;
        case 'reset_password':
          console.log(`Resetting passwords for ${selectedUsers.length} users:`, selectedUsers);
          break;
      }
      
      setSelectedUsers([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleUserSelection = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleViewActivity = (user: User) => {
    setSelectedUserForActivity(user);
    setShowActivityModal(true);
  };

  const getUserActivities = (userId: string): UserActivity[] => {
    return userActivities.filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5); // Show last 5 activities
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'inactive':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Inactive</span>;
      case 'disabled':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Disabled</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      render: (_: unknown, user: User) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      width: '50px'
    },
    { 
      key: 'name', 
      header: 'Name', 
      render: (name: string, user: User) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          {user.department && (
            <div className="text-sm text-gray-500">{user.department}</div>
          )}
          {isUserInactive(user) && (
            <div className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
              ⚠️ Inactive {getDaysSinceLastLogin(user)} days
            </div>
          )}
        </div>
      )
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (role: UserRole) => (
        <Badge status="delivered" className="capitalize">{role}</Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => getStatusBadge(status)
    },
    { 
      key: 'lastLogin', 
      header: 'Last Login',
      render: (lastLogin: string, user: User) => (
        <div>
          <div className="text-sm">{lastLogin}</div>
          {user.lastIPAddress && (
            <div className="text-xs text-gray-500">{user.lastIPAddress}</div>
          )}
        </div>
      )
    },
    {
      key: 'activity',
      header: 'Activity',
      render: (_: unknown, user: User) => {
        const daysSinceLogin = getDaysSinceLastLogin(user);
        return (
          <button
            onClick={() => handleViewActivity(user)}
            className="text-primary-600 hover:text-primary-800 text-sm underline"
          >
            View Log ({getUserActivities(user.id).length})
          </button>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, user: User) => (
        <div className="flex gap-2" role="group" aria-label="User actions">
          <Button 
            variant="tertiary" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit user:', sanitizer.forLog(user.id));
            }}
            aria-label={`Edit ${user.name}`}
          >
            Edit
          </Button>
          <Button 
            variant="tertiary" 
            size="sm" 
            className="text-error hover:bg-error-50"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(user);
            }}
            aria-label={`Delete ${user.name}`}
          >
            Delete
          </Button>
        </div>
      ),
      width: '150px'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-neutral-600 mt-1">Manage hospital staff and their permissions. Configure roles and access in Settings.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
          aria-label="Add new user"
        >
          <span aria-hidden="true">+</span>
          Add New User
        </Button>
        <Button 
          variant="secondary"
          onClick={() => setShowRoleModal(true)}
          className="flex items-center gap-2"
          aria-label="View role permissions"
        >
          <span aria-hidden="true">🔐</span>
          Role Permissions
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-neutral-900">All Users</h2>
          
          {/* Bulk Actions Toolbar */}
          {selectedUsers.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary-900">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleBulkAction('enable')}
                    disabled={bulkActionLoading}
                  >
                    Enable
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleBulkAction('disable')}
                    disabled={bulkActionLoading}
                  >
                    Disable
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleBulkAction('reset_password')}
                    disabled={bulkActionLoading}
                  >
                    Reset Password
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
          
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-success/10 rounded">
              <div className="text-2xl font-semibold text-success">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-neutral-600">Active Users</div>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded">
              <div className="text-2xl font-semibold text-warning">
                {users.filter(u => isUserInactive(u)).length}
              </div>
              <div className="text-sm text-neutral-600">Inactive (&gt;30 days)</div>
            </div>
            <div className="text-center p-3 bg-error/10 rounded">
              <div className="text-2xl font-semibold text-error">
                {users.filter(u => u.status === 'disabled').length}
              </div>
              <div className="text-sm text-neutral-600">Disabled</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded">
              <div className="text-2xl font-semibold text-primary">
                {users.length}
              </div>
              <div className="text-sm text-neutral-600">Total Users</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search users by name or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md"
              aria-label="Search users by name or email"
            />
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by role"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="receptionist">Receptionist</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState
              title={searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'No users found' : 'No users yet'}
              description={searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Get started by adding your first user'}
              action={{ label: 'Add New User', onClick: () => setShowCreateModal(true) }}
            />
          ) : (
            <Table
              columns={columns}
              data={filteredUsers}
              onRowClick={(user) => console.log('Selected user:', sanitizer.forLog(user.id))}
            />
          )}
        </div>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New User"
        size="md"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Full Name" placeholder="Enter full name" required />
          <Input label="Email" type="email" placeholder="Enter email address" required />
          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Role</label>
            <select className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="receptionist">Receptionist</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>
          <Input label="Password" type="password" placeholder="Enter password" required />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>

      {/* User Activity Log Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title={`Activity Log - ${selectedUserForActivity?.name}`}
        size="lg"
      >
        {selectedUserForActivity && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Department:</span> {selectedUserForActivity.department}
              </div>
              <div>
                <span className="font-medium">Role:</span> {selectedUserForActivity.role}
              </div>
              <div>
                <span className="font-medium">Last Password Change:</span> {selectedUserForActivity.lastPasswordChange}
              </div>
              <div>
                <span className="font-medium">Last IP:</span> {selectedUserForActivity.lastIPAddress}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Recent Activities</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getUserActivities(selectedUserForActivity.id).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action.replace('_', ' ').toUpperCase()}</div>
                      <div className="text-xs text-neutral-600">{activity.timestamp}</div>
                      <div className="text-xs text-neutral-500">{activity.ipAddress} • {activity.deviceInfo}</div>
                      {activity.details && (
                        <div className="text-xs text-neutral-700 mt-1">{activity.details}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-body text-neutral-700">
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="bg-warning-50 border border-warning-200 rounded-md p-3">
            <p className="text-sm text-warning-800">
              ⚠️ This will permanently remove the user and revoke all access.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-error hover:bg-error-600"
              onClick={handleDeleteConfirm}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}