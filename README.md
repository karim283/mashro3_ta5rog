
# CarCareX 🚗

### AI-Powered Car Care and Maintenance Web Application

CarCareX is a graduation project that aims to make car maintenance and automotive information more accessible through a modern web application powered by Artificial Intelligence.

The application integrates an AI-powered chatbot with a web-based user interface and a backend API to provide users with an interactive way to ask car-related questions and receive AI-generated responses.

## 🎯 Project Objectives

- Make automotive information more accessible.
- Provide an interactive AI chatbot for car-related questions.
- Develop a modern, user-friendly web application.
- Integrate frontend and backend technologies into a complete application.
- Explore the practical use of AI in the automotive industry.

## ✨ Key Features

### 🤖 AI-Powered Chatbot

- AI-powered conversational interface for car-related questions.
- Integration with the OpenAI API.
- Generates responses based on users' questions.
- Helps users access automotive information through natural language.
- Provides an interactive chatbot experience.

### 💻 Frontend

- Web-based user interface.
- User-friendly and intuitive design.
- Responsive layout for desktop, tablet, and mobile devices.
- Integration with the backend API.
- Interactive chatbot interface.

### ⚙️ Backend

- Built with Python and FastAPI.
- REST API for communication between the frontend and backend.
- Processes incoming chatbot requests.
- Integrates with the OpenAI API to generate AI responses.
- Uses environment variables for application configuration and API credentials.
- Includes CORS configuration to support frontend-backend communication.

### 🗄️ Database

The project architecture can support persistent data storage for application information.

Database technology and implemented database features should be documented here once confirmed.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | Backend API framework |
| OpenAI API | AI-powered chatbot |
| HTML | Web page structure |
| CSS | Styling and responsive design |
| JavaScript | Frontend interactivity |
| Railway | Backend deployment |
| Git & GitHub | Version control and source code management |

## 🏗️ Application Architecture

```text
User
  |
  v
Frontend Web Application
  |
  v
FastAPI Backend
  |
  v
OpenAI API
  |
  v
AI-Generated Response
  |
  v
Frontend Chatbot
```

The frontend sends user questions to the backend API. The backend processes the request and communicates with the OpenAI API to generate a response, which is then returned to the frontend.

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or later
- Git
- An OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/karim283/mashro3_ta5rog.git
```

```bash
cd mashro3_ta5rog
```

### 2. Set up the backend

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS / Linux:

```bash
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the backend directory.

Add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key
```

Replace the placeholder with your own API key.

**Never commit your `.env` file or expose your API key publicly.**

### 4. Run the backend

```bash
uvicorn app:app --reload
```

The backend should be available at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

> Run the command from the directory containing `app.py`. If your project uses a different entry point, update the command accordingly.

## ☁️ Deployment

The backend is deployed using Railway.

The application can be accessed through its deployed web interface:

[CarCareX Web Application](https://mashro3ta5rog-production.up.railway.app)

## 📂 Project Repository

[View the source code on GitHub](https://github.com/karim283/mashro3_ta5rog)

## 🎓 Graduation Project

CarCareX was developed as a graduation project to demonstrate the practical integration of Artificial Intelligence, backend development, frontend development, and web application deployment.

The project provided hands-on experience in developing an AI-powered application and connecting different technologies into a working system.

## 👨‍💻 Author

**Karim Emad**

GitHub: [@karim283](https://github.com/karim283)
