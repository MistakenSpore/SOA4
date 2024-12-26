// https://canvas.instructure.com/doc/api/index.html
// https://canvas.instructure.com/doc/api/calendar_events.html#method.calendar_events_api.create


/*async function postToCanvas(token) {
    const url = 'https://canvas.ltu.se/api/v1/calendar_events.json'; // Canvas API endpoint

    const eventData = new URLSearchParams({
        "calendar_event[context_code]": "user_136612",
        "calendar_event[title]": "test 24",
        "calendar_event[start_at]": "2024-12-24T16:15:00",
        "calendar_event[end_at]": "2024-12-24T17:30:00",
        "calendar_event[description]": "Demo uppgift 4",
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: eventData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Event created successfully:', result);
        } else {
            const error = await response.json();
            console.error('Failed to create event:', error);
        }
    } catch (err) {
        console.error('Error making the request:', err);
    }
}*/

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
        console.log('eventData:', eventData);

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


