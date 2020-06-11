var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project2', {useNewUrlParser: true,useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Kết nối database thành công");
});
module.exports = mongoose;