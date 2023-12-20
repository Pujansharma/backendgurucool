const shortid = require("shortid");
const URL = require("../models/url");
const qrcode = require('qrcode');
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  // Encode the original URL for QR code
  const qrCodeData = await qrcode.toDataURL(body.url);

  // Generate short ID for the short URL
  const shortID = shortid.generate();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    qrCode: qrCodeData, 
    visitHistory: [], 
  });

  return res.json({ shortId: shortID, qrCode: qrCodeData });
}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
