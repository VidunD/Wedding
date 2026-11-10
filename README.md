# Kandyan Wedding Sannasa

A responsive, traditional Kandyan-inspired digital wedding invitation built with HTML5, CSS3 and vanilla JavaScript.

## Features

- Parchment opening overlay with a user-initiated invitation reveal and audio-play attempt.
- Sinhala/English traditional styling, gold ornaments, Pala Pethi border and Pun Kalasa SVG.
- Guest-specific invitation text from URL query parameters.
- Animated royal sannasa, live countdown and event itinerary with Google Maps links.
- RSVP form validation and seat limits based on invitation type.
- Responsive layouts, keyboard focus styles and reduced-motion support.

## Preview

Open index.html in a local web server, or enable GitHub Pages for this repository.

Example guest links:

- ?name=Vidun&type=single
- ?name=Vidun&type=couple
- ?name=Vidun&type=family
- Sinhala names are supported too, for example ?name=%E0%B7%80%E0%B7%92%E0%B6%AF%E0%B7%94%E0%B6%B1%E0%B7%8A&type=single

The type value controls the maximum guest count: single = 1, couple = 2, family = 5.

## Personalise the wedding

Edit config.js to add the real couple names and blessing, ISO wedding date/time with the Sri Lanka offset (+05:30), date/time labels, venue, map search terms and event details.

The names, date, time and venue currently in the repository are sample content. Replace them before sharing the invitation.

## Background Magul Bera audio

Add an audio file that you own or are licensed to use at assets/magul-bera.mp3.

The invitation opening button attempts playback after a visitor taps it (browser autoplay restrictions require this user gesture). The floating audio control can pause or resume playback. The repository does not include a music recording.

## Connect the RSVP form

The form currently runs in demo mode because no RSVP service has been configured. In demo mode, submissions are stored only in that visitor's browser using local storage; the couple/organisers cannot see them.

To receive real responses:

1. Create an HTTPS endpoint on a backend or serverless function that accepts a JSON POST.
2. Store guestName, attendance, dietaryPreference, seatCount, note, invitationType and submittedAt in a database or spreadsheet.
3. Configure CORS for your invitation domain and return a successful 2xx status when the response is saved.
4. Put the endpoint URL in config.js as rsvpEndpoint.

Do not put private API keys or database credentials in this public repository. Validate the invitation type and seat limit again on the server; client-side restrictions are not a security boundary.

## Publish with GitHub Pages

1. Open repository Settings → Pages.
2. Under Build and deployment, choose Deploy from a branch.
3. Select branch main and folder /(root), then save.
4. Wait for GitHub Pages to publish the site and use the URL shown in the Pages section.

## Project structure

- index.html — semantic invitation page.
- styles.css — responsive theme and animations.
- config.js — wedding details and integration settings.
- app.js — guest personalisation, countdown, music controls and RSVP flow.
- assets/ — custom vector ornaments and optional audio file.
