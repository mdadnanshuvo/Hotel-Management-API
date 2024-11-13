# Hotel Management API

A robust RESTful API for managing hotels, rooms, and images. Built with Node.js, Express, and TypeScript, this API provides CRU operations, making it ideal for hotel management applications. 

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Directory Structure](#directory-structure)
- [Endpoints](#endpoints)
  - [Hotels](#hotels)
  - [Rooms](#rooms)
  - [Images](#images)
- [Testing](#testing)
- [Technologies Used](#technologies-used)


---

## Features

- **Hotels and Rooms Management**: CRU operations for hotels and rooms.
- **Image Uploading**: Handle and store hotel and room images.
- **Error Handling**: Comprehensive error handling for a seamless user experience.
- **Test Coverage**: Tests for controllers and routes ensure reliability.

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Express.js
- TypeScript
- Jest (for testing)

### Installation

1. Clone the repository:
    ```bash
   https://github.com/mdadnanshuvo/Hotel-Management-API.git
    cd Hotel-Management-API
    ```

2. Install dependencies:
    ```bash
    npm install
 ```
3. Run the project:
  ```bash
    npm run dev
 ```
4. Test all the http methods:
   ```bash
    npm test
 ```
### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:
PORT=3000                           # Port number for the server
HOTEL_IMG_PATH=uploads/hotel        # Directory for storing hotel images
ROOM_IMG_PATH=uploads/room          # Directory for storing room images

