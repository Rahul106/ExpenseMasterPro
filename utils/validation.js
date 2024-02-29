
function isNotValidInput(string) {
    
    if (string === undefined || string.length === 0) {
      return true;
    } else {
      return false;
    }

  }
  
  module.exports = { isNotValidInput };
  