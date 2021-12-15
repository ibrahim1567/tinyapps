const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

app.use(cookieParser())
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
const getUserByEmail = (email) => {
  for (const id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
return undefined;
};

const getEmailByUserID = (userID) => {
  if (users[userID]){
    return users[userID].email
  }
  return undefined
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.redirect("urls");
  // res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls/new", (req, res) => {
  const userID = req.cookies.user_id
  const templateVars = { urls: urlDatabase, username: getEmailByUserID(userID) };
  res.render("urls_new", templateVars);
});


app.get("/urls", (req, res) => {
 const userID = req.cookies.user_id
 console.log(userID);
 console.log(getEmailByUserID(userID));
  const templateVars = { urls: urlDatabase, username: getEmailByUserID(userID) };
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
  const userID = req.cookies.user_id
  const templateVars = {username: getEmailByUserID(userID) };
  res.render("login",templateVars);
});

app.post("/login", (req, res) => {
  const user = getUserByEmail(req.body.email)
  res.cookie('user_id', user.id); 
  res.redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/login')
})
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL] 
  console.log(longURL)
  res.redirect(longURL);
});

app.get("/register", function (req, res) {
  //("REGISTER PAGE TEST");
  // const templatevars = {username:null}
  if (req.cookies["username"]) {
    return res.redirect("/urls");
  }
  
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

  const templatevars = {username: users[req.cookies.username] }
  res.render("registration", templatevars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    username: req.cookies.username
  };
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});