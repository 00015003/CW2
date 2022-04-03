const express = require("express");
const app = express();

const fs = require("fs");

const PORT = 3000;

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/workers", (req, res) => {
  fs.readFile("./data/db.json", (err, data) => {
    if (err) throw err;

    const users = JSON.parse(data);
    res.render("workers", { users: users });
  });
});

app.get('/add', (req, res) => {
  res.render('change')
})

app.post('/add', (req, res) => {

  const formCreate = req.body;

  if (formCreate.name.trim() == "" || formCreate.email.trim() == "" || formCreate.age.trim() == null) {
    fs.readFile("./data/db.json", (err, data) => {
      if (err) throw(err);
      const dbData = JSON.parse(data);

      res.render("change", { error: true, dbData: dbData });
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

        res.render("change");
        });
        res.redirect('/workers');
      });
    });
  }
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/db.json", (err, data) => {
    if (err) throw err;

    const users = JSON.parse(data);
    const filterUser = users.filter((user) => user.id != id);

    fs.writeFile("./data/db.json", JSON.stringify(filterUser), (err) => {
      if (err) throw err;
      res.render('main', { users: filterUser, deleted: true });
    });
    res.redirect('/');
  });
});

app.get('/:id/update', (req, res) => {
  fs.readFile("./data/db.json", (err, data) => {
    if(err) throw error

    const users = JSON.parse(data)
    const user = users.filter(user => user.id == req.params.id)[0]
    res.render('change', {user: user})
    console.log(user)
  })
})

app.post("/:id/update", (req, res) => {
    const id = req.params.id;
  
    fs.readFile("./data/db.json", (err, data) => {
      if (err) throw err;

      const users = JSON.parse(data);
      const updated = users.filter(user => user.id != id) || []

      let user = users.filter(user => user.id == id)[0]

      user = {
        id: id,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender
      };

      updated.push(user);
      fs.writeFile("./data/db.json", JSON.stringify(updated), (err) => {
        if (err) throw err;

        fs.readFile("./data/db.json", (err, data) => {
         if (err) throw err;

        res.render("main");
        });
        res.redirect('/');
      });
    });
  });

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`This app is running on port ${PORT}`);
});

function id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

