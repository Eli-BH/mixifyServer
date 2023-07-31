require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const qs = require("qs");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path: server\index.js
app.post("/api/spotify/token", async (req, res) => {
  const { code, redirect_uri, client_id } = req.body;

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log({ data });
    res.json(data);
  } catch (error) {
    console.log({ error });
    res.status(400).json(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
