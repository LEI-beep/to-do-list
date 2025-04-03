import express from 'express';
import { db } from './db.js';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(express.json());
const PORT = 3000;


app.get('/get-users', (req,res) => {
    const query = "SELECT * FROM users";
    db.query(query)
    .then(users => {
        res.status(200).json({ users: users.rows });
    });
});


//get titles

app.get('/get-titles', (req, res) => {
    const query = "SELECT * FROM titles";
    db.query(query)
    .then(titles => {
        res.status(200).json({ titles: titles.rows });
    });
});


//get lists
app.post("/get-lists", (req, res) => {
  const { title_id } = req.body;

  
  const query = "SELECT * FROM lists WHERE title_id = $1";
  
  db.query(query, [title_id])
    .then(result => {
      res.status(200).json({ lists: result.rows });
    })
    .catch(error => {
      console.error("Database query error:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});



//get status
app.get('/get-status', (req, res) => {
    const query = "SELECT id, status FROM titles"; // Select title_id and status from titles

    db.query(query)
    .then(result => {
        res.status(200).json({ data: result.rows }); // Send the retrieved data
    })
    .catch(error => {
        console.error("Error fetching statuses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    });
});


//UPDATE TITLES AND LIST
app.post("/update-title", async (req, res) => {
  try {
    const { id, title, status } = req.body;

    if (!id || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const formattedStatus = status ? true : false;

    const result = await db.query(
      "UPDATE titles SET title = $1, status = $2 WHERE id = $3",
      [title, formattedStatus, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No record updated" });
    }

    res.json({ message: "Title updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Failed to update title", error: err.message });
  }
});






// Update List Item Description and Status
app.post("/update-list", async (req, res) => {
  const { id, list_desc, status } = req.body;

  if (!id || list_desc === undefined || status === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = "UPDATE lists SET list_desc = $1, status = $2 WHERE id = $3 RETURNING *"; // ✅ RETURNING * for verification

  db.query(query, [list_desc, status, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating list item:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.rowCount === 0) { // ✅ PostgreSQL uses rowCount
      console.warn("⚠️ No list item found with id:", id);
      return res.status(404).json({ message: "List item not found" });
    }

    console.log("✅ Update successful:", result.rows[0]); // Debugging output
    res.json({ message: "List item updated successfully", updatedItem: result.rows[0] });
  });
});

// Delete a task
router.delete("/delete-task/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ success: false, message: "Task ID is required." });
  }

  try {
      const result = await db.query("DELETE FROM tasks WHERE id = $1", [id]);

      if (result.rowCount > 0) {  // PostgreSQL uses `rowCount`, not `affectedRows`
          return res.status(200).json({ success: true, message: "Task deleted successfully." });
      } else {
          return res.status(404).json({ success: false, message: "Task not found." });
      }
  } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ success: false, message: "Internal server error." });
  }
});




/* app.post ('/title', (req,res) => {
    const { id,username, title, date_modified, status } = req.body;
    const query = "INSERT INTO titles (id, username, title, date_modified, status) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    db.query(query,[id, username, title, date_modified, status])
    .then(result => {
        res.status(200).json ({ succes: true });
    });
});

    const { id, title_id, list_desc, status } = req.body;
    const query = "INSERT INTO lists (id, title_id, list_desc, status VALUES ($1,$2,$3,$4)";
    db.query(query,[id, title_id,list_desc, status])
    .then(result => {
        res.status(200).json ({ succes: true });
    }); */

app.post ('/check-user', (req, res) =>{
    const { username, password } = req.body;

    const query = "SELECT * FROM accounts WHERE username=$1 AND password=$2";

    db.query(query, [username, password])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({ exist: "Login successfull" });
        }

        else {
            res.status(200).json ({ exist: false });
        }
    });
});

app.post('/add-user', (req, res) => {
  const { username, password, name } = req.body;

  const query = "INSERT INTO accounts (username, password, name) VALUES ($1, $2, $3)";
  db.query(query, [username, password, name])
    .then(result => {
      res.status(200).json({ success: "User successfully added" });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    });
});





//register user
app.post ('/register', (req,res) => {
    const { username, password, fname, lname } = req.body;

    const query = "INSERT INTO users (username, password, fname, lname) VALUES ($1,$2,$3,$4)";
    db.query(query,[username, password, fname, lname])
    .then(result => {
        res.status(200).json ({ succes: true });
    });
});

//register titles
app.post ('/register-titles', (req,res) => {
    const { id,username, title, date_modified, status } = req.body;

    const query = "INSERT INTO titles (id,username, title, date_modified, status) VALUES ($1,$2,$3,$4,$5)";
    db.query(query,[id, username, title, date_modified, status])
    .then(result => {
        res.status(200).json ({ succes: true });
    });
});


//register list
app.post ('/register-lists', (req,res) => {
    const { id, title_id, list_desc, status } = req.body;

    const query = "INSERT INTO lists (id, title_id, list_desc, status) VALUES ($1,$2,$3,$4)";
    db.query(query,[id, title_id, list_desc, status])
    .then(result => {
        res.status(200).json ({ succes: true });
    });
});


//INDEX ROUTE
app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/to-do', (req, res) => {
    res.send('this is to-do homepage');
});

