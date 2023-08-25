const firebaseConfig = {
    apiKey: "AIzaSyCmKb5TcZ1TLrH3NbC3ADHHgQG6u9TXwVc",
    authDomain: "practice-4cdb5.firebaseapp.com",
    projectId: "practice-4cdb5",
    storageBucket: "practice-4cdb5.appspot.com",
    messagingSenderId: "566308702301",
    appId: "1:566308702301:web:f8ed2b146cc7e5faffe5b4",
    measurementId: "G-W7ERKEX4FB",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let username = "";

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        username = user.email;

        {
            db.collection("users")
                .get()
                .then((querySnapshot) => {
                    {
                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();

                            if (data.email === localStorage.getItem("userMail")) {
                                // console.log("founded");

                                document.getElementById("mail").innerText = data.email
                                document.getElementById("mail").href = data.email
                                localStorage.getItem("userMail");
                                document.getElementById("pname").innerText = `${data.firstName}  ${data.lastName}`
                                document.getElementById("User").innerText = data.firstName
                                    // console.log(data.photo)
                                document.querySelector(".myImg").src = data.photo
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error getting posts: ", error);
                });
        }
    } else {
        document.querySelector(".log").innerText = "Login"
        document.querySelector(".log").addEventListener('click', () => {
            window.location.href = "./login.html"
        })
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // console.log(localStorage.getItem("userMail"))
    } else {
        document.querySelector(".log").innerText = "Login"
        document.querySelector(".log").addEventListener('click', () => {
            window.location.href = "./login.html"
        })
    }
});

function renderUserPosts(userEmail) {
    let container = document.querySelector(".user-posts-container");
    container.innerHTML = "";
    db.collection("posts")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                container.innerHTML = "<h1 class='font'>No Posts Found</h1>";
                // console.log("me")
            } else {
                querySnapshot.forEach(function(doc) {
                    var data = doc.data();

                    var timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
                    let post = document.createElement("div");
                    post.className += " column renderPost full";

                    let row = document.createElement("div");
                    row.className += " row";
                    post.appendChild(row);

                    let image = document.createElement("img");
                    image.className += "userImg";
                    image.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

                    let postEmail = data.user

                    db.collection("users").get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                let data = doc.data()
                                if (data.email === postEmail) {
                                    // console.log("match")
                                    image.src = data.photo
                                        // document.querySelector(".myImg").src = data.photo
                                }
                            });
                        })
                        .catch((error) => {
                            console.error("Error querying Firestore:", error);
                        });

                    row.appendChild(image);

                    let div = document.createElement("div");
                    div.className += " col";
                    div.style.marginLeft = "1em";
                    row.appendChild(div);

                    let title = document.createElement("p");
                    title.className += " title";
                    title.style.fontSize = "1.5em";
                    title.style.fontWeight = "bold";
                    title.innerText = data.title; // Render the title
                    div.appendChild(title);

                    let text = document.createElement("p");
                    text.className += " text";
                    text.style.fontSize = "1em";
                    text.style.fontWeight = "bolder";
                    text.innerText = data.post;
                    post.appendChild(text);

                    let tim = document.createElement("div");
                    tim.className += " row gap";
                    div.appendChild(tim);

                    let name = document.createElement("p");

                    {
                        db.collection("users")
                            .get()
                            .then((querySnapshot) => {
                                {
                                    querySnapshot.forEach(function(doc) {
                                        var data = doc.data();

                                        if (data.email === localStorage.getItem("userMail")) {

                                            name.innerText = `${data.firstName} ${data.lastName}`;
                                            document.querySelector(".myImg").src = data.photo

                                        }
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error("Error getting posts: ", error);
                            });
                    }

                    tim.appendChild(name);

                    let time = document.createElement("p");
                    time.className += " postTime";
                    time.innerText = ` ${moment(timestamp).format("ll")}`;
                    tim.appendChild(time);

                    // console.log(data.user == localStorage.getItem('userMail'))

                    if (data.user == localStorage.getItem("userMail")) {
                        // console.log("Matched user:", data.user);
                        // console.log(post)
                        container.appendChild(post);
                    } else {
                        // console.log("Not matched user:", data.user);
                    }
                });
            }
        })
        .catch((error) => {
            console.error("Error getting user's posts:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    renderUserPosts();
});

function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // console.log("Sign out successful");
            // Redirect to the sign-in page or any other desired destination
            window.location.href = "./all.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });
}