require('./style.css');
var tml = require('./template.ejs');
document.write(tml + require("./content.js"));