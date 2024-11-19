const express = require("express");
const database = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const videoRoutes = require("./routes/videoRoutes");
const port = process.env.PORT || 5000;
const fs = require("fs")
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/videos", videoRoutes);


const YAML = require('yaml')

const file  = fs.readFileSync('./documentation.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// 

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// 
database()
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
