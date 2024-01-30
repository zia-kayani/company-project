const express = require("express");
const router = express.Router();
const pool = require("../db/index.js");

// Register department for a company
router.post('/registerDepartment', async (req, res) => {
    try {
        //   const { companyId, departmentId } = req.body;
        const companyId = 26;
        const departmentId = 2;

        const departmentQuery = 'INSERT INTO company_department (company_id, department_id) VALUES ($1, $2)';
        const departmentValues = [companyId, departmentId];

        await pool.query(departmentQuery, departmentValues);

        res.status(200).json({ success: true, message: 'Department registered for the company.' });
    } catch (error) {
        console.error('Error during department registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error during department registration.' });
    }
});

// Delete department and associated employees
router.delete('/deleteDepartment', async (req, res) => {
    try {
        // const departmentId = req.params.departmentId;
        const departmentId = 3;

        // Delete employees associated with the department
        const deleteEmployeesQuery = 'DELETE FROM employee WHERE department_id = $1';
        await pool.query(deleteEmployeesQuery, [departmentId]);

        // Delete the department and its association with the company
        const deleteDepartmentQuery = 'DELETE FROM company_department WHERE department_id = $1';
        await pool.query(deleteDepartmentQuery, [departmentId]);

        res.status(200).json({ success: true, message: 'Department and associated data deleted successfully.' });
    } catch (error) {
        console.error('Error during department deletion:', error);
        res.status(500).json({ success: false, message: 'Internal server error during department deletion.' });
    }
});

//getting all departments 
router.get("/departments", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM department')
        res.json(result.rows)
    }
    catch (err) {
        console.log(`department get error : ${err}`)
        res.status(500).json({ error: 'internal server error' })
    }
})

module.exports = router;