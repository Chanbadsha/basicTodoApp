const http = require("http");
const path = require("path");
const fs = require("fs");

// Create path file

const pathFile = path.join(__dirname, "./todos.json");

// Create Todo App Server
const todoServer = http.createServer((req, res) => {
  // console.log(req.url)
  // Get all ToDos
  if (req.url === "/allTodos" && req.method === "GET") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    const data = fs.readFileSync(pathFile, { encoding: "utf-8" });
    res.end(data);
  }
  //   Create Todo
  else if (req.url === "/createTodo" && req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
      // console.log(data)
    });

    req.on("end", () => {
      const {id, name, email, age, isActive } = JSON.parse(data);
const createdAt = new Date().toLocaleString()
      const newToDo = {id, name, email, age, isActive,createdAt };

      // get data from db
      const DbData = JSON.parse(
        fs.readFileSync(pathFile, { encoding: "utf-8" })
      );
      DbData.push(newToDo);
    //   console.log(DbData)
      const newData = JSON.stringify(DbData,null,2)

      fs.writeFileSync(pathFile,newData,{encoding:'utf-8'})
         res.end(newData);
    });

 
  } else {
    res.end("Welcome to ToDo Server BD");
  }
});

// Listen ToDo Server BD
todoServer.listen(5000, () => {
  console.log(" ✅ Todo Server is running on port 5000");
});
