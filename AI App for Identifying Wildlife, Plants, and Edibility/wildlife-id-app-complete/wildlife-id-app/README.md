# WildID - Wildlife & Plant Identification App

WildID is a web-based application that uses AI to identify wildlife, plants, and fungi from images. It provides detailed information about the identified species, including edibility and herbal benefits.

## Features

*   **AI-Powered Identification**: Utilizes a mock AI model to identify birds, plants, and fungi from user-uploaded images.
*   **Comprehensive Species Information**: Displays detailed information about the identified species, including common and scientific names, description, habitat, edibility, and herbal benefits.
*   **Interactive User Interface**: A modern and user-friendly interface built with React and shadcn/ui.
*   **Scalable Backend**: A Python Flask backend with a mock database that can be expanded with real data.
*   **European Species Coverage**: Includes data for European wildlife and plants.

## Technology Stack

*   **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
*   **Backend**: Python, Flask, Flask-CORS
*   **AI Model**: Mock API (can be replaced with a real model)

## Project Structure

```
wildlife-id-app/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── ...
├── README.md
└── ...
```

## Getting Started

### Prerequisites

*   Node.js and npm
*   Python 3 and pip

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd wildlife-id-app
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    pip3 install -r backend/requirements.txt
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    python3 app.py
    ```

    The backend will be running at `http://localhost:5000`.

2.  **Start the frontend development server:**

    In a new terminal, navigate to the project root and run:

    ```bash
    npm run dev -- --host
    ```

    The frontend will be accessible at `http://localhost:5173`.

## Documentation

*   **App Design Document**: [`app_design_document.md`](/home/ubuntu/app_design_document.md)
*   **User Guide**: A comprehensive guide on how to use the application.
*   **Deployment Guide**: Instructions for deploying the frontend and backend.

