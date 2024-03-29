<script>
    import { onMount } from "svelte";
    import Cookies from "js-cookie";
    import { get } from "svelte/store";
    import { login, login_factor, factor, valid_factor} from "$lib/api"

    let messages = [
        "Welcome to CMDirecte, a weird Ecole Directe client I made !",
        "Username?",
    ];

    function print(message) {
        messages.push(message);
        messages = messages;
    }


    function get_typed(password) {
        print("");
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

    function clear_screen() {
        messages = []
    }

    async function wait(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    let user = "";
    let password = "";
    let temp_token = "";
    let token = "";
    let acc_data 

    onMount(async () => {
        console.log(sessionStorage.getItem("ed-token"))
        if (sessionStorage.getItem('ed-token') == undefined) {
            user = await get_typed(false);
            print("Password?");
            password = await get_typed(true);
            temp_token = await login(user, password);
            const second_data = await factor(temp_token);
            print("Second Factor Question: "+atob(second_data["data"]["question"]));
            for (let choice in second_data["data"]["propositions"]) {
                print(atob(second_data["data"]["propositions"][choice]));
            }
            let choix = await get_typed();
            const factor_token = await valid_factor(btoa(choix), temp_token);
            const login_data = await login_factor(user,password,factor_token["data"]["cn"],factor_token["data"]["cv"])
            token = login_data["token"]
            acc_data = login_data["data"]["accounts"][0]
            const json_acc = JSON.stringify(acc_data)
            sessionStorage.setItem("ed-acc-data",json_acc)
            sessionStorage.setItem("ed-token",token)
            clear_screen()
            await wait(1000)
            print("Welcome "+acc_data["prenom"])
        } else {
            token = sessionStorage.getItem('ed-token')
            acc_data = JSON.parse(sessionStorage.getItem('ed-acc-data'))
            clear_screen()
            print("Loading from previous token.")
            wait(1000)
            clear_screen()
            print("Welcome Back "+acc_data["prenom"])
        }
        print(acc_data["nomEtablissement"])
        print(acc_data["profile"]["classe"]["libelle"])
        while (true) {
            let request = await get_typed(false)
            request = request.split(" ")
            if (request[0] == "help") {
                print("Current commands:")
                print("help")
            } else {
                print("Unknown command, type help for help.")
            }
        }
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
        position: fixed;
        overflow: auto;
        width: 100%;
        height: 100%;
        background: black;
    }
    .message {
        color: greenyellow;
    }
</style>
