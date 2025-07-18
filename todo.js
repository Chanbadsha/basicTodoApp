const http = require("http");
const path = require("path");
const fs = require("fs");
const { URL } = require("url");

// Database file address
const filePath = path.join(__dirname, "./todos.json");

// Create Server
const todoServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathName = url.pathname;

  // Get All Todo
  if (pathName === "/todos" && req.method === "GET") {
    const todos = fs.readFileSync(filePath, { encoding: "utf-8" });
    console.log(pathName);
    res.end(todos);
  }
  // Get Single Todo
  else if (pathName === "/todo" && req.method === "GET") {
    const id = url.searchParams.get("id");

    const todos = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
    const todo = todos.find((todo) => todo.id === Number(id));
    res.end(JSON.stringify(todo, null, 2));
  }
  //  Create Todo
  else if (pathName === "/createTodo" && req.method === "POST") {
    let todo = "";

    req.on("data", (chunk) => {
      todo += chunk;
    });

    req.on("end", () => {

      try {
        let isDataExist = fs.readFileSync(filePath, "utf-8");
        let todos = isDataExist.trim() === "" ? [] : JSON.parse(isDataExist);
        if (!Array.isArray(todos)) {
              todos = [todos];
        }
        console.log(todos)
        const { name, email, age, isActive } = JSON.parse(todo);
        const id = todos.length > 0 ? todos[todos.length - 1].id : 0;
        const newId = id + 1;

        const newTodo = { id: newId, name, email, age, isActive };
        todos.push(newTodo);

        const updateTodo = JSON.stringify(todos, null, 2);
        console.log(updateTodo)
        fs.writeFileSync(filePath, updateTodo, { encoding: "utf-8" });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "New Todo Created", todo: newTodo }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        console.log(err)
        res.end(JSON.stringify({ error: "Failed to create new todo"}));
      }
    });
  } else {
    res.end("No route found");
  }
});

todoServer.listen(5000, () => {
  console.log("✅ Todo Server is running on port 5000");
});
