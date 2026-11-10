(function () {
  "use strict";
  const config = window.WEDDING_CONFIG || {};
  const $ = function (selector) { return document.querySelector(selector); };
  const params = new URLSearchParams(window.location.search);
  const guestName = (params.get("name") || "").trim().slice(0, 80);
  const rawType = (params.get("type") || "").toLowerCase();
  const guestType = ["family", "couple", "single"].includes(rawType) ? rawType : "family";
  const seatLimit = guestType === "single" ? 1 : (guestType === "couple" ? 2 : 5);
  const openingScreen = $("#openingScreen");
  const invitationContent = $("#invitationContent");
  const audio = $("#weddingAudio");
  const audioToggle = $("#audioToggle");
  const toast = $("#toast");
  let toastTimer = null;
  let audioUnavailable = false;

  function safeText(value, fallback) { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 4300);
  }
  function invitationMessage() {
    if (!guestName) return "ඔබ වෙත කෙරෙන ගෞරවනීය ආරාධනාවයි";
    if (guestType === "family") return guestName + " ඇතුළු පවුලේ සැමට කෙරෙන ගෞරවනීය ආරාධනාවයි";
    if (guestType === "couple") return guestName + " සහ සහකාරිය/දෙපළට කෙරෙන ගෞරවනීය ආරාධනාවයි";
    return guestName + " වෙත කෙරෙන ගෞරවනීය ආරාධනාවයි";
  }
  function mapsUrl(query) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query || "Kandy, Sri Lanka"); }
  function openVenueMap(query, label) {
    const search = query || "Kandy, Sri Lanka";
    $("#mapModalTitle").textContent = label || "උත්සව ස්ථානය";
    $("#mapModalAddress").textContent = search;
    $("#venueMapFrame").src = "https://maps.google.com/maps?q=" + encodeURIComponent(search) + "&output=embed";
    $("#mapDirections").href = mapsUrl(search);
    $("#mapModal").hidden = false;
    document.body.classList.add("map-open");
    $("#mapModalClose").focus();
  }
  function closeVenueMap() {
    $("#mapModal").hidden = true;
    $("#venueMapFrame").src = "about:blank";
    document.body.classList.remove("map-open");
  }
  function setupVenueMaps() {
    document.querySelectorAll(".map-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const eventName = link.closest(".timeline-copy").querySelector("h3").textContent;
        const eventConfig = (config.events || []).find(function (item) { return item.id + "Map" === link.id; });
        const query = eventConfig ? (eventConfig.mapQuery || (config.venue || {}).mapQuery) : (config.venue || {}).mapQuery;
        openVenueMap(query, eventName);
      });
    });
    $("#mapModalClose").addEventListener("click", closeVenueMap);
    $("#mapModal").querySelector("[data-close-map]").addEventListener("click", closeVenueMap);
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !$("#mapModal").hidden) closeVenueMap(); });
  }

  function renderConfig() {
    const couple = config.couple || {};
    const venue = config.venue || {};
    if (config.audioPath) audio.src = config.audioPath;
    $("#partnerOne").textContent = safeText(couple.nameOne, "සමන්");
    $("#partnerTwo").textContent = safeText(couple.nameTwo, "කමලී");
    $("#footerCouple").textContent = safeText(couple.englishNameOne, "Saman") + " & " + safeText(couple.englishNameTwo, "Kamali");
    $("#blessingText").textContent = safeText(config.blessing, "දෙව්රද සමන් සුමන දෙවි පිහිටෙන්...");
    $("#guestInvitation").textContent = invitationMessage();
    $("#rsvpGreeting").textContent = guestName ? "ආදරණීය " + guestName + ", මෙම සොඳුරු දිනයට ඔබ සහභාගී වන බව අපට දන්වන්න." : "මෙම සොඳුරු දිනයට ඔබ සහභාගී වන බව අපට දන්වන්න.";
    $("#heroVenue").textContent = safeText(venue.area, "මහනුවර, ශ්‍රී ලංකාව");
    $("#weddingDateText").textContent = safeText(config.dateLabel, "දිනය ඉක්මනින් දැනුම් දෙන්නෙමු");
    $("#weddingTimeText").textContent = safeText(config.timeLabel, "");
    const date = new Date(config.weddingDate || "");
    $("#footerYear").textContent = String(Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear());

    (config.events || []).forEach(function (item) {
      const timeEl = $("#" + item.id + "Time");
      const venueEl = $("#" + item.id + "Venue");
      const mapEl = $("#" + item.id + "Map");
      if (timeEl) timeEl.textContent = safeText(item.time, "");
      if (venueEl) venueEl.textContent = safeText(item.venue, safeText(venue.area, ""));
      if (mapEl) mapEl.href = mapsUrl(item.mapQuery || venue.mapQuery);
    });
  }

  function setupGuestForm() {
    const nameInput = $("#guestName");
    const attendance = $("#attendance");
    const seatCount = $("#seatCount");
    const guestOptions = $("#guestOptions");
    if (guestName) nameInput.value = guestName;
    seatCount.replaceChildren();
    for (let count = 1; count <= seatLimit; count += 1) {
      const option = document.createElement("option");
      option.value = String(count);
      option.textContent = String(count) + (count === 1 ? " ආසනයක්" : " ආසන");
      seatCount.append(option);
    }
    seatCount.value = String(seatLimit);
    if (guestType === "single") {
      seatCount.value = "1";
      seatCount.disabled = true;
      $("#seatHint").textContent = "තනි ආරාධනයක් සඳහා එක් ආසනයක් වෙන් කර ඇත.";
    } else if (guestType === "couple") {
      $("#seatHint").textContent = "දෙදෙනෙකු දක්වා ආසන තෝරාගත හැකිය.";
    } else {
      $("#seatHint").textContent = "පවුලේ සාමාජිකයන් සඳහා උපරිම ආසන 5 ක්.";
    }
    attendance.addEventListener("change", function () {
      guestOptions.classList.toggle("is-hidden", attendance.value !== "yes");
    });
    attendance.dispatchEvent(new Event("change"));
  }

  function updateCountdown() {
    const target = new Date(config.weddingDate || "");
    if (Number.isNaN(target.getTime())) {
      $("#countdownNote").textContent = "Please add the wedding date in config.js.";
      return;
    }
    const remaining = target.getTime() - Date.now();
    if (remaining <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach(function (id) { $("#" + id).textContent = "00"; });
      $("#countdownNote").textContent = "අදයි ඒ සොඳුරු දිනය!";
      return;
    }
    const total = Math.floor(remaining / 1000);
    $("#days").textContent = String(Math.floor(total / 86400)).padStart(3, "0");
    $("#hours").textContent = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
    $("#minutes").textContent = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    $("#seconds").textContent = String(total % 60).padStart(2, "0");
  }

  async function startMusic() {
    if (audioUnavailable) {
      showToast("සංගීත ගොනුව තවම එක් කර නැහැ. assets/magul-bera.mp3 ගොනුව එක් කරන්න.");
      return;
    }
    try {
      await audio.play();
      audioToggle.classList.add("is-playing");
      audioToggle.setAttribute("aria-pressed", "true");
      audioToggle.setAttribute("aria-label", "Pause wedding music");
      $(".audio-label").textContent = "සංගීතය නවත්වන්න";
    } catch (error) {
      if (audio.error) {
        audioUnavailable = true;
        showToast("Magul Bera audio එක හමු වුණේ නැහැ. README එකේ audio setup බලන්න.");
      } else {
        showToast("සංගීතය ආරම්භ කළ නොහැකි විය. නැවත උත්සාහ කරන්න.");
      }
      audioToggle.classList.remove("is-playing");
    }
  }
  function setupOpening() {
    $("#openInvitation").addEventListener("click", function () {
      const scroll = $("#invitation");
      scroll.classList.remove("is-pre-unroll", "is-unrolled");
      scroll.classList.add("is-unrolling");
      window.setTimeout(function () { scroll.classList.remove("is-unrolling"); scroll.classList.add("is-unrolled"); }, 2300);
      document.body.classList.remove("is-locked");
      openingScreen.classList.add("is-closing");
      invitationContent.classList.add("is-visible");
      audioToggle.hidden = false;
      startMusic();
      window.setTimeout(function () { openingScreen.hidden = true; }, 950);
    });
    audioToggle.addEventListener("click", function () {
      if (audio.paused) startMusic();
      else {
        audio.pause();
        audioToggle.classList.remove("is-playing");
        audioToggle.setAttribute("aria-pressed", "false");
        audioToggle.setAttribute("aria-label", "Play wedding music");
        $(".audio-label").textContent = "සංගීතය ක්‍රියාත්මක කරන්න";
      }
    });
    audio.addEventListener("error", function () {
      audioUnavailable = true;
      audioToggle.classList.remove("is-playing");
      audioToggle.setAttribute("aria-pressed", "false");
    });
  }

  function validateForm(data) {
    const name = String(data.get("guestName") || "").trim();
    if (!name) return "කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.";
    if (name.length > 80) return "නම අක්ෂර 80 කට වඩා දිගු නොවිය යුතුය.";
    const seats = Number(data.get("seatCount") || 1);
    if (data.get("attendance") === "yes" && (!Number.isInteger(seats) || seats < 1 || seats > seatLimit)) return "ඔබට අවසර ඇති ආසන ගණන තෝරන්න.";
    return "";
  }
  async function handleRsvpSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $("#formStatus");
    const submit = form.querySelector('[type="submit"]');
    const data = new FormData(form);
    const issue = validateForm(data);
    status.className = "form-status";
    if (issue) { status.textContent = issue; status.classList.add("is-error"); return; }
    const payload = {
      guestName: String(data.get("guestName")).trim(),
      attendance: data.get("attendance"),
      dietaryPreference: data.get("attendance") === "yes" ? data.get("diet") : null,
      seatCount: data.get("attendance") === "yes" ? Number(data.get("seatCount") || 1) : 0,
      note: String(data.get("guestNote") || "").trim(),
      invitationType: guestType,
      submittedAt: new Date().toISOString()
    };
    submit.disabled = true;
    submit.textContent = "යොමු කරමින්...";
    try {
      if (config.rsvpEndpoint) {
        const response = await fetch(config.rsvpEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("RSVP endpoint returned " + response.status);
        status.textContent = "ඔබගේ පිළිතුර සාර්ථකව ලැබුණා. බොහොම ස්තුතියි!";
        status.classList.add("is-success");
        form.reset();
        if (guestName) $("#guestName").value = guestName;
        $("#seatCount").value = String(seatLimit);
        $("#attendance").dispatchEvent(new Event("change"));
      } else {
        const entries = JSON.parse(localStorage.getItem("wedding-rsvp-demo") || "[]");
        entries.push(payload);
        localStorage.setItem("wedding-rsvp-demo", JSON.stringify(entries));
        status.textContent = "Demo mode: පිළිතුර මෙම browser එකේ පමණක් සුරැකුණා. Hosts වෙත යැවීමට config.js හි RSVP endpoint එක සකසන්න.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "පිළිතුර යොමු කළ නොහැකි විය. කරුණාකර උත්සව සංවිධායකයන් අමතන්න.";
      status.classList.add("is-error");
      console.error("RSVP submission failed:", error);
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'පිළිතුර යොමු කරන්න <span aria-hidden="true">✧</span>';
    }
  }
  function init() {
    document.body.classList.add("is-locked");
    renderConfig();
    setupGuestForm();
    setupOpening();
    setupVenueMaps();
    $("#rsvpForm").addEventListener("submit", handleRsvpSubmit);
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
  document.addEventListener("DOMContentLoaded", init);
})();