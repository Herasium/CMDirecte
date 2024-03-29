export async function login(user, password) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en,en-US;q=0.9,fr-FR;q=0.8,fr;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            dnt: "1",
            origin: "https://www.ecoledirecte.com",
            referer: "https://www.ecoledirecte.com/",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
        body: new URLSearchParams({
            data:
                '{    "identifiant": "' +
                user +
                '",    "motdepasse": "' +
                password +
                '",    "isReLogin": false,    "uuid": "",    "fa": []}',
        }),
    };

    try {
        const response = await fetch(
            "https://api.ecoledirecte.com/v3/login.awp?v=4.53.4",
            options,
        );
        const data = await response.json();
        return data.token;
    } catch (err) {
        console.error(err);
        return null; // or handle the error in your preferred way
    }
}

export async function factor(token) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en,en-US;q=0.9,fr-FR;q=0.8,fr;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            dnt: "1",
            origin: "https://www.ecoledirecte.com",
            referer: "https://www.ecoledirecte.com/",
            "sec-ch-ua":
                '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "x-token": token,
        },
        body: new URLSearchParams({ data: "{}" }),
    };
    try {
        const response = await fetch(
            "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=get&v=4.53.4",
            options,
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null; // or handle the error in your preferred way
    }
}

export async function valid_factor(choice, token) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en,en-US;q=0.9,fr-FR;q=0.8,fr;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            dnt: "1",
            origin: "https://www.ecoledirecte.com",
            referer: "https://www.ecoledirecte.com/",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "x-token": token,
        },
        body: new URLSearchParams({ data: '{"choix": "' + choice + '"}' }),
    };

    try {
        const response = await fetch(
            "https://api.ecoledirecte.com/v3/connexion/doubleauth.awp?verbe=post&v=4.53.4",
            options,
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null; // or handle the error in your preferred way
    }
}

export async function login_factor(user,password,cn,cv) {
    const options = {
        method: "POST",
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en,en-US;q=0.9,fr-FR;q=0.8,fr;q=0.7",
            "content-type": "application/x-www-form-urlencoded",
            dnt: "1",
            origin: "https://www.ecoledirecte.com",
            referer: "https://www.ecoledirecte.com/",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            "x-token": "d7869dfc-295f-433d-99bf-76eb5eb1fe8b",
        },
        body: new URLSearchParams({
            data: '{    "identifiant": "'+user+'",    "motdepasse": "'+password+'",    "isReLogin": false,    "cn": "'+cn+'",    "cv": "'+cv+'",    "uuid": "",    "fa": [        {            "cn": "'+cn+'",            "cv": "'+cv+'"        }    ]}',
        }),
    };

    try {
        const response = await fetch(
            "https://api.ecoledirecte.com/v3/login.awp?v=4.53.4",
            options,
        );
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null; // or handle the error in your preferred way
    }
}