const SUPABASE_URL = "https://kyxhcrmevzuhsezdugtd.supabase.co";
const SUPABASE_KEY = "sb_publishable_AUmeFRYri4UOpiXobTPGRg_Ga8R3kpk";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
    const showPassword = passwordInput.type === "password";
    passwordInput.type = showPassword ? "text" : "password";
    togglePassword.textContent = showPassword ? "Sembunyikan" : "Lihat";
    togglePassword.setAttribute("aria-label", showPassword ? "Sembunyikan password" : "Tampilkan password");
});

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    message.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        message.textContent = "Email dan password wajib diisi.";
        return;
    }
    if (password.length < 6) {
        message.textContent = "Password minimal 6 karakter.";
        return;
    }

    signupBtn.disabled = true;
    signupBtn.querySelector("span").textContent = "Membuat akun...";
    try {
        const { data, error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;

        message.style.color = "#047857";
        message.style.background = "#ecfdf5";
        message.textContent = data.session
            ? "Akun berhasil dibuat. Mengalihkan ke halaman login..."
            : "Akun berhasil dibuat. Silakan login dengan email dan password kamu.";
        signupForm.reset();
    } catch (error) {
        console.error("Sign up gagal:", error);
        message.style.color = "#dc2626";
        message.style.background = "#fff0f0";
        message.textContent = "Pendaftaran gagal: " + (error.message || "Silakan coba lagi.");
    } finally {
        signupBtn.disabled = false;
        signupBtn.querySelector("span").textContent = "Buat akun";
    }
});