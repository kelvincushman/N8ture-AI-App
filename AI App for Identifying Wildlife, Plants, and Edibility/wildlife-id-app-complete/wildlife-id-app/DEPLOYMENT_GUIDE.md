# WildID Deployment Guide

This guide provides instructions for deploying the WildID application to a production environment.

## 1. Frontend Deployment (React)

The frontend of the application is a static React app that can be deployed to any static hosting service.

### 1.1. Build the Application

First, you need to build the production-ready version of the React app. Navigate to the project's root directory and run:

```bash
npm run build
```

This will create a `dist` directory containing the optimized static files.

### 1.2. Deploy to a Static Hosting Service

You can deploy the `dist` directory to any static hosting service. Here are a few popular options:

*   **Netlify**: A popular choice for deploying static sites. You can drag and drop the `dist` folder to the Netlify dashboard or connect your Git repository for continuous deployment.
*   **Vercel**: Another excellent platform for deploying frontend applications. Similar to Netlify, you can use their CLI or connect your Git repository.
*   **GitHub Pages**: A free option for hosting static sites directly from your GitHub repository.

## 2. Backend Deployment (Flask)

The backend is a Python Flask application that needs to be deployed to a server that can run Python code.

### 2.1. Prepare for Production

When moving to production, you should use a production-ready WSGI server instead of the built-in Flask development server. Gunicorn is a popular choice.

1.  **Install Gunicorn:**

    ```bash
    pip3 install gunicorn
    ```

2.  **Create a WSGI entry point:**

    Create a file named `wsgi.py` in the `backend` directory with the following content:

    ```python
    from app import app

    if __name__ == "__main__":
        app.run()
    ```

### 2.2. Deploy to a PaaS or VPS

*   **Heroku**: A popular Platform-as-a-Service (PaaS) that makes it easy to deploy Python applications.
    1.  Create a `Procfile` in the project's root directory with the following content:

        ```
        web: gunicorn --chdir backend wsgi:app
        ```

    2.  Follow the Heroku documentation to create an app and deploy your code.

*   **DigitalOcean, Linode, or AWS EC2**: You can also deploy the backend to a Virtual Private Server (VPS). This will give you more control over the environment but also requires more setup and maintenance.
    1.  Set up a new server with a Linux distribution (e.g., Ubuntu).
    2.  Install Python, pip, and a web server like Nginx.
    3.  Configure Nginx as a reverse proxy to forward requests to Gunicorn.
    4.  Use a process manager like `systemd` to keep the Gunicorn process running.

## 3. Environment Variables

In a production environment, you should configure the following environment variables:

*   `FLASK_ENV=production`
*   `SECRET_KEY`: A secret key for your Flask application.

Make sure to update the `API_BASE_URL` in the frontend code to point to the URL of your deployed backend.

