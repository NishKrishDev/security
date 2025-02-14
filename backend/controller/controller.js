import { securityPoolDB } from "../database/dbConnection.js"
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const algorithm = 'aes-256-cbc';
const secretKey = 'abcdefghijklmnopqrstuvwxyz123456';


const encryptData = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'utf-8'), iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
}

const decryptData = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'utf-8'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

export const testController = (req, res) => {
    res.json({
        'message': 'Test Server Running Properly'
    })
}

export const securityPoolDBController = async (req, res) => {
    try {
        const data = await securityPoolDB.query(`SELECT * FROM public."testTable" ORDER BY id ASC`);
        console.log('DB DATA', data.rows);
        res.status(200).json({
            'status': 200,
            'message': 'success',
            'data': data.rows
        })
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "error": error.message,
            "message": 'Unable to connect to database'
        })
    }
}

export const insertData = async (req, res) => {
    try {
        console.log(req.body)
        const { id, name } = req.body;
        const { encryptedData, iv } = encryptData(name);
        const insertQuery = `INSERT INTO public."testTable" (name, iv) VALUES ($1, $2);`
        const values = [encryptedData, iv];
        const result = await securityPoolDB.query(insertQuery, values);
        res.status(200).json({
            "status": 200,
            "message": 'Inserted data successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            "status": 400,
            "error": error.message,
            "message": 'Unable to insert data in database'
        })
    }
}

export const fetchData = async (req, res) => {
    try {

        const { id } = req.body;

        const fetchQuery = `Select name, iv from public."testTable" where id = $1`;
        const values = [id];
        const result = await securityPoolDB.query(fetchQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                "status": 404,
                "message": 'Data not found'
            })
        }

        const { name: encryptedData, iv } = result.rows[0];
        const decryptedData = decryptData(encryptedData, iv);

        res.status(200).json({
            "status": 200,
            "message": 'Data fetched successfully',
            "data": {
                "id": id,
                "data": decryptedData
            }
        })

    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            "status": 400,
            "error": error.message,
            "message": 'Unable to fetch data from database'
        })
    }
}


export const insertPassword = async (req, res) => {

    const { name, password } = req.body;
    if (!password) {
        return res.status(400).json({
            'message': 'Password is required'
        })
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const insertPasswordQuery = `INSERT INTO public."testUser"(name, password) VALUES ($1, $2);`;
        const values = [name, hashedPassword];
        const result = await securityPoolDB.query(insertPasswordQuery, values);

        res.status(200).json({
            'name': name,
            'password': hashedPassword
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            'status': 500,
            'error': error.message,
            'message': 'Error hashing password',
        })
    }
}

export const sendFormData = async (req, res) => {
    try {
        const { designation, email, password } = req.body;
        console.log(designation, email, password);

        const insertQuery = `INSERT INTO public."formUser"(email, password, designation) VALUES ($1, $2, $3);`
        const values = [email, password, designation];
        const result = await securityPoolDB.query(insertQuery, values);
        res.status(200).json({
            'message' : 'Data inserted successfully',
            'data' : req.body
        })
    } catch (error) {
        console.log('Error while sending form data', error.message);
        res.status(400).json({
            'message': 'Error while sending data',
            'error': error.message
        })
    }
}

export const fetchUserData = async(req, res) => {
    try {
        const { encryptedEmail } = req.params;
        console.log(encryptedEmail);

        res.status(200).json({
            'message' : 'success'
        })
        
    } catch (error) {
        console.log('Error while fetching user data', error.message);
        res.status(400).json({
            'message' : 'Error while fetching user data details',
            'error' : error.message
        })
    }
}
