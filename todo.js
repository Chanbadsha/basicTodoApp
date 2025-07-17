const http = require("http");
const path = require("path");
const fs = require("fs");
const { URL } = require("url");

// Create path file

const pathFile = path.join(__dirname, "./todos.json");

// Create Todo App Server
const todoServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathName = url.pathname;
  // console.log(pathName)

  // Get all ToDos
  if (pathName === "/allTodos" && req.method === "GET") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    const data = fs.readFileSync(pathFile, { encoding: "utf-8" });
    res.end(data);
  }
  //   Create Todo
  else if (pathName === "/createTodo" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
      // console.log(data)
    });

    req.on("end", () => {
      if (!data) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Please provide data" }));
      }

      const { id, name, email, age, isActive } = JSON.parse(data);
      const createdAt = new Date().toLocaleString();
      const newToDo = { id, name, email, age, isActive, createdAt };

      // get data from db
      const DbData = JSON.parse(
        fs.readFileSync(pathFile, { encoding: "utf-8" })
      );
      DbData.push(newToDo);
      //   console.log(DbData)
      const newData = JSON.stringify(DbData, null, 2);

      fs.writeFileSync(pathFile, newData, { encoding: "utf-8" });
      res.end(newData);
    });
  }

  //   Get Single Todo
  else if (pathName === "/todo" && req.method === "GET") {
    const id = url.searchParams.get("id");
    const data = fs.readFileSync(pathFile, { encoding: "utf-8" });

    const parseData = JSON.parse(data);
    const todos = parseData.find((todo) => todo.id === Number(id));

    res.end(JSON.stringify(todos));
  }
  // Update Todo
 else {
    res.end("No Route Found");
  }
});

// Listen ToDo Server BD
todoServer.listen(5000, () => {
  console.log(" ✅ Todo Server is running on port 5000");
});
