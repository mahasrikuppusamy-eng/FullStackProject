<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dba2a639-48e5-4587-8e7d-886ada5bc41c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in the server environment (see [server/.env.example](server/.env.example)). Keep the key server-side and never commit it.
3. Run the app:
   `npm run dev`

## Voice Search and AI Assessments

Voice search parses place names, Coimbatore areas, categories, and accessibility features from recognized speech; it filters the place directory and is not a generative chat assistant. Sample searches are available when browser speech recognition is unavailable.

Image assessments require a valid server-side `GEMINI_API_KEY`. Without it, the API reports that assessments are unavailable instead of returning invented results. Image-based observations can be uncertain, and important access details should be confirmed with the venue.

GitHub Pages serves static files only. Account creation, the places API, and Gemini assessments require the Express server to be deployed separately with its environment variables configured.
