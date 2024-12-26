import { useState, useEffect } from 'react';
import './EventList.css';

export default function EventList() {
  const [events, setEvents] = useState([]); // one event is a single reservation/kalenderhändelse
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [editingEvent, setEditingEvent] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/timeedit');
      const data = await response.json();
      setEvents(data.reservations);
      setColumnHeaders(data.columnheaders);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleInputChange = (eventId, fieldIndex, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [fieldIndex]: value,
      },
    }));
  };

  const getEventValue = (event, fieldIndex) => {
    // Prioritize edited values, fall back to original
    return editedValues[event.id]?.[fieldIndex] || event.columns[fieldIndex] || '';
  };

  const createEvent = async (eventId) => {
    setCreatingEvent(eventId); // disables the create button while createEvent is running
    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) {
        console.error('Event not found');
        return;
      }

      // Use edited values if available, fallback to original values
      // activity seems to be the most fitting for title
      const editedEvent = editedValues[eventId] || {};
      const title = editedEvent[columnHeaders.indexOf('Aktivitet')] || event.columns[columnHeaders.indexOf('Aktivitet')] || '';
      const location = editedEvent[columnHeaders.indexOf('Plats, Lokal')] || event.columns[columnHeaders.indexOf('Plats, Lokal')] || '';

      // Generate a formatted description from all column data available
      const description = columnHeaders.map((header, index) => {
        const value = editedEvent[index] || event.columns[index];
        if (!value) return null; // Skip field altogether if no value is present
        return `<strong>${header}:</strong> ${value || ''}`; // Format as HTML
      }).filter(Boolean).join('<br>'); // Filter out null values and join with line breaks between each header-value pair

      const canvasEvent = {
        context_code: 'user_136612', // Simon user id, course arg unauthorized
        title: title,
        start_at: `${event.startdate}T${event.starttime}:00Z`,
        end_at: `${event.startdate}T${event.endtime}:00Z`,
        location_name: location,
        description: description,
      };
      console.log('Creating event in Canvas:', canvasEvent);

      const response = await fetch('/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canvasEvent),
      });

      if (!response.ok) {
        console.error('Failed to create event in Canvas:', response);
        throw new Error('Failed to create event in Canvas');
      }

      alert('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    } finally {
      setCreatingEvent(null); // Reset the creating state after completion
    }
  };

  // Toggles the expanded state of an event card
  const toggleExpand = (eventId) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId); // Collapse if already expanded
      } else {
        newSet.add(eventId); // Expand if collapsed
      }
      return newSet;
    });
  };

  const handleEdit = (eventId) => {
    setEditingEvent(eventId === editingEvent ? null : eventId);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setEditedValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[editingEvent];
      return updatedValues;
    });
  };

  // the event list consists of event cards, each card has a header and content
  // the header contains the date and time of the event serving as the title/identifier
  // the content contains a grid of fields and values, and an actions section edit/save/cancel/create
  // the fields are the column headers from TimeEdit, and the values are the corresponding values for the event
  return (
    <div className="event-list">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <div className="event-header" onClick={() => toggleExpand(event.id)}>
            <div className="event-title">
              {event.startdate} {event.starttime} - {event.endtime}
            </div>
            <div className="event-expand-icon">
              {expandedEvents.has(event.id) ? '▲' : '▼'}
            </div>
          </div>
          {expandedEvents.has(event.id) && (
            <div className="event-content">
              <div className="event-fields-grid">
                {columnHeaders.map((header, index) => (
                  <div key={header} className="event-field">
                    <label>{header}</label>
                    {editingEvent === event.id ? (
                      <input
                        type="text"
                        defaultValue={getEventValue(event, index)}
                        onChange={(e) => handleInputChange(event.id, index, e.target.value)}
                        placeholder={`Ange ${header}`}
                      />
                    ) : (
                      <div className="event-value">
                        {getEventValue(event, index)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="event-actions">
                {editingEvent === event.id ? (
                  <>
                    <button onClick={cancelEdit}>Avbryt</button>
                    <button onClick={() => handleEdit(event.id)}>Spara</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(event.id)}>Redigera</button>
                )}
                {editingEvent !== event.id && (
                  <button
                    onClick={() => createEvent(event.id)}
                    disabled={creatingEvent === event.id}
                  >
                    {creatingEvent === event.id ? 'Skapar...' : 'Skapa händelse'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
