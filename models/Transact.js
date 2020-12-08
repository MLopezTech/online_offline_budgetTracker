const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  
  
  
  
  {
    name: {
      type: String,
      trim: true,
      required: "Transact name input"
    },
    value: {
      type: Number,
      required: "input amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }




);






const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
