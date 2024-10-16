# Execution Engine: A Containerized Code Execution Platform

## Project Overview

The **Execution Engine** is designed to execute large volumes of foreign code securely in containerized environments. Leveraging **Docker** for isolation and **Bull MQ** for task queuing, this system ensures each code submission runs in an isolated container without network access, preventing unauthorized actions. This project highlights backend technologies like **message queues**, **workers**, and **containerization**, showcasing scalable and secure systems.

### Key Features

- **Execution in Isolated Environments**: Code runs within Docker containers, providing complete isolation from the host system.
- **No Network Access**: Containers have no network access, ensuring secure execution of potentially untrusted code.
- **Cloud Output Storage**: Execution logs (stdout and stderr) are saved to Google Cloud Storage, providing scalable and secure access to output.
- **C++ Support**: Currently supports C++ code execution, with plans for future support of additional languages.
  
### Technologies Used

- **Docker**: Containerization to securely run user-submitted code in isolated environments.
- **Docker Compose**: Orchestrates multiple services locally for simplified setup.
- **Bull MQ**: Built on Redis, it manages execution queues and processes tasks efficiently.
- **Redis**: Message broker for handling job queues.
- **PostgreSQL**: Relational database for storing job metadata and execution results.
- **Google Cloud Storage**: Used to store and retrieve execution outputs securely.

### System Architecture

1. **Bull MQ**: Manages task queues, distributing execution jobs to worker processes running in isolated threads.
2. **Docker Containers**: Ensure code execution is secure and sandboxed, with no network access and limited system resources.
3. **Worker Threads**: Handles CPU-bound execution tasks efficiently in a scalable, responsive architecture.

---

## API Endpoints

### 1. **`/api/v1/submission` (POST)**
Submit code via file upload.
- **Request**: 
  - Method: `POST`
  - Type: `multipart/form-data`
  - Field: `sourceCode` (file)
- **Response**:
  ```json
  {
    "message": "File uploaded and pushed to queue successfully",
    "id": "<id>",
    "fileName": "<fileName with extension>"
  }
  ```

### 2. **`/api/v1/submission/url` (POST)**
Submit code by providing a URL to the file.
- **Request**: 
  - Method: `POST`
  - Type: `application/json`
  - Body: `{ "url": "<url_link_of_file>" }`
- **Response**:
  ```json
  {
    "message": "File uploaded and pushed to queue successfully",
    "id": "<id>",
    "fileName": "<fileName with extension>"
  }
  ```

### 3. **`/api/v1/submission/url` (GET)**
Get the output link after code execution.
- **Request**: 
  - Method: `GET`
  - Query Parameter: `id`
- **Response**:
  ```json
  {
    "message": "Executed URL fetched successfully",
    "codeId": "<id>",
    "executedUrl": "<downloadable url expires in 30 min>"
  }
  ```

---

## Local Setup

Follow these steps to set up the project locally:

1. Ensure you have **Docker** and **Docker Compose** installed.
2. You need to mount your `serviceAccount.js` file, which contains Firebase configurations (such as `config`, `storageBucket`, `firebase database url`, and `uploadDestination`).

   - Place the `serviceAccount.js` file in the `/home/aryan/judge0/config/` directory. If you don’t have it, copy and modify `/config/serviceAccountDemo.js` with your Firebase credentials.

   The relevant volume setup in `docker-compose.yml`:

   ```yaml
   volumes:
     - /home/aryan/judge0:/app/judge0
     - /home/aryan/judge0/config/serviceAccount.js:/app/judge0/config/serviceAccount.js
     - /var/run/docker.sock:/var/run/docker.sock
   ```

3. Ensure that the `storageBucket` in `serviceAccount.js` matches your Firebase bucket address, and the `firebase database url` is set to your Firebase Realtime Database.

4. Start the services by running:

   ```bash
   docker-compose up
   ```

---

## Future Enhancements

- **Support for More Languages**: The engine currently supports only C++. Future updates will include support for additional programming languages.
- **Real-Time Resource Monitoring**: Implementing real-time resource monitoring for containers, enforcing strict CPU and memory limits during code execution.

---

This project reflects my passion for backend development, utilizing containerization, message queues, and concurrency to build secure, scalable systems. Future updates will continue to enhance the system's capabilities and performance.


