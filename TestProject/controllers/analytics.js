let Order = require('../models/Order');
let moment = require('moment')
let errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req, res) {
    try {

        let allOrders = await Order.find({ user: req.user.id }).sort({date: 1});
        let ordersMap = getOrdersMap(allOrders);
        let yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

        //Кол-во заказов вчера
        let yesterdayOrdersNumber = yesterdayOrders.length;

        //Кол-во заказов
        let totalOrdersNumber = allOrders.length;

        //Кол-во дней всего
        let daysNumber = Object.keys(ordersMap).length;

        //Заказов в день
        let ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

        //% для кол-ва заказов
        let ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

        //Общая выручка
        let totalGain = calculatePrice(allOrders);

        //Выручка в день
        let gainPerDay = totalGain / daysNumber;

        //Выпучка за вчера
        let yesterdayGain = calculatePrice(yesterdayOrders);

        //Процент выручки
        let gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);

        //Сравнение выручки
        let compareGain = (yesterdayGain - gainPerDay).toFixed(2);

        //Сравнение кол-ва заказов
        let compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    }
    catch (e) {
        errorHandler(res, e);
    }
}

module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 });
        const ordersMap = getOrdersMap(allOrders);
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

        const chart = Object.keys(ordersMap).map(label => {
            const gain = calculatePrice(ordersMap[label]);
            const order = ordersMap[label].length

            return {
                label, order, gain 
            }
        })

        res.status(200).json({
            average, chart
        })
    } catch (e) {
        errorHandler(res, e);
    }
}

function getOrdersMap(orders = []) {
    let daysOrders = {};
    orders.forEach(order => {
        let date = moment(order.date).format('DD.MM.YYYY');

        if (date === moment().format('DD.MM.YYYY'))
            return

        if (!daysOrders[date]) {
            daysOrders[date] = [];
        }

        daysOrders[date].push(order);
    })

    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        let orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0)
        return total += orderPrice
    }, 0)
}