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
  const { code, redirectUri } = req.body;

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.CLIENT_ID,
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
    console.error("Error message:", error.message);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error", error.message);
    }

    res.status(400).json({ message: error.message });
  }
});

app.get("/api/spotify/credentials", async (req, res) => {
  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    //send keys to device
    return res.json({
      clientId: clientId,
      clientSecret: clientSecret,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/spotify/refresh", async (req, res) => {
  try {
    const { refreshToken, code } = req.body;

    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );

    return res.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  } catch (error) {
    console.error("Error message:", error.message);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error", error.message);
    }

    res.status(400).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
