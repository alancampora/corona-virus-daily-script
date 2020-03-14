/*
 *{
 *  'China':{
 *      '2-01-2020':{
 *      day: '2-01-2020',
 *      confirmed: 599,
 *      deaths: 0,
 *      recovered: 21
 *    }
 *    '3-01-2020':{
 *      day: '2-01-2020',
 *      confirmed: 700,
 *      deaths: 1,
 *      recovered: 31
 *  }
 *},
 *}
 */

const got = require('got');
const moment = require('moment');
var { sleep } = require('sleep');
const API = `https://covid19.mathdro.id/api/daily/`;
const DATE_FORMAT = 'DD-MM-YYYY';

const proccess = async () => {
	let current = moment('2020-01-02');
	const today = moment();
	const result = {};

	while (current <= today) {
		await sleep(1);
		const currentDate = current.format(DATE_FORMAT);
		const endpoint = `${API}${currentDate}`;
		let data;
		try {
			data = await got(endpoint);
			data = await JSON.parse(data.body);
		} catch (e) {
			data = [];
		}

		data.forEach(async region => {
			let resultCountryRegion = result[region.countryRegion];

			if (resultCountryRegion) {
				let currentDateDataForCountry =
					result[region.countryRegion][currentDate];

				if (currentDateDataForCountry) {
					currentDateDataForCountry.confirmed += parseInt(region.confirmed);
					currentDateDataForCountry.recovered += parseInt(region.recovered);
					currentDateDataForCountry.deaths += parseInt(region.deaths);
				} else {
					currentDateDataForCountry = {
						confirmed: parseInt(region.confirmed),
						recovered: parseInt(region.recovered),
						deaths: parseInt(region.deaths),
					};
				}
			} else {
				result[region.countryRegion] = {};
				result[region.countryRegion][currentDate] = {
					confirmed: parseInt(region.confirmed),
					recovered: parseInt(region.recovered),
					deaths: parseInt(region.deaths),
				};
			}
		});

		current.add(1, 'd');
  }

  console.log(result);
};

proccess();
