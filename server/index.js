const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')

const app = express();

app.use(bodyParser.json());
app.use(cors())


mongoose.connect('mongodb+srv://cloud:cloud@cluster0.bcyfl.mongodb.net/?retryWrites=true&w=majority', {
  // useNewUrlParser: true,
//   useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  fullUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
});

const UrlModel = mongoose.model('Url', urlSchema);

app.post('/shorten', async (req, res) => {
  const { fullUrl } = req.body;

  try {
    const existingUrl = await UrlModel.findOne({ fullUrl });
    if (existingUrl) {
      // res.json({ shortUrl: existingUrl.shortCode });
      res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}`});
    } else {
      const shortCode = generateShortCode();
      
      const newUrl = new UrlModel({ fullUrl, shortCode });
      await newUrl.save();

      res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlMapping = await UrlModel.findOne({ shortCode });

    if (urlMapping) {
      res.redirect(urlMapping.fullUrl);
    } else {
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function generateShortCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortCode;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
