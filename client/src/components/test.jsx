import { useState } from 'react';

function Test() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/timeedit');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>TimeEdit till kalender</h1>
            <button onClick={fetchData} disabled={loading}>
                {loading ? 'Loading...' : 'Hämta schema'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {data && (
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <h3>Reservationer</h3>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th>Startdatum</th>
                            <th>Starttid</th>
                            <th>Slutdatum</th>
                            <th>Sluttid</th>
                            {data.columnheaders.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.startdate}</td>
                                <td>{reservation.starttime}</td>
                                <td>{reservation.enddate}</td>
                                <td>{reservation.endtime}</td>
                                {reservation.columns.map((column, index) => (
                                    <td key={index}>{column || '-'}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Test;
