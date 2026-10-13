const SUPABASE_URL = "https://kyxhcrmevzuhsezdugtd.supabase.co";
const SUPABASE_KEY = "sb_publishable_AUmeFRYri4UOpiXobTPGRg_Ga8R3kpk";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const showPassword = passwordInput.type === "password";
        passwordInput.type = showPassword ? "text" : "password";
        togglePassword.textContent = showPassword ? "Sembunyikan" : "Tampilkan";
        togglePassword.setAttribute("aria-label", showPassword ? "Sembunyikan password" : "Tampilkan password");
    });
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        message.textContent = "Email dan password wajib diisi.";
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Memproses...";

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            message.textContent = "Login gagal. Periksa email dan password, lalu coba lagi.";
            console.error("Login gagal:", error.message);
            return;
        }

        window.location.href = "index.html";
    } catch (error) {
        console.error("Kesalahan login:", error);
        message.textContent = "Tidak dapat terhubung. Periksa koneksi internet dan coba lagi.";
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Masuk";
    }
});