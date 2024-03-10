const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');



exports.purchasePremium = async (req, res) => {
    
    try {
      
        const rzp_Instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
       
        const amount = 10000;
        const currency = 'INR';
        const order = await rzp_Instance.orders.create({ amount, currency});
        
            await Order.create({
                userId:  req.user.id,
                orderid: order.id,
                amount: order.amount,
                currency: order.currency,
                status: 'PENDING',
                orderDate: order.created_at
            });

            return res
            .status(201)
            .json({ order, key_id: rzp_Instance.key_id });

    } catch (err) {
       res.status(403).json({message: 'Something went Wrong', error: err}) 
    }

};





exports.updateTransactionStatus = async (req, res) => {

    try {
        
        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        
        await Promise.all([
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }),
            User.update({ ispremiumuser: true }, { where: { id: req.user.id } })
        ]);

        return res.status(202).json({ success: true, message: 'Transaction Successful.!' });
    
    } catch (error) {
        await Order.update({ status: 'FAILED', paymentid: payment_id }, { where: { orderid: order_id } });
        console.error(error);
        return res.status(403).json({ error, message: 'Transaction Failed. Please try again' });
    }

};
