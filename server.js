const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  console.log(req.body);

  const orderId = req.body.queryResult.parameters.orderId;

  try {
    const response = await axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {
      orderId: orderId
    });

    const shipmentDate = response.data.shipmentDate;
    const formattedDate = moment(shipmentDate).format('llll');
    console.log(formattedDate);

    res.status(200).send({
      fulfillmentText: `Your order ${orderId} will be shipped on ${formattedDate}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      fulfillmentText: `An error occurred while fetching the shipment date of order ${orderId}.`
    });
  }
});

app.listen(3000, () => {
  console.log('Webhook listening on port 3000');
});
