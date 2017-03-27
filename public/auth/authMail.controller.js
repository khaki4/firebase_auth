const emailAuth = new EmailAuth();

const changeUserState = () => {
    firebase.auth().onAuthStateChanged((user) => {
        const $authState = $("#AUTH_STATE");
        try {
            if (user.emailVerifid) {
                $authState.text(user.displayName + "님 로그인 하셨습니다.");
                $("#BTN_LOGOUT").show();
                $("#USER_NAME").text(user.displayName);
                $("#USER_MAIL").text(user.email);
                $("#USER_UID").text(user.uid);
                $("#USER_PHOTO").attr('src', user.photoURL);
                $("#USER_INFO").show();
            } else {
                $authState.text("(인증되지 않음)");
                $("#BTN_LOGOUT").hide();
                $("#USER_INFO").hide();
            }
        } catch (e) {
            console.warn(e.message);
        }
    });
};

$("#BTN_LOGOUT").click(() => {
    emailAuth.firebaseLogout();
});

$("#BTN_SIGNIN").click(() => {
    const signupMail = $('#SIGNIN_MAIL').val();
    const signupPassword = $('#SIGNIN_PASSWORD').val();
    const initFormValue = () => {
        $('#SIGNIN_MAIL').val("");
        $('#SIGNIN_PASSWORD').val("");
    };

    emailAuth.firebaseSignIn(signupMail, signupPassword, initFormValue);
});

$("#registerUserAndWaitEmailVerification").on('click', () => {
    let signupMail = $('#INPUT_MAIL').val();
    let signupPassword = $('#INPUT_PASSWORD').val();
    let signupName = $('#INPUT_NAME').val();

    const initFormValue = () => {
        $('#INPUT_MAIL').val("");
        $('#INPUT_PASSWORD').val("");
        $('#INPUT_NAME').val("");
    };

    emailAuth.createUserWithEmailAndPassword(signupMail, signupPassword, signupName)
        .then(initFormValue);
});

$('#sendMailToResetPassword').on('click', () => {
    emailAuth.sendMailToResetPassword();
});

const onInit = () => {
    changeUserState();
};

onInit();