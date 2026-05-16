const app = require("./app");

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
