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
                    Swal.fire({
                        icon: 'success',
                        title: `Password updated successfully`,
                        showConfirmButton: false,
                        timer: 1500 // Show success message for 1.5 seconds
                    });
                    clearPasswordFields();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: `Incorrect password`,
                        showConfirmButton: false,
                        timer: 1500 // Show success message for 1.5 seconds
                    });
                    console.error("Error updating password:", error);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: `Passwords do not match`,
                    showConfirmButton: false,
                    timer: 1500 // Show success message for 1.5 seconds
                });
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
                                // console.log("founded")
                                document.getElementById("headerName").innerText = `${data.firstName}  ${data.lastName}`;
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
        window.location.href = "./all.html";
    }
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

function editName() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            username = user.email;

            {
                db.collection("users")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(function(doc) {
                            var data = doc.data();

                            if (data.email === username) {
                                // Display SweetAlert input for editing FirstName and LastName
                                Swal.fire({
                                    title: 'Edit Profile',
                                    html: `<input id="swal-input-firstname" class="swal2-input" placeholder="First Name" value="${data.firstName || ''}">
                           <input id="swal-input-lastname" class="swal2-input" placeholder="Last Name" value="${data.lastName || ''}">`,
                                    focusConfirm: false,
                                    showCancelButton: true,
                                    cancelButtonColor: "#0079ff",
                                    confirmButtonColor: "#0079ff",
                                    preConfirm: () => {
                                        const newFirstName = document.getElementById('swal-input-firstname').value;
                                        const newLastName = document.getElementById('swal-input-lastname').value;

                                        // Validate if inputs are not empty
                                        if (!newFirstName.trim() || !newLastName.trim()) {
                                            Swal.showValidationMessage('Please fill in both First Name and Last Name.');
                                        } else {
                                            // Update the values on the front end
                                            data.firstName = newFirstName;
                                            data.lastName = newLastName;
                                        }
                                    }
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        // Update the Firestore document after confirming
                                        db.collection("users").doc(doc.id).update({
                                            firstName: data.firstName,
                                            lastName: data.lastName
                                        }).then(() => {
                                            // console.log("Profile updated successfully!");
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Profile Updated',
                                                showConfirmButton: false,
                                                timer: 1500 // Show success message for 1.5 seconds
                                            });
                                            setTimeout(() => {
                                                window.location.reload()
                                            }, 0)
                                        }).catch((error) => {
                                            console.error("Error updating profile: ", error);
                                            Swal.fire({
                                                icon: 'error',
                                                title: `Can't update`,
                                                showConfirmButton: false,
                                                timer: 1500 // Show success message for 1.5 seconds
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        console.error("Error getting posts: ", error);
                    });


            }

        } else {
            window.location.href = "./all.html";
        }
    });

}

function file(event) {
    // console.log(event.target.files[0])
    let uid = firebase.auth().currentUser.uid
        // console.log(uid)
    let fileref = firebase.storage().ref().child(`/users/${uid}/profile`)
    let uploadTask = fileref.put(event.target.files[0])

    uploadTask.on('state_changed',
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            if (progress == 100) {
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded',
                    showConfirmButton: false,
                    timer: 1000 // Show success message for 1.5 seconds
                });
            }
        },
        (error) => {
            console.log(error)
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // console.log('File available at', downloadURL);

                // Update the photo field in the user's document in Firestore
                db.collection("users").where("email", "==", firebase.auth().currentUser.email)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection("users").doc(doc.id).update({
                                photo: downloadURL
                            }).then(() => {
                                // console.log("Photo URL updated in Firestore.");
                                setTimeout(() => {
                                    window.location.reload()
                                })
                            }).catch((error) => {
                                console.error("Error updating photo URL:", error);
                            });
                        });
                    })
                    .catch((error) => {
                        console.error("Error querying Firestore:", error);
                    });

                firebase.auth().currentUser.updateProfile({
                    photoURL: downloadURL
                })
            });
        }
    );

}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Display the user's profile image if available
        if (user.photoURL) {
            document.querySelector(".mainImg").src = user.photoURL;
            // console.log("image")
        } else {
            // console.log("no")
        }

        // Rest of your code...
    } else {
        window.location.href = "./all.html"
    }
});