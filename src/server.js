const app = require("./app");
const firebase=require("./../config/firebase");

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`${__dirname}`);
});
