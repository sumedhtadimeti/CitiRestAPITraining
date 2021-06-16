'use strict';

//const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  //const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
 

  const params = {
    TableName: "BankAccounts",
    Item: {
      Username: data.username,
      Password: data.password,
      UserId: parseFloat(data.userid),
      SANum: parseFloat(data.sanum),
      SavingsBalance: parseFloat(data.savingsbalance),
      CANum: parseFloat(data.canum),
      CheckingBalance: parseFloat(data.checkingbalance),
      FirstName : data.firstname,
      LastName: data.lastname
    },
  };

  console.log(params.Item.UserId)
  console.log(params.Item.SANum)
  console.log(params.Item.SavingsBalance)
  console.log(params.Item.CANum)
  console.log(params.Item.CheckingBalance)
  
  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
