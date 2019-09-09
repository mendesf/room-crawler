const puppeteer = require('puppeteer');
const { stringify } = require('querystring');
const moment = require('moment');

const HOTEL_URL = 'https://myreservations.omnibees.com';

module.exports.evalueatePage = async (url) => {
  const browser = await puppeteer.launch();
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

module.exports.buildURL = (reservationInfo) => {
  const { checkIn, checkOut, adults, children, ages } = reservationInfo;

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
    ad: adults,
    ch: children,
    ag: ages
  };

  const queryString = stringify(query);

  return `${HOTEL_URL}/default.aspx?${queryString}`;
}
