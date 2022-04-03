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

    const workers = JSON.parse(data);
    res.render("workers", { workers: workers });
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

      const workers = JSON.parse(data);

      const worker = {
        id: id(),
        name: formCreate.name,
        email: formCreate.email,
        age: formCreate.age,
        gender: formCreate.gender
      };

      workers.push(worker);
      console.log(worker)
      fs.writeFile("./data/db.json", JSON.stringify(workers), (err) => {
        if (err) throw err;

        fs.readFile("./data/db.json", (err, data) => {
         if (err) throw err;

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

    const workers = JSON.parse(data);
    const filterworker = workers.filter((worker) => worker.id != id);

    fs.writeFile("./data/db.json", JSON.stringify(filterworker), (err) => {
      if (err) throw err;
      res.render('workers', { workers: filterworker, deleted: true });
    });
    res.redirect('/workers');
  });
});

app.get('/:id/update', (req, res) => {
  fs.readFile("./data/db.json", (err, data) => {
    if(err) throw error

    const workers = JSON.parse(data)
    const worker = workers.filter(worker => worker.id == req.params.id)[0]
    res.render('change', {worker: worker})
  })
})

app.post("/:id/update", (req, res) => {
    const id = req.params.id;
  
    fs.readFile("./data/db.json", (err, data) => {
      if (err) throw err;

      const workers = JSON.parse(data);
      const updated = workers.filter(worker => worker.id != id) || []

      let worker = workers.filter(worker => worker.id == id)[0]

      worker = {
        id: id,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender
      };

      updated.push(worker);
      fs.writeFile("./data/db.json", JSON.stringify(updated), (err) => {
        if (err) throw err;

        fs.readFile("./data/db.json", (err, data) => {
         if (err) throw err;

        res.render("workers");
        });
        res.redirect('/workers');
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

