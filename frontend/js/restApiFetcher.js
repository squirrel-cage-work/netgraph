export class restApiDataFetcher {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    // GETリクエスト
    async getData(queryParam = '') {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch GET error:', error);
            return null;
        }
    }

    // POSTリクエスト
    async postData(bodyData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch POST error:', error);
            return null;
        }
    }

    // PUTリクエスト
    async putData(id, bodyData) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch PUT error:', error);
            return null;
        }
    }

    // DELETEリクエスト
    async deleteData(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });
            return 'Resource deleted successfully';
        } catch (error) {
            console.error('Fetch DELETE error:', error);
            return null;
        }
    }
}
