import client from '../database/db.js';
        //id	SERIAL
        // name	VARCHAR(50)
        // appointment\_time	TIMESTAMP
        // barber\_id	INTEGER
        // status	VARCHAR(20)
const addClient = async (req, res) => {
    try {
      await client.query("set search_path to 'admin'");

      const { client_id, name, appointment_time, barber_id, status } = req.body;
      // Check if client_id and barber_id are valid integers
      const c_id = parseInt(client_id);
      const b_id = parseInt(barber_id);

      // Validate the parsed values to ensure they are valid integers
      if (isNaN(c_id) || isNaN(b_id)) {
        return res
          .status(400)
          .json({ error: "Invalid client_id or barber_id "  ,value: c_id });
      }

      const a_time = new Date(appointment_time);

      // Ensure the appointment_time is a valid date
      if (isNaN(a_time.getTime())) {
        return res.status(400).json({ error: "Invalid appointment_time" });
      }
      const result = await client.query(
        "INSERT INTO clients(client_id,client_name, appointment_time, barber_id, status) VALUES($1, $2, $3, $4,$5) RETURNING *",
        [c_id, name, a_time, b_id, status]
      );
      res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const fetchClients = async (req, res) => {
    try {
        await client.query("set search_path to 'admin'");
        const result = await client.query('SELECT * FROM clients');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export { addClient, fetchClients };