const firebaseConfig = {
    apiKey: "AIzaSyCmKb5TcZ1TLrH3NbC3ADHHgQG6u9TXwVc",
    authDomain: "practice-4cdb5.firebaseapp.com",
    projectId: "practice-4cdb5",
    storageBucket: "practice-4cdb5.appspot.com",
    messagingSenderId: "566308702301",
    appId: "1:566308702301:web:f8ed2b146cc7e5faffe5b4",
    measurementId: "G-W7ERKEX4FB"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

let username = "";

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        username = user.email.slice(0, -10); // Store the username
        // document.getElementById("headerName").innerText = username;
    } else {
        document.querySelector(".log").innerText = "Login"
        document.querySelector(".log").addEventListener('click', () => {
            window.location.href = "./login.html"
        })
    }
});

function renderPostsUser() {
    let container = document.querySelector(".resultDash");
    container.innerHTML = "";
    db.collection("posts")
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                container.innerHTML = "<h1 class='font'>No Posts Found</h1>";
            } else {
                querySnapshot.forEach(function(doc) {
                    var data = doc.data();

                    var timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
                    let post = document.createElement("div");
                    post.className += " column renderPost";

                    let row = document.createElement("div");
                    row.className += " row";
                    post.appendChild(row);

                    let image = document.createElement("img");
                    image.className += "userImg"
                    image.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

                    let postEmail = data.user

                    db.collection("users").get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                let data = doc.data()
                                if (data.email === postEmail) {
                                    // console.log("match")
                                    image.src = data.photo
                                }
                            });
                        })
                        .catch((error) => {
                            console.error("Error querying Firestore:", error);
                        });

                    row.appendChild(image);

                    let div = document.createElement("div")
                    div.className += " col"
                    div.style.marginLeft = "1em"
                    row.appendChild(div);

                    let title = document.createElement("p");
                    title.className += " title";
                    title.style.fontSize = "1.5em";
                    title.style.fontWeight = "bold";
                    title.innerText = data.title; // Render the title
                    div.appendChild(title);

                    let text = document.createElement("p");
                    text.className += " text";
                    text.style.fontSize = "1em"
                    text.style.fontWeight = "bolder"
                    text.innerText = data.post;
                    post.appendChild(text);

                    let tim = document.createElement("div")
                    tim.className += " row gap"
                    tim.style.rowGap = "0em"
                    div.appendChild(tim)

                    // console.log(postEmail)

                    let name = document.createElement("p");
                    name.className += " userMail";

                    {
                        db.collection("users")
                            .get()
                            .then((querySnapshot) => {
                                {
                                    querySnapshot.forEach(function(doc) {
                                        var data = doc.data();

                                        if (data.email === postEmail) {
                                            // console.log("founded")
                                            name.innerText = `${data.firstName}  ${data.lastName} |`;
                                            document.getElementById("headerName").innerText = `${data.firstName}  ${data.lastName}`;
                                            // document.getElementById("name").innerText = `${data.firstName}  ${data.lastName}`;
                                        } else {
                                            // console.log("not found")
                                        }

                                    })
                                }
                            })
                            .catch((error) => {
                                console.error("Error getting posts: ", error);
                            });
                    }

                    tim.appendChild(name);

                    let time = document.createElement("p");
                    time.className += " postTime";
                    time.innerText = `| ${moment(timestamp).format("ll")}`;
                    tim.appendChild(time);

                    let cont = document.createElement("a");
                    cont.className += " anchor";
                    cont.style.color = "#0079ff";
                    cont.innerText = "see all from this user";
                    cont.href = './user.html'
                    cont.name = `${postEmail}`
                        // console.log(cont.name)
                    cont.style.gap = "1em"
                    cont.style.padding = "1em"
                    cont.addEventListener("click", (event) => {
                        let mail = event.target.name;
                        // console.log(mail)
                        localStorage.setItem("userMail", mail)
                    })

                    post.appendChild(cont);

                    container.appendChild(post);

                });
            }
        })
        .catch((error) => {
            console.error("Error getting posts: ", error);
        });
}


function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // console.log("Sign out successful");
            window.location.href = "./all.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    renderPostsUser();
});

let day = document.querySelector("#good")

function getGreeting() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting;

    if (currentHour < 12) {
        greeting = 'Good morning';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    return greeting;
}

const greeting = getGreeting();
day.innerText = greeting + " !"