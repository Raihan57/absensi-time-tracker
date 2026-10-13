const SUPABASE_URL = "https://kyxhcrmevzuhsezdugtd.supabase.co";
const SUPABASE_KEY = "sb_publishable_AUmeFRYri4UOpiXobTPGRg_Ga8R3kpk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase berhasil terhubung!");

let clockInTime = null;
let selectedProject = "";

const statusText = document.getElementById("status");
const clockInText = document.getElementById("clockIn");
const clockOutText = document.getElementById("clockOut");
const durationText = document.getElementById("duration");

const projectSelect = document.getElementById("project");

const clockInBtn = document.getElementById("clockInBtn");
const clockOutBtn = document.getElementById("clockOutBtn");

const historyTable = document.getElementById("historyTable");


// ==========================
// USER & LOGOUT
// ==========================

const userEmailText =
    document.getElementById("userEmail");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================
// REKAP JAM KERJA
// ==========================

const totalDaysText =
    document.getElementById("totalDays");

const totalWorkHoursText =
    document.getElementById("totalWorkHours");

const totalOvertimeText =
    document.getElementById("totalOvertime");


// ==========================
// CEK USER LOGIN
// ==========================

async function checkUser() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {

        console.error(
            "User belum login:",
            error
        );

        window.location.href = "login.html";

        return null;
    }

    userEmailText.textContent =
        data.user.email;

    return data.user;
}


// ==========================
// LOGOUT
// ==========================

logoutBtn.addEventListener(
    "click",
    async function () {

        const confirmLogout =
            confirm("Apakah kamu yakin ingin logout?");

        if (!confirmLogout) {
            return;
        }

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            console.error(
                "Gagal logout:",
                error
            );

            alert(
                "Logout gagal. Silakan coba lagi."
            );

            return;
        }

        window.location.href = "login.html";

    }
);


// ==========================
// CLOCK IN
// ==========================

