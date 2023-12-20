const express = require("express");
const { connection } = require("./connect");
require('dotenv').config();
const cors = require('cors');
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = process.env.port || 8001;
app.use(cors());
app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    // Find the entry where the 'shortId' matches the 'shortId' field in the database
    const entry = await URL.findOne({ shortId });

    if (entry && entry.redirectURL) {
      // Update visit history or other analytics here if needed
      $push: {
        visitHistory: {
          timestamp: Date.now()
        }
      }

      // Check if the URL ends with an image extension
      
      if (entry.redirectURL.match(/(jpeg|jpg|gif|png)$/i) != null) {
        res.header('Content-Type', 'image/*');
        return res.redirect(entry.redirectURL);
      }

      // For non-image URLs, redirect normally
      return res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL Not Found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, async() => {
  try {
    await connection;
    console.log("connected to datebase")
  } catch (error) {
    console.log("something went wrong")
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});

