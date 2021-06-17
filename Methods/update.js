'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let userID = 0 ;

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "BankAccounts",
    
  FilterExpression: "Username = :username AND Password = :password",
  // Define the expression attribute value, which are substitutes for the values you want to compare.
  ExpressionAttributeValues: {
    ":username": data.oldusername,
    ":password": data.oldpassword,
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
          ExpressionAttributeNames: {
            '#Username': 'Username',
            '#Password': 'Password',
          },
          ExpressionAttributeValues: {
            ':username': data.newusername,
            ':password': data.newpassword,
          },
          UpdateExpression: 'SET #Username = :username, #Password = :password',
          ReturnValues: 'ALL_NEW',
        };
        
        dynamoDb.update(params1, (error, result) => {
              // handle potential errors
              if (error) {
                console.error(error);
                callback(null, {
                  statusCode: error.statusCode || 501,
                  headers: { 'Content-Type': 'text/plain' },
                  body: 'Couldn\'t fetch the todo item.',
                });
                return;
              }
          
              // create a response
              const response = {
                statusCode: 200,
                body: JSON.stringify(result.Attributes),
              };
              callback(null, response);
            });

        // // console.log("User ID: " + userID + " (Line 41)") // this is 0, needs to be a populated value

        // // delete the todo from the database
        // dynamoDb.delete(params1, (error, result) => {
        //   // handle potential errors
        //   if (error) {
        //     console.error(error);
        //     callback(null, {
        //       statusCode: error.statusCode || 501,
        //       headers: { 'Content-Type': 'text/plain' },
        //       body: 'Couldn\'t remove the todo item.',
        //     });
        //     return;
        //   }
      
        //   // create a response
        //   const response = {
        //     statusCode: 200,
        //     body: JSON.stringify({"Account has been Closed":""}),
        //   };
        //   callback(null, response);
        // });
        


      });
    }
  });




};










// 'use strict';

// const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.exports.update = (event, context, callback) => {
//   const timestamp = new Date().getTime();
//   const data = JSON.parse(event.body);

//   // validation
//   if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
//     console.error('Validation Failed');
//     callback(null, {
//       statusCode: 400,
//       headers: { 'Content-Type': 'text/plain' },
//       body: 'Couldn\'t update the todo item.',
//     });
//     return;
//   }

//   const params = {
//     TableName: "BankAccounts",
//     Key: {
//       id: event.pathParameters.id,
//     },
//     ExpressionAttributeNames: {
//       '#todo_text': 'text',
//     },
//     ExpressionAttributeValues: {
//       ':text': data.text,
//       ':checked': data.checked,
//       ':updatedAt': timestamp,
//     },
//     UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
//     ReturnValues: 'ALL_NEW',
//   };

//   // update the todo in the database
//   dynamoDb.update(params, (error, result) => {
//     // handle potential errors
//     if (error) {
//       console.error(error);
//       callback(null, {
//         statusCode: error.statusCode || 501,
//         headers: { 'Content-Type': 'text/plain' },
//         body: 'Couldn\'t fetch the todo item.',
//       });
//       return;
//     }

//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify(result.Attributes),
//     };
//     callback(null, response);
//   });
// };
