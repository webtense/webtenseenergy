const express = require('express');
const aws4 = require('aws4');
const https = require('https');
require('dotenv').config();

const app = express();
const port = 3000;

app.get('/ofertas', (req, res) => {
  const options = {
    host: 'webservices.amazon.es',
    path: '/paapi5/getitems',
    method: 'POST',
    service: 'ProductAdvertisingAPI',
    region: 'eu-west-1',
    headers: {
      'Content-Encoding': 'amz-1.0',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      "ItemIds": ["B09F9X9PYK", "B07Q9MK8ZB"],
      "Resources": [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
        "Offers.Listings.SavingBasis",
        "DetailPageURL"
      ],
      "PartnerTag": process.env.ASSOCIATE_TAG,
      "PartnerType": "Associates",
      "Marketplace": "www.amazon.es"
    })
  };

  aws4.sign(options, {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const reqAWS = https.request(options, awsRes => {
    let data = '';
    awsRes.on('data', chunk => data += chunk);
    awsRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const items = parsed.ItemsResult?.Items?.map(item => ({
          title: item.ItemInfo?.Title?.DisplayValue || '',
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || '',
          old_price: item.Offers?.Listings?.[0]?.SavingBasis?.DisplayAmount || '',
          url: item.DetailPageURL,
          image: item.Images?.Primary?.Large?.URL || ''
        })) || [];
        res.json(items);
      } catch (e) {
        res.status(500).send(e.toString());
      }
    });
  });

  reqAWS.on('error', error => res.status(500).send(error.toString()));
  reqAWS.write(options.body);
  reqAWS.end();
});

app.listen(port, () => {
  console.log(`Amazon API server listening at http://localhost:${port}`);
});
