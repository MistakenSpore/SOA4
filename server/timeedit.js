// https://cloud.timeedit.net/ltu/web/schedule1/ri107807055Z75Q646655Q55yZ076W8308Y69Q5Q.json

export const fetchTimeEditData = async () => {
    const url = 'https://cloud.timeedit.net/ltu/web/schedule1/ri107807055Z75Q646655Q55yZ076W8308Y69Q5Q.json'; // Replace with actual URL
    const response = await fetch(url);
    return await response.json();
};