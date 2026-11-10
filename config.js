/* Replace these sample values with the real wedding details. */
window.WEDDING_CONFIG = {
  couple: { nameOne: "සමන්", nameTwo: "කමලී", englishNameOne: "Saman", englishNameTwo: "Kamali" },
  blessing: "දෙව්රද සමන් සුමන දෙවි පිහිටෙන්...",
  // Sample wedding date. Use an ISO date with Sri Lanka offset (+05:30).
  weddingDate: "2027-06-20T10:08:00+05:30",
  dateLabel: "2027 ජූනි 20 වන ඉරිදා",
  timeLabel: "පෙ.ව. 10.08 ට",
  venue: { name: "මංගල උත්සව ශාලාව", area: "මහනුවර, ශ්‍රී ලංකාව", mapQuery: "Kandy, Sri Lanka" },
  events: [
    { id: "poruwa", time: "පෙ.ව. 10.08", venue: "මංගල උත්සව ශාලාව · මහනුවර", mapQuery: "Kandy, Sri Lanka" },
    { id: "tea", time: "පෙ.ව. 11.30", venue: "මංගල උත්සව ශාලාව · මහනුවර", mapQuery: "Kandy, Sri Lanka" },
    { id: "reception", time: "ප.ව. 12.30", venue: "මංගල උත්සව ශාලාව · මහනුවර", mapQuery: "Kandy, Sri Lanka" }
  ],
  // Add a licensed audio recording at this path.
  audioPath: "assets/magul-bera.mp3",
  // Add an HTTPS JSON POST endpoint to transmit RSVPs to your server/database.
  rsvpEndpoint: ""
};