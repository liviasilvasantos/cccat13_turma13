import HttpClient from "./HttpClient";

export default class FetchAdapter implements HttpClient {

    async get(url: string): Promise<any> {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (e: any) {
            throw new Error(e.response.data.message);
        }
    }
    async post(url: string, data: any): Promise<any> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

}