/* app.post('/add-to-do', (req, res) => { */
/*     res.send('this is add-to-do homepage'); */

    //object destruction
/*     const { fname, lname } = req.body;
    res.send(`Hello ${fname} ${lname}`);
}); */

app.post('/update-to-do', (req, res) => {
    res.send('this is update-to-do homepage');
});

app.get('/delete-to-d', (req, res) => {
    res.send('this is delete-to-do homepage');
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

















//insert titles and list
app.post('/add-to-do', async (req, res) => {
    const { username, title, lists, status } = req.body;
    const date_modified = new Date().toISOString();
  
    const titleQuery = "INSERT INTO titles (username, title, date_modified, status) VALUES ($1, $2, $3, $4) RETURNING id";
    
    db.query(titleQuery, [username, title, date_modified, status])
      .then(result => {
        const title_id = result.rows[0].id;
  
        const listQueries = lists.map(task =>
          db.query("INSERT INTO lists (title_id, list_desc, status) VALUES ($1, $2, $3)", [title_id, task, status])
        );
  
        return Promise.all(listQueries);
      })
      .then(() => {
        res.status(200).json({ success: true, message: "To-Do List added successfully" });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding To-Do List" });
      });
  });
  



// delete titles and list
app.post('/delete-to-do', (req, res) => {
  const { id } = req.body;
  
    // First, delete tasks related to the title_id
    const deleteListsQuery = "DELETE FROM lists WHERE title_id = $1";

    db.query(deleteListsQuery, [id])
      .then(() => {
        const deleteTitleQuery = "DELETE FROM titles WHERE id = $1";
        return db.query(deleteTitleQuery, [id]);
      })    
      .then(() => {
        res.status(200).json({ success: true, message: "To-Do successfully deleted" });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting To-Do" });
      });
});


//update-status
app.post('/update-status', (req, res) => {
    const { title_id, list_id, status } = req.body;
  
    // Update status in titles table if title_id is provided
    const updateTitleQuery = title_id ? "UPDATE titles SET status = $1 WHERE id = $2" : null;
    
    // Update status in lists table if list_id is provided
    const updateListsQuery = list_id ? "UPDATE lists SET status = $1 WHERE id = $2" : null;
  
    const queries = [];
  
    if (updateTitleQuery) {
        queries.push(db.query(updateTitleQuery, [status, title_id]));
    }
  
    if (updateListsQuery) {
        queries.push(db.query(updateListsQuery, [status, list_id]));
    }
  
    Promise.all(queries)
      .then(() => {
        res.status(200).json({ success: true, message: "Status updated successfully" });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating status" });
      });
});






//update-to-do
app.post('/update-todo', (req, res) => {
    const { title_id, list } = req.body;
  
    // Update the date_modified of the title with the current timestamp
    const updateTitleQuery = "UPDATE titles SET date_modified = CURRENT_TIMESTAMP WHERE id = $1";
    
    db.query(updateTitleQuery, [title_id])
      .then(() => {
        // Update or insert lists
        const updateListQueries = list.map((task, index) => {
          const updateListQuery = `
            UPDATE lists 
            SET list_desc = $1, status = $2 
            WHERE title_id = $3 AND id = $4
          `;
          
          return db.query(updateListQuery, [task, true, title_id, index + 1]);
        });

        return Promise.all(updateListQueries);
      })
      .then(() => {
        res.status(200).json({ success: true, message: "To-Do List updated successfully" });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating To-Do List" });
      });
});
