# MindGuard - Mental Health Monitor

MindGuard is a browser extension and parental dashboard system designed to monitor web content for potential mental health risk indicators using GenAI models like LLaMA 3.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js & npm installed.
- Ollama installed with LLaMA 3 model.
- React installed globally (`npm install -g create-react-app`).
- Git installed.

---

### Steps to follow
```bash
git clone https://github.com/Kaviyarasan357/VIRTUSA-JatayuS4-Technocrates.git
cd VIRTUSA-JatayuS4-Technocrates


1.Backend

cd backend
npm start

2.Frontend (Parental Dashboard):

cd  parental dashboard
npm start

3.Run Ollama with LLaMA 3
Ensure Ollama is installed and run the LLaMA 3 model:

ollama pull llama3
ollama run llama3

Keep this terminal running as your GenAI backend.

4.Start Backend Server:

Open a new terminal window/tab

cd backend
node server.js

5. Run React Parental dashboard:
In a new terminal

cd dashboard
npm start

6. Load Browser Extension:
Open Chrome > Extensions > Enable Developer Mode.

Click Load unpacked.

Select the extension directory from this project.

