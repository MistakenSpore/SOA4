// https://canvas.instructure.com/doc/api/index.html
// https://canvas.instructure.com/doc/api/calendar_events.html#method.calendar_events_api.create


export const createEvent = async (eventData, token) => {
  const url = 'https://canvas.ltu.se/api/v1/calendar_events.json';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ calendar_event: eventData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Canvas API Error:', errorData);
      throw new Error(`Canvas API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Canvas event:', error);
    throw error;
  }
}


