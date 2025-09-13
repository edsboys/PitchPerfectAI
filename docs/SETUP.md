# Setup Instructions

Follow the steps below to set up and run the **Pitch Perfect AI** project locally.

---

## 📦 Requirements
To run this project, you will need the following installed on your system:

- **Node.js v18+**
- A modern web browser that supports the **Web Speech API** (Google Chrome is highly recommended).
- A **working microphone**.
- **Git** for cloning the repository.

---

## ⚙️ Installation

1.  **Clone the repository**
    Open your terminal and run the following commands:
    ```bash
    git clone [https://docs.github.com/en/get-started/using-github/connecting-to-github](https://docs.github.com/en/get-started/using-github/connecting-to-github)
    cd PitchPerfectAI
    ```

2.  **Install dependencies**
    This command will install all the necessary packages for the project, including React.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    This project requires a Google Gemini API key. As per the hackathon guidelines, secrets must be kept out of the repository.

    * Create a new file in the root of the project named `.env`.
    * Open the `.env` file and add your API key in the following format, replacing `YOUR_API_KEY_HERE` with your actual key:
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

## ▶️ Running the Project

1.  **Start the development server**
    Once all dependencies are installed and your environment variables are set, run the following command from the project's root directory:
    ```bash
    npm run dev
    ```

2.  **Open the application**
    The terminal will display a local URL (usually `http://localhost:5173/`). Open this URL in your web browser to view and interact with the application.