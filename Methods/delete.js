'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let userID = 0 ;

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: "BankAccounts",
    
  FilterExpression: "Username = :username AND Password = :password",
  // Define the expression attribute value, which are substitutes for the values you want to compare.
  ExpressionAttributeValues: {
    ":username": event.pathParameters.username,
    ":password": event.pathParameters.password,
  },
  };

  console.log(params.ExpressionAttributeValues)
  
  dynamoDb.scan(params, function (error, result){ 
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Success", result);
      result.Items.forEach(function (element, index, array) {
        console.log(
            "printing",
            element.UserId,"(Line 31)"
        );
        // userID = parseInt(element.UserId)
        const params1 = {
          TableName: "BankAccounts",
          Key: {
            UserId: parseInt(element.UserId),
          },
        };

        // console.log("User ID: " + userID + " (Line 41)") // this is 0, needs to be a populated value

        // delete the todo from the database
        dynamoDb.delete(params1, (error, result) => {
          // handle potential errors
          if (error) {
            console.error(error);
            callback(null, {
              statusCode: error.statusCode || 501,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t remove the todo item.',
            });
            return;
          }
      
          // create a response
          const response = {
            statusCode: 200,
            body: JSON.stringify({"Account has been Closed":""}),
          };
          callback(null, response);
        });
        
      });
    }
  });




};
