const express = require('express');
const router = express.Router();
const pool = require("../db/index.js");

// Register employee in a specific department of a company
router.post('/registerEmployee', async (req, res) => {
    try {
        const { companyName, departmentName, employeeName, employeeEmail, employeePassword } = req.body;
       
        // Get company ID based on company name
        const companyQuery = 'SELECT company_id FROM company WHERE company_name = $1';
        const companyResult = await pool.query(companyQuery, [companyName]);

        if (companyResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Company not found.' });
        }

        const companyId = companyResult.rows[0].company_id;

        // Get department ID based on department name
        const departmentQuery = 'SELECT department_id FROM department WHERE department_name = $1';
        const departmentResult = await pool.query(departmentQuery, [departmentName]);

        if (departmentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }

        const departmentId = departmentResult.rows[0].department_id;

        // Insert employee with retrieved company and department IDs
        const employeeInsertQuery = 'INSERT INTO employee (employee_name, employee_email, employee_password, department_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING employee_id';
        const employeeValues = [employeeName, employeeEmail, employeePassword, departmentId, companyId];

        const employeeResult = await pool.query(employeeInsertQuery, employeeValues);

        if (!employeeResult) {
            throw new Error('Employee could not be registered');
        }

        res.status(200).json({ success: true, message: 'Employee registered successfully.' });
    } catch (err) {
        console.log(`Error encountered during employee registration: ${err}`);
        res.status(500).json({ success: false, message: 'Internal server error during employee registration.' });
    }
});


// Update employee password and email for a specific company and department
router.put('/updateEmployee', async (req, res) => {
    try {
        //   const { employeeId, companyId, departmentId, employeeEmail, employeePassword } = req.body;

        const employeeId = 7;
        const companyId = 26;
        const departmentId = 2;
        const employeeEmail = "rencho@gmail.com"
        const employeePassword = "rd12345"
        // Check if the employee belongs to the specified company and department
        const checkEmployeeQuery = 'SELECT * FROM employee WHERE employee_id = $1 AND company_id = $2 AND department_id = $3';
        const checkEmployeeValues = [employeeId, companyId, departmentId];
        const checkEmployeeResult = await pool.query(checkEmployeeQuery, checkEmployeeValues);

        if (checkEmployeeResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found in the specified company and department.' });
        }

        // Update employee password and email
        const updateEmployeeQuery = 'UPDATE employee SET employee_email = $1, employee_password = $2 WHERE employee_id = $3';
        const updateEmployeeValues = [employeeEmail, employeePassword, employeeId];
        await pool.query(updateEmployeeQuery, updateEmployeeValues);

        res.status(200).json({ success: true, message: 'Employee details updated successfully.' });
    } catch (err) {
        console.log(`Error encountered during employee update: ${err}`);
        res.status(500).json({ success: false, message: 'Internal server error during employee update.' });
    }
});



//delete employee frmo  employee table
router.delete('/deleteEmployee', async (req, res) => {
    try {
        // const employeeId = req.params.employeeId;
         const employeeId =  8;
        // Delete the employee
        const deleteEmployeeQuery = 'DELETE FROM employee WHERE employee_id = $1';
        await pool.query(deleteEmployeeQuery, [employeeId]);

        res.status(200).json({ success: true, message: 'Employee deleted successfully.' });
    } catch (error) {
        console.error('Error during employee deletion:', error);
        res.status(500).json({ success: false, message: 'Internal server error during employee deletion.' });
    }
});

//gettting employees record 
router.get("/employees", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee')
        res.json(result.rows)
    }
    catch (err) {
        console.log(`department get error : ${err}`)
        res.status(500).json({ error: 'internal server error' })
    }
  })


module.exports = router;