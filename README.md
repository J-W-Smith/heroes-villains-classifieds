# Heroes & Villains Classifieds

This is a playful **classifieds‑style web app** where heroes, villains and mercenaries can post ads to find nemeses, sidekicks, henchmen, or contracts. The design intentionally echoes the minimal feel of old‑school classified sites like Craigslist – lightweight, text‑centric and easy to browse.

## Running Locally

The site is completely static and doesn’t require any special backend to run. You have two options:

1. **Open the HTML file directly:**  
   
   ‑ After downloading or cloning the project, open `index.html` in your favourite web browser. All styling and markup live in the same folder, so it will just work.

2. **Serve the files via a tiny local web server (recommended for development):**  
   
   ‑ Install [Node.js](https://nodejs.org/) if you don’t have it already (version 14 or later is fine).  
   ‑ Use npm to install the `http-server` package globally:

     ```sh
     npm install -g http-server
     ```

   ‑ Change into this project directory and run:

     ```sh
     http-server
     ```

   ‑ The command will print a local address (often `http://127.0.0.1:8080`). Open it in your browser to browse the site.

## Project Structure

```
/
├── index.html   # Main page with sections for heroes, villains and mercs
├── style.css    # Basic styling inspired by classifieds
└── README.md    # Project documentation and setup instructions
```

Feel free to modify the content or add your own listings. This codebase is deliberately simple to make customisation easy.
