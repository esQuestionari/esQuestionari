export default async function sendRequestWithStatus({ url, method, headers, body }) {
    const response = await fetch(url, {
        method,
        headers,
        body
    });
    const status = response.status;
    console.log(status);
    const json = await response.json();
    return {
        status: status,
        data: json,
    };
}