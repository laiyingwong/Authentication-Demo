# Authentication-Demo

This project implements basic authentication features: a user can sign up for an account with a username and password, and gain access to an authenticated page when logged in.

## 🎉 Demo 

![app demo](Assets/authDemo.gif)


## ✨ What I Have Learned

The passwords are never stored directly in the database as text, instead we run the password through a **hashing function** first and then store the result in the database. Hushing functions are functions that map input data of some arbitrary size to fixed-size output values, and they are one-way functions that are infeasible to invert. **BCRYPT** is one of few commonly used password hashing functions (which is used in this project).

In the real-world application, **salting** is an extra step that we take when we’re hashing a password to make it harder to reverse. It refers to the practice of adding random information to a password at the beginning or at the end before we hash it. It will radically change the output to ensure unique hashes and mitigate common attacks.

## 💻 Setup

1️⃣ Run the command below to install packages used in the project:
```sh

$ npm install

```
2️⃣ Install nodemon globally so that it'll restart the application when changes are made to the project:
```sh

$ npm install -g nodemon

```


3️⃣ Run `nodemon index` in the terminal to start the server, and connect to `http//localhost:3000/register` in the web browser.

## 👏 Credits

This project is based on the authentication tutorial of <a href="https://www.udemy.com/course/the-web-developer-bootcamp/">The Web Developer Bootcamp</a> by Colt Steele.
