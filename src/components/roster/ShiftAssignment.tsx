import React, { useState } from 'react';
import { useRosterStore } from '../../store/rosterStore';
import { useEmployeeStore } from '../../store/employeeStore';
import { DragDropContext, Droppable, Draggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

interface ShiftAssignmentProps {
  weekId: string;
}

export const ShiftAssignment = ({ weekId }: ShiftAssignmentProps) => {
  const { shifts, updateShift } = useRosterStore();
  const employees = useEmployeeStore((state) => state.getActiveEmployees());
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedShift) return;

    const employeeId = result.draggableId;
    updateShift(selectedShift, { employeeId });
    setSelectedShift(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Shift Assignment</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Unassigned Shifts</h3>
            <Droppable droppableId="unassigned">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {shifts
                    .filter((shift) => !shift.employeeId)
                    .map((shift, index) => (
                      <Draggable
                        key={shift.id}
                        draggableId={shift.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => setSelectedShift(shift.id)}
                          >
                            <div className="text-sm">
                              {format(new Date(shift.startTime), 'MMM d, HH:mm')} -{' '}
                              {format(new Date(shift.endTime), 'HH:mm')}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Employees</h3>
            <Droppable droppableId="employees">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {employees.map((employee, index) => (
                    <Draggable
                      key={employee.id}
                      draggableId={employee.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-gray-500">
                                {employee.position}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};