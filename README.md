# AI-Powered Interview Assistant

This is my internship assignment project for **Swipe**.  
The goal was to build a React app that works as an **AI-powered interview assistant** with two main views:  
- **Interviewee (Chat)**  
- **Interviewer (Dashboard)**  

---

## Features

### Interviewee (Chat)
- Uploads **resume (PDF/DOCX)**.  
- Extracts candidate details (Name, Email, Phone).  
- If any field is missing, the chatbot asks for it before interview.  
- Runs a **timed interview**:  
  - 2 Easy questions (20s each)  
  - 2 Medium questions (60s each)  
  - 2 Hard questions (120s each)  
- Questions appear one by one with timers.  
- At the end, AI generates a **final score + summary**.

### Interviewer (Dashboard)
- Shows **list of all candidates** ordered by score.  
- Can view candidate’s **profile, chat history, answers, and AI summary**.  
- Includes **search + sort** options.  

### Persistence
- Data is stored locally (using Redux + localStorage/IndexedDB).  
- If the app is refreshed/closed, progress is restored.  
- Shows a **Welcome Back modal** for unfinished interviews.  

---

## Tech Stack
- **React** (Create React App)  
- **Redux Toolkit + redux-persist** (state management + persistence)  
- **Ant Design / shadcn UI** for styling components  
- **pdf-parse / mammoth** (for PDF/DOCX parsing)  

---

## Running the Project

```bash
# Install dependencies
npm install

# Run locally
npm start
