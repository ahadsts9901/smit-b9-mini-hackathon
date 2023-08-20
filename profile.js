let username = "";

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
var auth = firebase.auth();
var db = firebase.firestore();

document.addEventListener("DOMContentLoaded", function() {
    const resetButton = document.getElementById("rbtn");

    resetButton.addEventListener("click", async() => {
        const oldPassword = document.getElementById("oldPass").value;
        const newPassword = document.getElementById("newPass").value;
        const confirmPassword = document.getElementById("repPass").value;
        const user = auth.currentUser;

        if (user) {
            if (newPassword === confirmPassword) {
                const credentials = firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    oldPassword
                );

                try {
                    await user.reauthenticateWithCredential(credentials);
                    await user.updatePassword(newPassword);
                    swal.fire("Success", "Password updated successfully.", "success");
                    clearPasswordFields();
                } catch (error) {
                    swal.fire("Error", "Incorrect Password.", "error");
                    console.error("Error updating password:", error);
                }
            } else {
                swal.fire("Error", "Passwords do not match.", "error");
            }
        }
    });
});

function clearPasswordFields() {
    document.getElementById("oldPass").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("repPass").value = "";
}

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

                            if (data.email === username) {
                                console.log("founded")
                                document.getElementById("headerName").innerText = data.firstName + data.lastName;
                                document.getElementById("name").innerText = `${data.firstName}  ${data.lastName}`;
                            }

                        })
                    }
                })
                .catch((error) => {
                    console.error("Error getting posts: ", error);
                });
        }

    } else {
        window.location.href = "./login.html";
        document.getElementById("headerName").innerText = "null";
    }
});

function logOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            // console.log("Sign out successful");
            // Redirect to the sign-in page or any other desired destination
            window.location.href = "./login.html";
        })
        .catch((error) => {
            console.log("Sign out error:", error);
        });
}