<p align="center">
  <h3 align="center">Instagram Messages Parser</h3>
  <p align="center">
    A project for parsing and displaying Instagram messages from a data export ZIP file, allowing users to view conversations, media, and other message details in a user-friendly format.
    <br />
    <br />
  </p>
</p>

---

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about">About</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

---

## About

Instagram Messages Parser is a web-based project designed to process and display Instagram message exports. The project reads exported JSON files, decodes Unicode strings, and presents conversations with support for images, videos, and emojis. The goal is to make it easy for users to browse and interact with their Instagram messages offline and in a format that is comparable to the Instagram website. 

### Features

- **Message Parsing**: Parses messages from JSON, including text, photos, videos, and audio files.
- **Emoji and Unicode Decoding**: Ensures all Unicode characters and emojis display properly.
- **Media Display**: Loads images, videos, and audio files from the data export.

---

## Built With

- <text> <a href="https://reactjs.org/">React</a></text> - Frontend library for UI components.
- <text> <a href="https://nextjs.org/">Next.js</a></text> - Framework for server-side rendering and API handling.
- <text> <a href="https://tailwindcss.com/">Tailwind CSS</a></text> - CSS framework for responsive styling.
- <text> <a href="https://github.com/admzip/adm-zip">ADM-ZIP</a></text> - Node.js library for reading ZIP files.

---

## Usage

### Setup the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/instagram-messages-parser

2. Install dependencies:

   ```bash
   npm install

3. Start the dev server:

    ```bash
    npm run dev

### Parsing Instagram Messages:

1. Go to Instagram settings and download your data export in the JSON format. You can choose to only download messages.

2. Once you download the exported data, extract the ZIP file content and find the "inbox" folder, compress the inbox folder to a ZIP file and upload it to the dev server.

3. The website will parse JSON files and extract conversations, displaying each message along with media files if present.

## Contributing

Contributions are welcome! If you have suggestions or bug fixes, please open a pull request. All contributions will be reviewed and merged if they improve the project’s functionality or structure.

