# Usage Guide

## ▶️ Running the Application
After following the installation steps in `SETUP.md`, you can run the application from the project's root directory.

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Open the application:**
    The terminal will display a local URL (usually `http://localhost:5173/`). Open this URL in your web browser.

## 🖥️ How to Use
The application is designed to be simple and intuitive.

1.  **Select a Mode:** Choose the context for your speech (`General`, `Job Interview`, or `Business Pitch`).
2.  **Start Recording:** Click the **"Start Recording"** button. The first time you do this, your browser will ask for permission to use your microphone. Please click **"Allow"**.
3.  **Speak:** Deliver your speech for at least 15-20 seconds to ensure a good analysis. You will see your words transcribed in the text box in real-time.
4.  **Stop Recording:** When you're finished, click the **"Stop Recording"** button.
5.  **Review the Analysis:** A loading spinner will appear for a few moments. Afterwards, the AI's detailed analysis of your speech—including scores and feedback—will be displayed.
6.  **(Optional) Toggle Dark Mode:** Use the ☀️/🌙 icon in the top right corner to switch between light and dark themes.

## 🎥 Demo
Check out the demo files located in the `demo/` folder of this repository:
- **[Demo Video](../demo/[your-video-file.mp4])**
- **[Demo Presentation](../demo/[your-presentation-file.pptx])**

*(Note: Please replace the bracketed filenames with the actual names of your video and presentation files.)*

## 📌 Notes
- For the best experience, please use a modern browser like **Google Chrome**, as it has the most robust support for the Web Speech API.
- Ensure you have a working microphone connected and have granted the site permission to access it.
- Speaking for a longer duration will provide the AI with more context, leading to a more accurate and detailed analysis.