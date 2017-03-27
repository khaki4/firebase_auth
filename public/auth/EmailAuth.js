class EmailAuth {
    constructor() {
    }

    createUserWithEmailAndPassword(signupMail, signupPassword, signupName) {
        const sentVerificationMailToUser = (user) => {
            try {
                if (!user) {
                    return;
                }

                user.sendEmailVerification().then(function () {
                    console.log('email has send');
                    // Email sent.
                }, function (error) {
                    // An error happened.
                    console.log(error.message);
                });
            } catch (e) {
                console.warn('sentVerificationMailToUser', e.message);
            }
        };
        const update = (user) => {
            const success = () => {
                console.log('verification mail send to', user.email);
            };
            const fail = error => alert(error.message);

            user.updateProfile({
                "displayName": signupName,
                "PhotoURL": "/images/profile.png"
            })
                .then(success, fail)
                .catch(fail);
        };
        return new Promise(function (resolve, reject) {
            const successCreateEmail = (user) => {
                update(user);
                return user;
            };
            const failCreateEmail = (error) => {
                alert('registerUserAndWaitEmailVerification: createUserWithEmailAndPassword failed ! ' + error.message + ' (' + error.code + ')');
            };

            firebase.auth().createUserWithEmailAndPassword(signupMail, signupPassword)
                .then(successCreateEmail, failCreateEmail)
                .then(sentVerificationMailToUser);
        });
    }

    deleteUser(user) {
        const successDelete = () => {
            console.log(`success! deleteUser ${user.name}`);
        };
        const failDelete = error => console.warn(error.message);
        user.delete()
            .then(successDelete, failDelete);
    }

    firebaseSignIn(signinMail, signinPassword, initFormValue) {
        let user = firebase.auth().currentUser;
        const goSignedUserPage = () => {
            window.location.href = '/users/userPage.html';
        };
        const success = (user) => {
            const reloadSuccess = () => {
                if (user.emailVerified) {
                    console.info('mail is verified!!');
                    goSignedUserPage();
                } else {
                    const errMSG = `user emailVerified ${user.emailVerified}`;
                    console.log(errMSG);
                    alert('Fail to verify email');
                }
            };

            const reloadFail = (error) => alert(error.message);
            user.reload()
                .then(reloadSuccess, reloadFail);
        };
        const fail = error => alert(error.message);

        firebase.auth().signInWithEmailAndPassword(signinMail, signinPassword)
            .then(success, fail)
            .then(initFormValue)
            .catch(fail);
    }

    firebaseLogout() {
        const success = () => alert("인증이 해제되었습니다.");
        const reload = () => window.location.reload();
        const fail = error => alert(error.message);

        firebase.auth().signOut()
            .then(success, fail)
            .then(reload)
            .catch(fail);
    }

    sendMailToResetPassword() {
        try {
            const user = firebase.auth().currentUser;
            const emailAddress = user.email;

            const success = () => {
                console.log('send mail to reset password');
            };
            const fail = error => alert(error.message);

            auth.sendPasswordResetEmail(emailAddress)
                .then(success, fail);
        } catch (e) {
            console.warn(e.message);
        }
    }
}