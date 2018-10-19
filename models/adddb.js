var Vacation = require('./vacation.js');
// Vacation.find(function(err, vacations){
// 	if(vacations.length) return;
// 	new Vacation({
// 		name: '胡德河一日游',
// 		slug: 'hood-river-day-trip',
// 		category: 'Day Trip',
// 		sku: 'HR199',
// 		description: '花一天时间在哥伦比亚河上航行 ' +
// 		'在胡德河享受手工啤酒！',
// 		priceInCents: 19895,
// 		tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
// 		inSeason: true,
// 		maximumGuests: 16,
// 		available: true,
// 		packagesSold: 0,
// 	}).save();
// });
new Vacation({
		name: '胡德河一日游',
		slug: 'hood-river-day-trip',
		category: 'Day Trip',
		sku: 'HR199',
		description: '花一天时间在哥伦比亚河上航行 ' +
		'在胡德河享受手工啤酒！',
		priceInCents: 19895,
		tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0,
	}).save();