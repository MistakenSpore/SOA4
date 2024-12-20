// https://cloud.timeedit.net/ltu/web/schedule1/ri107807055Z75Q646655Q55yZ076W8308Y69Q5Q.json

export const fetchTimeEditData = async () => {
    // Schema för november månad
    const url = 'https://cloud.timeedit.net/ltu/web/schedule1/ri107807055Z75Q646655Q55yZ076W8308Y69Q5Q.json';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response) {
        console.log('error');
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};