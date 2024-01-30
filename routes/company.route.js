const express = require("express");
const router = express.Router();
const pool = require("../db/index.js");



//to register company with employee
router.post("/register", async (req, res) => {
    try {
        // console.log(req.body)
        const { companyName, companyDescription, employeeName, employeeEmail, employeePassword, } = req.body;
        // const companyName = "butt ent";
        // const companyDescription = "butt private limite";
        // const employeeName = "butt saab";
        // const employeeEmail = "butt@gmail.com";
        // const employeePassword = "butt123";
        const departmentId = 1;

        const companyQuery = 'INSERT INTO company (company_name, company_description) VALUES ($1, $2) RETURNING company_id';
        const companyValues = [companyName, companyDescription];
        const companyResult = await pool.query(companyQuery, companyValues);
        const companyId = companyResult.rows[0].company_id;
        if (!companyResult) {
            throw new Error("company registration failed")
        }
        // else {
        //     res.json({
        //         success: 200,
        //         message: "companyregistered successfully"
        //     })
        // }

        const employeeQuery = 'INSERT INTO employee (employee_name, employee_email, employee_password, department_id, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING employee_id';
        const employeeValues = [employeeName, employeeEmail, employeePassword, departmentId, companyId];
        const employeeResult = await pool.query(employeeQuery, employeeValues);
        if (!employeeResult) {
            throw new Error("employee could not be registered")
        }
        // else {
        //     res.status(200).json({
        //         success: true,
        //         message: 'eployee registered successfully.',
        //     });

        // }

        res.status(200).json({
            success: true,
            message: 'Company and employee registered successfully.',
            companyId: companyId,
            departmentId: departmentId
        });


    }
    catch (err) {
        console.log(`error encountered ${err}`)
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})

//login api
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    // const email = "kg@gmail.com";
    // const password = "12345"
    if (!email) {

        return res.status(400).send('Email address is missing');
    }
    if (!password) {

        return res.status(400).send('Password is missing');
    }

    try {
        console.log('Query Parameters:', [email, password]);

        const employee = await pool.query(
            'SELECT employee_id, company_id FROM employee WHERE employee_email = $1 AND employee_password = $2',
            [email, password]
        );

        console.log('Query Result:', employee);

        const company_id = employee.rows.length > 0 ? employee.rows[0].company_id : null;

        if (company_id !== null) {
            // Employee is authenticated, send company_id in the response
            console.log(company_id);
            res.json({ 
                company_id,
                message: "login successful",
            });
        } else {
            // Authentication failed
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {

        console.error('Error during login:', error);

        res.status(500).json({ error: 'Internal Server Error' });

    }

});


//to get companies result
router.get("/companies", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM company')
        res.json(result.rows)
    }
    catch (err) {
        console.log(`error encountered ${err}`)
        res.status(500).json({ error: 'internal server error' })
    }
})


// Delete company and associated departments and employees
router.delete('/deleteCompany/:companyId', async (req, res) => {
    try {
        const companyId = req.params.companyId;
        // const companyId = 29;

        // Delete employees associated with the company
        const deleteEmployeesQuery = 'DELETE FROM employee WHERE company_id = $1';
        await pool.query(deleteEmployeesQuery, [companyId]);

        // Delete departments associated with the company
        const deleteDepartmentsQuery = 'DELETE FROM company_department WHERE company_id = $1';
        await pool.query(deleteDepartmentsQuery, [companyId]);

        // Delete the company
        const deleteCompanyQuery = 'DELETE FROM company WHERE company_id = $1';
        await pool.query(deleteCompanyQuery, [companyId]);

        res.status(200).json({ success: true, message: 'Company and associated data deleted successfully.' });
    } catch (error) {
        console.error('Error during company deletion:', error);
        res.status(500).json({ success: false, message: 'Internal server error during company deletion.' });
    }
});

module.exports = router;