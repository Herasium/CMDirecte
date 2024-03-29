<script>
    import { onMount } from "svelte";
    import Cookies from "js-cookie";
    import { get } from "svelte/store";
    import { login, login_factor, factor, valid_factor, get_all_homeworks, get_homework} from "$lib/api"
    import removeMarkdown from "markdown-to-text";
    import { marked } from "marked";

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
                print("homework")
                print("disconnect")
            } else if (request[0] == "homework") {
                if (request[1] == undefined) {
                    let homework = await get_all_homeworks(token)
                    for (let devoir in homework["data"]) {
                        print(devoir+": ")
                        for (let matiere in homework["data"][devoir]) {
                            messages[messages.length - 1] = messages[messages.length - 1] + homework["data"][devoir][matiere]["matiere"].toLowerCase() + " "
                        }
                    }
                } else {
                    const data = await get_homework(request[1],token)
                    print(request[1]+":")
                    for (let matiere in data["data"]["matieres"]) {
                        if ("aFaire" in data["data"]["matieres"][matiere]){
                            print(data["data"]["matieres"][matiere]["matiere"])
                            let todo = removeMarkdown(atob(data["data"]["matieres"][matiere]["aFaire"]["contenu"]));
                            //todo = marked.parse(todo)
                            print(todo)
                        }  
                    }
                }
            } else if (request[0] == "disconnect") {
                sessionStorage.removeItem("ed-token")
                sessionStorage.removeItem("ed-acc-data")
                location.reload();
            }
            else {
                print("Unknown command, type help for help.")
            }
            window.scrollTo(0, document.body.scrollHeight)
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
