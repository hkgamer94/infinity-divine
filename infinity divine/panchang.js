window.addEventListener("load", async () => {

    if (!window.supabaseClient && typeof supabaseClient === "undefined") {
        console.log("Supabase client not ready.");
        return;
    }

    const client =
        window.supabaseClient ||
        supabaseClient;

    const { data, error } = await client
        .from("daily_panchang")
        .select("*")
        .order("panchang_date", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("todayDate").textContent = data.panchang_date;
    document.getElementById("todayDay").textContent = data.day;
    document.getElementById("todayTithi").textContent = data.tithi;
    document.getElementById("todayNakshatra").textContent = data.nakshatra;
    document.getElementById("todayRashi").textContent = data.moon_sign;

});