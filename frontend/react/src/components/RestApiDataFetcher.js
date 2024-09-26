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
            return response;
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
            return response;
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
            return response;
        } catch (error) {
            console.error('Fetch PUT error:', error);
            return null;
        }
    }

    // DELETEリクエスト
    async deleteData(bodyData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });
            return response;
        } catch (error) {
            console.error('Fetch DELETE error:', error);
            return null;
        }
    }
}
