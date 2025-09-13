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

1. **Clone the repository**
   ```bash
   git clone https://github.com/edsboys/PitchPerfectAI.git
   cd PitchPerfectAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your Gemini API Key**
   * Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   * Click "Create API Key"
   * Copy the generated key

4. **Configure Environment Variables**
   * Create a `.env` file in the project root:
   ```bash
   echo "VITE_GEMINI_API_KEY=your_actual_key_here" > .env
   ```

## ▶️ Running the Project

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the application**
   * Navigate to `http://localhost:5173`
   * Allow microphone permissions when prompted

## 🔧 Troubleshooting

**Microphone not working?**
- Ensure browser has microphone permissions
- Chrome/Edge work best for Web Speech API

**API errors?**
- Verify your API key is correct in `.env`
- Check your internet connection

**Build errors?**
- Try deleting `node_modules` and running `npm install` again
- Ensure Node.js version is 18+