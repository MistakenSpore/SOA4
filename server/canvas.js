// https://canvas.instructure.com/doc/api/index.html
// https://canvas.instructure.com/doc/api/calendar_events.html#method.calendar_events_api.create

export const postToCanvas = async (data) => {
    const url = '';
    const token = '';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    return await response.json();
};
