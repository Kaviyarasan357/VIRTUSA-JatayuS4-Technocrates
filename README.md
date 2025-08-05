# MindGuard - Mental Health Monitor

MindGuard is a browser extension and parental dashboard system designed to monitor web content for potential mental health risk indicators using GenAI models like LLaMA 3.


## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js & npm installed.
- Ollama installed with LLaMA 3 model.
- React installed globally (`npm install -g create-react-app`).
- Git installed.



### 2. Clone the Repository
```
git clone https://github.com/Kaviyarasan357/VIRTUSA-JatayuS4-Technocrates.git
cd VIRTUSA-JatayuS4-Technocrates


**### 3.Backend**
cd backend
npm start

**### 4.Frontend (Parental Dashboard):**

cd  parental dashboard
npm start

**### 4. Run Ollama with LLaMA 3**
Ensure Ollama is installed and run the LLaMA 3 model:

ollama pull llama3
ollama run llama3

Keep this terminal running as your GenAI backend.

**###5.Start Backend Server**
Open a new terminal window/tab:

cd backend
node server.js

**###7. Run React Parental dashboard**
In a new terminal

cd dashboard
npm start

**###8. Load Browser Extension**
Open Chrome > Extensions > Enable Developer Mode.

Click Load unpacked.

Select the extension directory from this project.

