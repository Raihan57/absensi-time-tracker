const SUPABASE_URL = "https://kyxhcrmevzuhsezdugtd.supabase.co";

const SUPABASE_KEY = "sb_publishable_AUmeFRYri4UOpiXobTPGRg_Ga8R3kpk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const signupBtn = document.getElementById("signupBtn");

const message = document.getElementById("message");


signupBtn.addEventListener("click", async function () {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    if (email === "" || password === "") {

        message.textContent =
            "Email dan password wajib diisi.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password minimal 6 karakter.";

        return;
    }


    const { data, error } =
        await supabaseClient.auth.signUp({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        message.textContent =
            "Sign Up gagal: " + error.message;

        return;
    }


    console.log("Sign Up berhasil:", data);

    message.textContent =
        "Akun berhasil dibuat. Silakan login.";

});