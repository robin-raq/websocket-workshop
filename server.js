const path = require("path");
const express = require("express");

// initialize and run express server
const app = express();
const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Set up static folder
app.use(express.static(path.join(__dirname, "public")));
