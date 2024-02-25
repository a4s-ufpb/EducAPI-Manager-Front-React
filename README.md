# EducAPI Manager Frontend

This is the frontend of the EducAPI Manager. It is a web application that allows the user to manage the EducAPI.

## How to run

First, you need to run the [EducAPI](https://github.com/a4s-ufpb/EducAPI) API on your machine. Then, you can clone this repository and install its dependencies with:

```bash
npm install
```

You will also need to create a `.env` file in the root of the project with the following content:

```env
VITE_API_URL=http://localhost:8080
```

After that, you can start the application with:

```bash
npm run dev
```

Then, you can access the application on your browser at `http://localhost:5173`.

### With Docker

You can also run this application with Docker and Docker Compose with:

```bash
docker compose up
```

You still will need to run the API before as mentioned above.
