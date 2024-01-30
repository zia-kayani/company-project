const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const pool = require('./db/index.js');
const companyRoutes = require('./routes/company.route.js')
const departmentRoutes = require('./routes/department.route.js')
const employeeRoutes = require('./routes/employee.route.js')

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


app.use('/api/company',companyRoutes);

app.use('/api/department',departmentRoutes);

app.use('/api/employee',employeeRoutes);






app.listen(port, () => {
    console.log("server is listening on port 3000")
})


