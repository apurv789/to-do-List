//creating and assigning anonymous function to exports object.
module.exports.getDate = function() {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  var currentDay = today.toLocaleDateString("en-us", options);
  return currentDay;
}
module.exports.getDay = function() {
  var today = new Date();
  var options = {
    weekday: "long",
  }
  var currentDay = today.toLocaleDateString("en-us", options);
  return currentDay;
}