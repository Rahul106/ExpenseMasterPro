const {Sequelize} = require('sequelize');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Downloads = require('../models/DownloadedFile.js')
const {uploadToS3} = require('../services/awsS3service.js')



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



exports.downloadExpenseReport = async (req, res) => {

    try {
      
        const usersId = req.user.id;
        const overAllExpenses = await req.user.getExpenses();
        
        if(overAllExpenses) {
            
            const stringifiedExpenses = JSON.stringify(overAllExpenses)
            const fileName = `expensereport${usersId}/${new Date()}.json`;
            const fileUrl = await uploadToS3(stringifiedExpenses, fileName);

        if(fileUrl) {
            await Downloads.create({fileUrl, userId:usersId});
            return res.status(200).json({fileUrl, success : true})   
        }

      } else {
            return  res.json({message : "no data exists..", success : false})
      }

    } catch (err) {
      console.log("Error in fetching expenses data, error: ", err);
      res.status(500).json({fileUrl: '', success: false, err});
    }

  }




  exports.getPastHistoryURL = async (req, res) => {

    try {
         
        const prevDownloads = await req.user.getDownloadedFiles({attributes: ['fileUrl', 'updatedAt']});

        if(prevDownloads){
          return res.status(200).json({prevDownloads,success : true})     
        } else {
         return  res.json({message:"No previous Downloads..",success:false})
        }

      } catch (err) {
        console.log("Error in fetching previous Downloads data , error: ", err);
        res.status(500).json(err.message);
      }
    
  }
  