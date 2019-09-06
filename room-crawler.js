const { launch } = require('puppeteer');
const { stringify } = require('querystring');
const moment = require('moment');

const HOTEL_URL = 'https://myreservations.omnibees.com';
const DATE_FORMAT = 'YYYYMMDD';

module.exports.getRooms = getRooms;

function getRooms(checkIn, checkOut) {
  checkIn = moment(checkIn).format(DATE_FORMAT);
  checkOut = moment(checkOut).format(DATE_FORMAT);

  const query = buildQuery(checkIn, checkOut);
  const url = `${HOTEL_URL}/default.aspx?${query}`;

  return evalueatePage(url);
}

async function evalueatePage(url) {
  const browser = await launch();
  const page = await browser.newPage();

  await page.goto(url);

  const roomsData = await page.evaluate((hotelUrl) => {
    const rooms = [];

    document.querySelectorAll('.roomExcerpt').forEach((roomExcerpt) => {
      const room = {};

      room.title = roomExcerpt.querySelector('.excerpt h5 a').textContent;
      room.price = roomExcerpt.querySelector('.sincePrice h6').textContent;
      room.description = roomExcerpt.querySelector('.excerpt .description').textContent;
      room.imageUrl = hotelUrl + roomExcerpt.querySelector('.thumb .slide a').getAttribute('href');

      rooms.push(room);
    });

    return rooms;
  }, HOTEL_URL);

  await browser.close();

  return roomsData;
}

function buildQuery(checkIn, checkOut) {
  const query = {
    q: '5462',
    version: 'MyReservation',
    sid: 'b9a6b77c-6f4e-4818-8b2a-6ad2d6d80195#/',
    diff: false,
    CheckIn: checkIn,
    CheckOut: checkOut,
    Code: '',
    group_code: '',
    loyality_card: '',
    NRooms: 1,
    ad: 1,
    ch: 0,
    ag: '-'
  };

  return stringify(query);
}
