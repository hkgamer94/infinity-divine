window.addEventListener("load", async () => {

    if (!window.supabaseClient) {
        console.error("Supabase client not found.");
        return;
    }

    const { data, error } = await window.supabaseClient
        .from("daily_panchang")
        .select("*")
        .order("panchang_date", { ascending: false })
        .limit(1)
        .maybeSingle();

    console.log("Supabase Data:", data);
    console.log("Supabase Error:", error);

    if (error) {
        console.error(error);
        return;
    }

    if (!data) {
        console.log("No Panchang data found.");
        return;
    }

    document.getElementById("todayDate").textContent = data.panchang_date;
    document.getElementById("todayDay").textContent = data.day;
    document.getElementById("todayTithi").textContent = data.tithi;
    document.getElementById("todayNakshatra").textContent = data.nakshatra;
    document.getElementById("todayRashi").textContent = data.moon_sign;

});