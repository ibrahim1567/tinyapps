const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const getUserByEmail = function (email) {
  for (const id in users) {
    const user = users[id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  
  const shortURL = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  console.log(req.body); // Log the POST request body to the console
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let templateVars = { shortURL, longURL: urlDatabase[shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }
  res.render("login");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] 
  console.log(longURL)
  res.redirect(longURL);
});

app.get("/register", function (req, res) {
  //("REGISTER PAGE TEST");
  const templatevars = {username:null}
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }

  res.render("registration", templatevars) ;
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id") , (req, res) => {
  res.redirect("/urls")
}

app.post("/urls/:id" , (req, res) => {
  res.redirect("/urls");
});

app.post("/login" , (req, res) => {
  res.cookie("username", req.body.username)
res.redirect('/urls')
});

app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/login')
})

app.post("/register", function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || (email === "" && !password) || password === "") {
    res.status(400).send("email and password can't be blank");
    return;
  } else {
    const user = getUserByEmail(email);

    let match = false;
    for (let i in users) {
      if (users[i].email === email && users[i].password === password) {
        match = true;
      }
    }
    if (match) {
      res.status(400).send("email already exist");
      return;
    }
    let id = generateRandomString();
    console.log($,{email}, $,{password});
    console.log(match);
    users[id] = {
      id: id,
      email: email,
      password: password,
    };

    res.cookie("user_id", id);
    res.redirect("/urls");
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});