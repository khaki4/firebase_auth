/// <reference path="../node_modules/@types/firebase/index.d.ts" />

const deleteUser = (user) => {
    const successDelete = () => {
        console.log(`success! deleteUser ${user.name}`);
    };
    const failDelete = error => console.warn(error.message);
    user.delete()
        .then(successDelete, failDelete);
};

const handleResetPassword = (auth, actionCode) => {
    var accountEmail;
    // Verify the password reset code is valid.
    auth.verifyPasswordResetCode(actionCode)
        .then((email) => {
            const accountEmail = email;

            // TODO: Show the reset screen with the user's email and ask the user for
            // the new password.

            // Save the new password.
            auth.confirmPasswordReset(actionCode, 11111)
                .then(function (resp) {
                    // Password reset has been confirmed and new password updated.

                    // TODO: Display a link back to the app, or sign-in the user directly
                    // if the page belongs to the same domain as the app:
                    // auth.signInWithEmailAndPassword(accountEmail, newPassword);
                }).catch(function (error) {
                    // Error occurred during confirmation. The code might have expired or the
                    // password is too weak.
                    alert(error.message);
                });
        }).catch(function (error) {
            // Invalid or expired action code. Ask user to try to reset the password
            // again.
            alert(error.message);
        });
};

function handleRecoverEmail(auth, actionCode) {
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function (info) {
        // Get the restored email address.
        restoredEmail = info['data']['email'];

        // Revert to the old email.
        return auth.applyActionCode(actionCode);
    }).then(function () {
        // Account email reverted to restoredEmail

        // TODO: Display a confirmation message to the user.

        // You might also want to give the user the option to reset their password
        // in case the account was compromised:
        auth.sendPasswordResetEmail(restoredEmail).then(function () {
            // Password reset confirmation sent. Ask user to check their email.
        }).catch(function (error) {
            // Error encountered while sending password reset code.
        });
    }).catch(function (error) {
        // Invalid code.
    });
}

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
//$('#BTN_SIGNUP').on('click', () => handleResetPassword());
$('#creatAccountWithVerifyEmail').on('click', () => {
    const user = firebase.auth().currentUser;
    sentVerificationMailToUser(user);
});


$('#sendMailToResetPassword').on('click', () => {
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
});

$('#registerUserAndWaitEmailVerification').on('click', () => {
    let signupMail = $('#INPUT_MAIL').val();
    let signupPassword = $('#INPUT_PASSWORD').val();
    let signupName = $('#INPUT_NAME').val();

    const initFormValue = () => {
        $('#INPUT_MAIL').val("");
        $('#INPUT_PASSWORD').val("");
        $('#INPUT_NAME').val("");
    };
    const update = (user) => {
        const success = () => {
            console.log('verification mail send to', user.email);
            location.reload();
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
        let interval = null;
        const successCreateEmail = (user) => {
            update(user);
            return user;
        };
        const failCreateEmail = (error) => {
            alert('registerUserAndWaitEmailVerification: createUserWithEmailAndPassword failed ! ' + error.message + ' (' + error.code + ')');
        }

        firebase.auth().createUserWithEmailAndPassword(signupMail, signupPassword)
            .then(successCreateEmail, failCreateEmail)
            .then(sentVerificationMailToUser)
            .then(initFormValue);
    });
});