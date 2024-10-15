# Execution Engine: A Containerized Code Execution Platform

## Project Overview

# Execution Engine: A Containerized Code Execution Platform

## Project Overview

The **Execution Engine** is designed to efficiently execute large volumes of foreign code in secure, containerized environments. By leveraging **Docker** for isolation and **Bull MQ** for task queuing, the system ensures that each code submission runs in an isolated container with no network access, preventing unauthorized actions. This project demonstrates my knowledge of backend technologies such as **message queues**, **workers**, and **containerization**, and showcases my passion for building scalable, secure systems.

The engine currently supports C++ code execution, with plans to extend support to additional languages and integrate cloud storage for output management.

### System Design
For a deeper dive into the system design and database schema, you can view the [system design document](https://app.eraser.io/workspace/kNItSZQCCJMyLWKMz0mY?origin=share).

### API Endpoints

#### 1. `/api/v1/submission` (POST)
This endpoint is used to submit code via a file upload.
- **Request**: 
  - Method: `POST`
  - Type: `multipart/form-data`
  - Field: `sourceCode` (file)

#### 2. `/api/v1/submission/url` (POST)
This endpoint is used to submit code by providing a URL to the file.
- **Request**:
  - Method: `POST`
  - Type: `application/json`
  - Body: `{ "url": "<url_link_of_file>" }`

### Technologies Used
- **Docker**: Core containerization technology that runs the foreign code in isolated environments, enforcing strict security measures such as no network access.
- **Docker Compose**: Simplifies local setup and orchestration of different services.
- **Bull MQ**: A message queue service built on Redis, which pulls incoming execution requests into a queue and processes them using workers.
- **Redis**: Serves as a message broker for queuing tasks.
- **PostgreSQL**: A relational database for storing job metadata and execution results.

### Project Architecture

The Execution Engine is designed to handle foreign code execution in a containerized environment:
- **Bull MQ** handles incoming execution requests, queues them, and delegates them to worker processes. These workers run in separate threads to ensure the system remains responsive while handling CPU-bound activities.
- **Docker** isolates code execution, ensuring that user-submitted code is run securely with no network access and limited system resources, preventing unauthorized access or harmful operations.
- **Worker Threads**: By utilizing worker threads in a single-threaded environment, I’ve been able to efficiently handle CPU-bound tasks without blocking the main process, achieving a more scalable and responsive architecture.

### Key Features
- **Execution in Isolated Environment**: Code is executed in a Docker container, ensuring complete isolation and preventing any interference with the host system.
- **No Network Access**: Network access within the container is disabled, ensuring secure execution of potentially untrusted code.
- **Output Storage**: The output of the code execution (stdout and stderr logs) is streamed from the isolated environment and saved to a local text file or cloud storage, depending on the environment.
- **Support for C++**: Currently, the engine supports execution of C++ files, with plans to extend support to other languages in the future.

### Objectives
- **Containerization & Docker**: To implement and strengthen my understanding of Docker and containerization, particularly in securely running foreign code.
- **Message Queues & Workers**: To learn and apply the concepts of message queues and workers, building a scalable system that efficiently handles task execution.
- **Concurrency & CPU-Bound Tasks**: To manage CPU-bound activities in a single-threaded environment, ensuring high system responsiveness and scalability.

### Local Setup
To run this project locally, ensure that you have **Docker** and **Docker Compose** installed. Then, simply run the following command to start all the services:

```bash
docker-compose up
```

### Future Enhancements
- **Support for More Languages**: Currently, the engine supports only C++ code execution. Future iterations will add support for more programming languages.
- **Cloud Integration**: Plans to extend output storage to cloud services like AWS S3 or Google Cloud Storage.
- **Resource Monitoring**: Implementing real-time resource monitoring for containers, enforcing strict CPU and memory limits.


---

This project reflects my passion for backend development, showcasing my understanding of key technologies like Docker, message queues, and concurrency. It is a work in progress, and I’m excited to further develop it into a robust, scalable platform for securely executing foreign code.

