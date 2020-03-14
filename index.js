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
const DATE_FORMAT = 'MM-DD-YYYY';

const getNumber = stringNumber =>
	stringNumber.length !== 0 ? parseInt(stringNumber) : 0;

const proccess = async () => {
	let current = moment('01-22-2020');
	let today = moment();
	//const today = moment();
	const result = {};

	while (current <= today) {
		//await sleep(1);
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
				//check if date for country already exists
				let currentDateDataForCountry =
					result[region.countryRegion][currentDate];

				if (currentDateDataForCountry) {
					// just sum
					result[region.countryRegion][currentDate].confirmed += getNumber(
						region.confirmed,
					);
					result[region.countryRegion][currentDate].recovered += getNumber(
						region.recovered,
					);
					result[region.countryRegion][currentDate].deaths += getNumber(
						region.deaths,
					);
				} else {
					// just create and initialize
					result[region.countryRegion][currentDate] = {};
					result[region.countryRegion][currentDate].confirmed = getNumber(
						region.confirmed,
					);
					result[region.countryRegion][currentDate].recovered = getNumber(
						region.recovered,
					);
					result[region.countryRegion][currentDate].deaths = getNumber(
						region.deaths,
					);
				}
			} else {
				result[region.countryRegion] = {};
				result[region.countryRegion][currentDate] = {
					confirmed: getNumber(region.confirmed),
					recovered: getNumber(region.recovered),
					deaths: getNumber(region.deaths),
				};
			}
		});

		current.add(1, 'd');
	}

	console.log(result);
};

proccess();
