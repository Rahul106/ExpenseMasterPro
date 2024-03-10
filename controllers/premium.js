const { Sequelize } = require('sequelize');
const Expense = require('../models/Expense');
const User = require('../models/User');




exports.getStatus = async (req, res) => {

    try {
        
        const user = await User.findOne({
            where : {
                id : req.user.id,
                isPremiumUser : true
            } 
        });

        if(user) {
            res.status(200).json({isPremiumUser: true});
        } else {
            res.status(200).json({isPremiumUser: false});
        }
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};





exports.getLeaderboard = async (req, res) => {

    try {
        
        console.log('----'+req.user.id);
        
        const leaderBoardData = await User.findAll({
            attributes: [
              'name',
              [Sequelize.fn('sum', Sequelize.col('expenses.amount')), 'totalAmount']
            ],
            include: [{
              model: Expense,
              attributes: [],
              where: {
                type: 'expense'
              }
            }],
            group: ['User.id'],
            order: [[Sequelize.literal('totalAmount'), 'DESC']]
        });
        
        res.status(200).json(leaderBoardData);
    
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};