const express = require("express");
const app = express();

const fs = require("fs");

const PORT = 3000;

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  fs.readFile("./data/db.json", (err, data) => {
    if (err) throw err;

    const users = JSON.parse(data);
    res.render("main", { users: users });
  });
});

app.get('/add', (req, res) => {
  res.render('change')
})

app.post("/add", (req, res) => {

  const formCreate = req.body;

  if (formCreate.name.trim() == "" || formCreate.email.trim() == "" || formCreate.age.trim() == null) {
    fs.readFile("./data/db.json", (err, data) => {
      if (err) alert(err);
      const dbData = JSON.parse(data);

      res.render("main", { error: true, dbData: dbData });
    });
  } else {
    fs.readFile("./data/db.json", (err, data) => {
      if (err) throw err;

      const users = JSON.parse(data);

      const user = {
        id: id(),
        name: formCreate.name,
        email: formCreate.email,
        age: formCreate.age,
        gender: formCreate.gender
      };

      users.push(user);
      console.log(user)
      fs.writeFile("./data/db.json", JSON.stringify(users), (err) => {
        if (err) throw err;

        fs.readFile("./data/db.json", (err, data) => {
         if (err) throw err;
         const users = JSON.parse(data);

        res.render("main", { success: true, users: users });
        });
      });
    });
  }
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/db.json", (err, data) => {
    if (err) throw err;

    const todos = JSON.parse(data);
    const filterTodos = todos.filter((todo) => todo.id != id);

    fs.writeFile("./data/db.json", JSON.stringify(filterTodos), (err) => {
      if (err) throw err;

      res.render("home", { todos: filterTodos, deleted: true });
    });
  });
});

app.get("/:id/update", (req, res) => {
    const id = req.params.id;
  
    fs.readFile("./data/db.json", (err, data) => {
      if (err) throw err;
  
        const todos = JSON.parse(data)
        const todo = todos.filter(todo => todo.id == req.params.id)[0]
      
        const todoIdx = todos.indexOf(todo)
        const splicedTodo = todos.splice(todoIdx, 1)[0]
      
        if(todo.done == false) {
            splicedTodo.done = true
        }else {
            splicedTodo.done = false
        }

        todos.push(splicedTodo)
        
        fs.writeFile('./data/db.json', JSON.stringify(todos), (err) => {
            if(err) throw err

            res.render('home', {todos: todos})
            
        })
    
    

      
    });
  });

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`This app is running on port ${PORT}`);
});

function id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

