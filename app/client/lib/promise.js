//export const callPromise = (method, contract, contractMethod, args) => {
callPromise = (method, contract, contractMethod, args) => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, contract, contractMethod, args,  (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
