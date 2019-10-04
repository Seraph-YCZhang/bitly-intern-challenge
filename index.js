/*
 * Filename: /Users/zhangyuchen/Downloads/bitly/index.js
 * Path: /Users/zhangyuchen/Downloads/bitly
 * Created Date: Saturday, March 30th 2019, 11:22:02 am
 * Author: zhangyuchen
 * 
 * Copyright (c) 2019 Your Company
 */
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  request = require('request'),
  dateFormat = require('date-and-time')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const token = '16017548d905da826a59d511418a3fc9f3cfb92a';

getId = (res) => {
  let jsonBody;
  let id;
  request.get('https://api-ssl.bitly.com/v4/user', {
    'auth': {
      'bearer': token
    }
  }, function (e, r, body) {
    if (!e && r.statusCode == 200) {
      // console.log(r.body)
      console.log(jsonBody = JSON.parse(body))
      console.log(id = jsonBody["default_group_guid"])
      getLinks(id, res);
      // getCountries(id);

    } else {
      console.log(e)
    }
  });
}

getLinks = (group_guid, res) => {
  let jsonBody;
  let links;
  let url = "https://api-ssl.bitly.com/v4/groups/" + group_guid + "/bitlinks"
  request.get(url, {
    'auth': {
      'bearer': token
    }
  }, function (e, r, body) {
    if (!e && r.statusCode == 200) {
      jsonBody = JSON.parse(body)
      links = jsonBody["links"];
      console.log(jsonBody)
      // console.log(links) 
      getClicks(links, res)
      // console.log(avg_clicks_country)


    } else {
      console.log(e)
    }

  })
}
getClicks = (links, res) => {
  let avg_clicks_country = [];
  let date = '';

  count = 0
  links.forEach(element => {
    // console.log(element.id)

    let jsonBody;
    let url = "https://api-ssl.bitly.com/v4/bitlinks/" + element.id + "/countries"
    // console.log(url)
    request.get(url, {

      'unit': "day",
      'units': "30",
      'auth': {
        'bearer': token
      }

    }, function (e, r, body) {

      if (!e && r.statusCode == 200) {
        jsonBody = JSON.parse(body)
        let linkId = jsonBody.id
        data = jsonBody["metrics"]
        date = jsonBody["unit_reference"]
        console.log("###test###")
        console.log(jsonBody)
        for (var i = 0; i < data.length; i++) {
          if (checkValue(avg_clicks_country, data[i]['value']) == false) {
            avg_clicks_country.push({
              "value": data[i].value,
              "avg_clicks": data[i].clicks / 30
            })
          } else {
            avg_clicks_country[i]['avg_clicks'] = (avg_clicks_country[i]['avg_clicks'] * 30 + data[i].clicks) / 30
          }
        }
        count++
      } else {
        console.log(e)
      }

      if (count == links.length) {

        formRes(avg_clicks_country, date, res)
      }
    })
  }
  )
}

checkValue = (items, value) => {
  for (var i = 0; i < items.length; i++) {
    if (items[i]["value"] == value) {
      return true
    }
  }
  return false
}

formRes = (avg_clicks_country, date, res) => {
  // var now = new Date();
  // now = dateFormat.format(now, "YYYY-MM-DDTHH:mm:ssZ");
  // console.log(now)
  res.send(JSON.stringify({
    "units": 30,
    "unit_reference": date,
    "metrics": avg_clicks_country,
    "unit": "day",
    "facet": "countries",

  }))
}

getCountries = (group_guid) => {
  let url = "https://api-ssl.bitly.com/v4/groups/" + group_guid + "/countries"
  request.get(url, {
    'auth': {
      'bearer': token
    }
  }, function (e, r, body) {
    if (!e && r.statusCode == 200) {
      let jsonBody = JSON.parse(body)
      console.log(jsonBody)
    } else {
      console.log(e)
    }
  })
}

app.get('/', function (req, res) {
  getId(res);
})



app.listen(8000, function () {
  console.log("start!")
});


// getId();



