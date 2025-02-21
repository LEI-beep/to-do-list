import express from 'express';
import { db } from './db.js';

const app = express();
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

/* app. get('/get-titles', (req, res) => {
    const query = "SELECT * FROM titles";
    db.query(query)
    .then(titles => {
        res.status(200).json({ tiltes: titles.rows });
    });
});

//get lists
app. get('/get-lists', (req, res) => {
    const query = "SELECT * FROM lists";
    db.query(query)
    .then(lists => {
        res.status(200).json({ lists: lists.rows });
    });
}); */





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

app. post ('/check-user', (req, res) =>{
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username=$1 AND password=$2";

    db.query(query, [username, password])
    .then(result => {
        if(result.rowCount > 0) {
            res.status(200).json({ exist: true });
        }

        else {
            res.status(200).json ({ exist: false });
        }
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

app.get('/delete-to-do', (req, res) => {
    res.send('this is delete-to-do homepage');
});

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});




//insert titles and list
app.post('/add-to-do', (req, res) => {
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
    const { title_id } = req.body;
  
    // First, delete tasks related to the title_id
    const deleteListsQuery = "DELETE FROM lists WHERE title_id = $1";
    
    db.query(deleteListsQuery, [title_id])
      .then(() => {
        // Then, delete the title itself
        const deleteTitleQuery = "DELETE FROM titles WHERE id = $1";
        return db.query(deleteTitleQuery, [title_id]);
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
