export const fetchTimeEditData = async () => {
  // Schema för november månad
  const url = 'https://cloud.timeedit.net/ltu/web/schedule1/ri107807055Z75Q646655Q55yZ076W8308Y69Q5Q.json';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  /*The reservations array is iterated, and each reservation is processed
    The columns array of each reservation is mapped
    If a cell contains a comma (,), it is split into parts, and extra spaces are trimmed.
    If all parts are identical, only the first value is returned.
    If parts differ, unique values are determined using new Set() and joined back into a single string.
    If no comma exists, the cell is returned unchanged */
  const cleanedReservations = data.reservations.map(reservation => ({
    ...reservation,
    columns: reservation.columns.map(cell => {
      if (typeof cell === 'string' && cell.includes(',')) {
        const parts = cell.split(',').map(part => part.trim());
        const allEqual = parts.every(part => part === parts[0]);
        if (allEqual) {
          return parts[0];
        }
        const uniqueValues = Array.from(new Set(parts));
        return uniqueValues.join(', ');
      }
      return cell;
    }),
  }));

  const cleanedColumnHeaders = data.columnheaders.map(header => {
    if (header.includes(',')) {
      const uniqueValues = Array.from(new Set(header.split(',').map(val => val.trim())));
      return uniqueValues.join(', ');
    }
    return header;
  });

  return {
    ...data,
    reservations: cleanedReservations,
    columnheaders: cleanedColumnHeaders
  };
};

fetchTimeEditData()