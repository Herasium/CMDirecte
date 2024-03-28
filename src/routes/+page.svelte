<script>
    import { onMount } from "svelte";
    import Cookies from 'js-cookie';
    import { get } from "svelte/store";

    let messages = [
        "Welcome to CMDirecte, a weird Ecole Directe client I made !",
        "Username?",
    ];

    function print (message) {
        messages.push(message)
        messages=messages
    }

    async function login(user, password) {
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

    async function factor(token) {
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
    function get_typed(password) {
        print("")
        let pressed_key = "";
        let finished = false;

        function handleKeyPress(event) {
            const keyPressed = event.key;
            if (keyPressed.length === 1) {
                pressed_key += keyPressed;
                if (password) {
                    messages[messages.length - 1] = "*".repeat(
                        pressed_key.length,
                    );
                } else {
                    messages[messages.length - 1] = pressed_key;
                }
            } else if (keyPressed === "Enter") {
                finished = true;
                cleanup();
            } else if (keyPressed === "Backspace") {
                pressed_key = pressed_key.slice(0, -1);
                if (password) {
                    messages[messages.length - 1] = "*".repeat(
                        pressed_key.length,
                    );
                } else {
                    messages[messages.length - 1] = pressed_key;
                }
            }
        }

        document.addEventListener("keydown", handleKeyPress);

        function cleanup() {
            document.removeEventListener("keydown", handleKeyPress);
        }

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (finished) {
                    clearInterval(interval);
                    resolve(pressed_key);
                }
            }, 100);
        });
    }

    let user = "";
    let password = "";
    let temp_token = "";
    let token = "";

    onMount(async () => {
        user = await get_typed(false);
        print("Password?");
        password = await get_typed(true);
        temp_token = await login(user, password);
        const second_data = await factor(temp_token)
        print(atob(second_data["data"]["question"]))
        for (let choice in second_data["data"]["propositions"]) {
            print(atob(second_data["data"]["propositions"][choice]))
        }
        let choix = await get_typed()
    });
</script>

<div id="container">
    {#each messages as message}
        <div class="message">> {message}</div>
    {/each}
</div>

<style>
    #container {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
    }
    .message {
        color: greenyellow;
    }
</style>