clockInBtn.addEventListener(
    "click",
    async function () {

        selectedProject =
            projectSelect.value;

        if (selectedProject === "") {

            alert(
                "Silakan pilih proyek terlebih dahulu."
            );

            return;
        }

        if (selectedProject === "Tidak Hadir") {
            const { data: userData, error: userError } = await supabaseClient.auth.getUser();
            if (userError || !userData.user) { alert("Sesi login tidak ditemukan. Silakan login kembali."); window.location.href = "login.html"; return; }
            const { error } = await supabaseClient.from("attendance").insert([{ user_id: userData.user.id, project: "Tidak Hadir", clock_in: null, clock_out: null, duration_seconds: 0 }]);
            if (error) { console.error("Gagal menyimpan absensi:", error); alert("Absensi gagal disimpan. Silakan coba lagi."); return; }
            statusText.textContent = "Tidak Hadir"; clockInText.textContent = "-"; clockOutText.textContent = "-"; durationText.textContent = "0 jam 0 menit"; projectSelect.value = "";
            alert("Status Tidak Hadir berhasil dicatat."); await loadHistory(); return;
        }

        clockInTime =
            new Date();

        const time =
            clockInTime.toLocaleTimeString(
                "id-ID",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

        statusText.textContent =
            "Sedang Bekerja";

        clockInText.textContent =
            time;

        clockInBtn.disabled =
            true;

        clockOutBtn.disabled =
            false;

    }
);


// ==========================
// CLOCK OUT
// ==========================

clockOutBtn.addEventListener(
    "click",
    async function () {

        if (clockInTime === null) {
            return;
        }

        const clockOutTime =
            new Date();

        const time =
            clockOutTime.toLocaleTimeString(
                "id-ID",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

        clockOutText.textContent =
            time;


        const difference =
            clockOutTime - clockInTime;

        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const hours =
            Math.floor(
                totalSeconds / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        durationText.textContent =
            hours +
            " jam " +
            minutes +
            " menit " +
            seconds +
            " detik";


        // ==========================
        // AMBIL USER
        // ==========================

        const {
            data: userData,
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (
            userError ||
            !userData.user
        ) {

            console.error(
                "User belum login:",
                userError
            );

            alert(
                "Sesi login tidak ditemukan. Silakan login kembali."
            );

            window.location.href =
                "login.html";

            return;
        }


        const userId =
            userData.user.id;


        // ==========================
        // SIMPAN DATA
        // ==========================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("attendance")
                .insert([
                    {
                        user_id: userId,
                        project: selectedProject,
                        clock_in:
                            clockInTime.toISOString(),
                        clock_out:
                            clockOutTime.toISOString(),
                        duration_seconds:
                            totalSeconds
                    }
                ])
                .select();


        if (error) {

            console.error(
                "Gagal menyimpan ke Supabase:",
                JSON.stringify(
                    error,
                    null,
                    2
                )
            );

            alert(
                "Data gagal disimpan ke database."
            );

            return;
        }


        console.log(
            "Data berhasil disimpan ke Supabase:",
            data
        );


        // ==========================
        // TAMPILKAN HISTORY
        // ==========================

        const today =
            new Date()
                .toLocaleDateString(
                    "id-ID"
                );


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${today}</td>
            <td>${selectedProject}</td>
            <td>${clockInText.textContent}</td>
            <td>${clockOutText.textContent}</td>
            <td>
                ${hours} jam
                ${minutes} menit
                ${seconds} detik
            </td>
        `;


        if (
            historyTable.textContent.includes(
                "Belum ada data absensi"
            )
        ) {

            historyTable.innerHTML = "";

        }


        historyTable.appendChild(row);


        // ==========================
        // UPDATE STATUS
        // ==========================

        statusText.textContent =
            "Selesai";

        clockOutBtn.disabled =
            true;

        clockInBtn.disabled =
            false;


        // Reset waktu clock in
        clockInTime = null;


        // Update rekap
        loadHistory();

    }
);


// ==========================
// LOAD HISTORY
// ==========================

async function loadHistory() {

    const {
        data: userData,
        error: userError
    } =
        await supabaseClient.auth.getUser();


    if (
        userError ||
        !userData.user
    ) {

        console.error(
            "User belum login:",
            userError
        );

        window.location.href =
            "login.html";

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("attendance")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Gagal mengambil riwayat:",
            JSON.stringify(
                error,
                null,
                2
            )
        );

        return;
    }


    historyTable.innerHTML =
        "";


    // ==========================
    // BELUM ADA DATA
    // ==========================

    if (data.length === 0) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Belum ada data absensi
                </td>
            </tr>
        `;


        totalDaysText.textContent =
            "0 hari";


        totalWorkHoursText.textContent =
            "0 jam 0 menit";


        totalOvertimeText.textContent =
            "0 jam 0 menit";


        return;
    }


    // ==========================
    // HITUNG REKAP
    // ==========================

    let totalSecondsAll =
        0;

    let totalOvertimeSeconds =
        0;


    const normalWorkSeconds =
        8 * 60 * 60;


    data.forEach(
        function (item) {

            const seconds =
                Number(
                    item.duration_seconds
                ) || 0;


            totalSecondsAll +=
                seconds;


            if (
                seconds >
                normalWorkSeconds
            ) {

                totalOvertimeSeconds +=
                    seconds -
                    normalWorkSeconds;

            }

        }
    );


    // ==========================
    // TOTAL HARI
    // ==========================

    totalDaysText.textContent =
        data.length +
        " hari";


    // ==========================
    // TOTAL JAM
    // ==========================

    const totalHours =
        Math.floor(
            totalSecondsAll / 3600
        );


    const totalMinutes =
        Math.floor(
            (totalSecondsAll % 3600) /
            60
        );


    totalWorkHoursText.textContent =
        totalHours +
        " jam " +
        totalMinutes +
        " menit";


    // ==========================
    // TOTAL LEMBUR
    // ==========================

    const overtimeHours =
        Math.floor(
            totalOvertimeSeconds /
            3600
        );


    const overtimeMinutes =
        Math.floor(
            (totalOvertimeSeconds % 3600) /
            60
        );


    totalOvertimeText.textContent =
        overtimeHours +
        " jam " +
        overtimeMinutes +
        " menit";


    // ==========================
    // TAMPILKAN HISTORY
    // ==========================

    data.forEach(
        function (item) {

            const clockIn = item.clock_in ? new Date(item.clock_in) : null;
            const clockOut = item.clock_out ? new Date(item.clock_out) : null;


            const clockInDisplay = clockIn ? clockIn.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";


            const clockOutDisplay = clockOut ? clockOut.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-";


            const dateDisplay = (clockIn || new Date(item.created_at)).toLocaleDateString("id-ID");


            const totalSeconds =
                Number(
                    item.duration_seconds
                ) || 0;


            const hours =
                Math.floor(
                    totalSeconds / 3600
                );


            const minutes =
                Math.floor(
                    (totalSeconds % 3600) /
                    60
                );


            const seconds =
                totalSeconds % 60;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>${dateDisplay}</td>

                <td>${item.project}</td>

                <td>${clockInDisplay}</td>

                <td>${clockOutDisplay}</td>

                <td>
                    ${hours} jam
                    ${minutes} menit
                    ${seconds} detik
                </td>
            `;


            historyTable.appendChild(
                row
            );

        }
    );

}


// ==========================
// JALANKAN SAAT HALAMAN DIBUKA
// ==========================

checkUser();

loadHistory();