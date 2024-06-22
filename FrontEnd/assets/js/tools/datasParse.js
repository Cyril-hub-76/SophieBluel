export let datas = async function(api, method, body, token = null, userId = null) {
    return new Promise(function(resolve, reject) {
        let headers = {};
        let options = {
            method: method,
            headers: headers
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (method !== "GET" && body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        if (method === "DELETE") {
            options = {
                method: method,
                headers: headers
                // headers: {
                //     'Authorization': `Bearer ${token}`
                // }
            };
        }

        fetch(api, options)
            .then(function(response) {
                if (!response.ok) {
                    return response.text()
                        .then(function() {
                            throw new Error(`Status: ${response.status}, message: ${response.url} ${response.statusText}`);
                        });
                }
                if (response.status === 204) {
                    return;
                }
                return response.json();
                // return response.json().catch(function() {
                //     return;
                // });
            })
            .then(function(data) {
                resolve(data);
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
