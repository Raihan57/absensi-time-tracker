const SUPABASE_URL = "https://kyxhcrmevzuhsezdugtd.supabase.co";

const SUPABASE_KEY = "sb_publishable_AUmeFRYri4UOpiXobTPGRg_Ga8R3kpk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");


loginBtn.addEventListener("click", async function () {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    if (email === "" || password === "") {

        message.textContent = "Email dan password wajib diisi.";

        return;
    }


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        message.textContent =
            "Login gagal: " + error.message;

        return;
    }


    console.log("Login berhasil:", data);

    window.location.href = "index.html";

});