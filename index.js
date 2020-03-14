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

const API = `https://covid19.mathdro.id/api/daily/`;

const proccess = async () => {
	const current = {
		day: 2,
		month: 1,
		year: 2020,
	};
	const today = {
		day: 14,
		month: 3,
		year: 2020,
	};
	const result = {};

	//while(current.day !== today.day && current.month !== today.month) {

	const currentDate = `${current.day}-${current.month}-${current.year}`;
	let data = await got(`${API}${currentDate}`);
	data = await JSON.parse(data.body);

	data.forEach(region => {
		let resultCountryRegion = result[region.countryRegion];

		if (resultCountryRegion) {
			let currentDateDataForCountry = result[region.countryRegion][currentDate];

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

	console.log(JSON.stringify(result));
	//}
};

proccess();
