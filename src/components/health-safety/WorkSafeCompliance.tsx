// Previous content updated with enhanced features
import React, { useState } from 'react';
import { AlertTriangle, FileText, Download, Calendar, Clock, Shield } from 'lucide-react';
import { format, addDays } from 'date-fns';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface NotifiableEvent {
  id: string;
  type: string;
  date: string;
  description: string;
  status: 'pending' | 'notified' | 'resolved';
  notificationDate?: string;
  referenceNumber?: string;
  location: string;
  injured?: {
    name: string;
    role: string;
    injury: string;
    treatment: string;
  }[];
  witnesses: string[];
  immediateActions: string[];
}

export const WorkSafeCompliance = () => {
  const [events, setEvents] = useState<NotifiableEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    location: '',
    injured: [{
      name: '',
      role: '',
      injury: '',
      treatment: ''
    }],
    witnesses: [''],
    immediateActions: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: NotifiableEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      date: `${formData.date}T${formData.time}`,
      description: formData.description,
      status: 'pending',
      location: formData.location,
      injured: formData.injured.filter(i => i.name && i.injury),
      witnesses: formData.witnesses.filter(Boolean),
      immediateActions: formData.immediateActions.filter(Boolean)
    };

    setEvents([newEvent, ...events]);
    setShowForm(false);
    toast.success('Event recorded successfully');
  };

  const handleNotify = (id: string) => {
    window.open('https://www.worksafe.govt.nz/notify-worksafe', '_blank');
    
    setEvents(events.map(event => 
      event.id === id
        ? {
            ...event,
            status: 'notified',
            notificationDate: new Date().toISOString(),
            referenceNumber: 'WS' + Math.random().toString().substr(2, 8)
          }
        : event
    ));

    toast.success('WorkSafe notification initiated');
  };

  const handleExport = () => {
    const data = [
      ['WorkSafe NZ Notifiable Events Register'],
      ['Generated:', format(new Date(), 'dd/MM/yyyy')],
      [''],
      ['Date', 'Type', 'Location', 'Description', 'Status', 'Notification Date', 'Reference'],
      ...events.map(event => [
        format(new Date(event.date), 'dd/MM/yyyy HH:mm'),
        event.type,
        event.location,
        event.description,
        event.status.toUpperCase(),
        event.notificationDate ? format(new Date(event.notificationDate), 'dd/MM/yyyy') : '-',
        event.referenceNumber || '-'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notifiable Events');
    XLSX.writeFile(wb, `worksafe-events-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success('Events register exported successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">WorkSafe NZ Compliance</h2>
            <p className="text-sm text-gray-500">Notifiable events management</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleExport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export Register</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <AlertTriangle size={20} />
              <span>Record Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Event Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select Type</option>
                    <option value="death">Death</option>
                    <option value="serious_injury">Serious Injury</option>
                    <option value="serious_illness">Serious Illness</option>
                    <option value="dangerous_incident">Dangerous Incident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                    placeholder="Where did the incident occur?"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                    max={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what happened in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Injured Persons
                </label>
                {formData.injured.map((person, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => {
                        const newInjured = [...formData.injured];
                        newInjured[index] = { ...person, name: e.target.value };
                        setFormData({ ...formData, injured: newInjured });
                      }}
                      className="input-field"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={person.role}
                      onChange={(e) => {
                        const newInjured = [...formData.injured];
                        newInjured[index] = { ...person, role: e.target.value };
                        setFormData({ ...formData, injured: newInjured });
                      }}
                      className="input-field"
                      placeholder="Role"
                    />
                    <input
                      type="text"
                      value={person.injury}
                      onChange={(e) => {
                        const newInjured = [...formData.injured];
                        newInjured[index] = { ...person, injury: e.target.value };
                        setFormData({ ...formData, injured: newInjured });
                      }}
                      className="input-field"
                      placeholder="Nature of injury"
                    />
                    <input
                      type="text"
                      value={person.treatment}
                      onChange={(e) => {
                        const newInjured = [...formData.injured];
                        newInjured[index] = { ...person, treatment: e.target.value };
                        setFormData({ ...formData, injured: newInjured });
                      }}
                      className="input-field"
                      placeholder="Treatment required"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    injured: [...formData.injured, { name: '', role: '', injury: '', treatment: '' }]
                  })}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Another Person
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witnesses
                </label>
                {formData.witnesses.map((witness, index) => (
                  <input
                    key={index}
                    type="text"
                    value={witness}
                    onChange={(e) => {
                      const newWitnesses = [...formData.witnesses];
                      newWitnesses[index] = e.target.value;
                      setFormData({ ...formData, witnesses: newWitnesses });
                    }}
                    className="input-field mb-2"
                    placeholder="Witness name"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    witnesses: [...formData.witnesses, '']
                  })}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Witness
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immediate Actions Taken
                </label>
                {formData.immediateActions.map((action, index) => (
                  <input
                    key={index}
                    type="text"
                    value={action}
                    onChange={(e) => {
                      const newActions = [...formData.immediateActions];
                      newActions[index] = e.target.value;
                      setFormData({ ...formData, immediateActions: newActions });
                    }}
                    className="input-field mb-2"
                    placeholder="Action taken"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    immediateActions: [...formData.immediateActions, '']
                  })}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Action
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Record Event
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${
                event.status === 'pending'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'pending'
                          ? 'bg-red-100 text-red-800'
                          : event.status === 'notified'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(event.date), 'dd/MM/yyyy HH:mm')}
                  </p>
                  <p className="mt-2 text-gray-700">{event.description}</p>
                  
                  {event.injured && event.injured.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-600">Injured Persons:</p>
                      <ul className="mt-1 space-y-1">
                        {event.injured.map((person, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {person.name} ({person.role}) - {person.injury}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {event.status === 'pending' && (
                  <button
                    onClick={() => handleNotify(event.id)}
                    className="btn-primary"
                  >
                    Notify WorkSafe
                  </button>
                )}
              </div>

              {event.status === 'notified' && (
                <div className="mt-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    Notified: {format(new Date(event.notificationDate!), 'dd/MM/yyyy')}
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <FileText size={16} className="mr-1" />
                    Reference: {event.referenceNumber}
                  </div>
                </div>
              )}
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No notifiable events recorded
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="text-blue-600 mt-0.5 mr-2" size={16} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">WorkSafe NZ Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Notify WorkSafe within 24 hours of a notifiable event</li>
                <li>Keep records of all notifications</li>
                <li>Preserve incident site until WorkSafe arrives</li>
                <li>Provide all requested information</li>
                <li>Follow up on WorkSafe recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};