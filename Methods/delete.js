'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let userID = 0;

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
            element.UserId, "(Line 31)"
        );
        setTimeout(function() { updateID(element.userID); }, 1000);
      });
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Items),
      };
    }
  });

  setTimeout(deleteUser,1500)

};

function updateID(tempUserID) {
  userID = parseInt(tempUserID);
}

function deleteUser() {
  const params1 = {
    TableName: "BankAccounts",
    Key: {
      UserId: userID,
    },
  };
  console.log("User ID: " + userID + " (Line 48)")

    // delete the todo from the database
    dynamoDb.delete(params1, (error) => {
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
}