const changeUserState = () => {
    firebase.auth().onAuthStateChanged((user) => {
        const $authState = $("#AUTH_STATE");
        try {
            if (user.emailVerified) {
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
    const success = () => alert("인증이 해제되었습니다.");
    const reload = () => window.location.reload();
    const fail = error => alert(error.message);

    firebase.auth().signOut()
        .then(success, fail)
        .then(reload)
        .catch(fail);
});

$("#BTN_SIGNUP").on('click', () => {
    const signupMail = $('#INPUT_MAIL').val();
    const signupPassword = $('#INPUT_PASSWORD').val();
    const signupName = $('#INPUT_NAME').val();

    const update = () => {
        const user = firebase.auth().currentUser;

        const success = () => {
            alert("성공적으로 가입되었습니다.");
            // location.reload();
        };
        const fail = error => alert(error.message);

        user.updateProfile({
                "displayName": signupName,
                "PhotoURL": "/images/profile.png"
            })
            .then(success, fail)
            .catch(fail);
    };
    const fail = error => alert(error.message);

    firebase.auth().createUserWithEmailAndPassword(signupMail, signupPassword)
        .then(update)
        .catch(fail);
});

$("#BTN_SIGNIN").on('click', () => {
    let signinMail = $('#SIGNIN_MAIL').val();
    let signinPassword = $('#SIGNIN_PASSWORD').val();
    let user = firebase.auth().currentUser;

    const initFormValue = () => {
        $('#SIGNIN_MAIL').val("");
        $('#SIGNIN_PASSWORD').val("");
    };

    const goSignedUserPage = () => {
        window.location.href = '/users/userPage.html';
    };
    const success = (user) => {
        const reloadSuccess = () => {
            if (user.emailVerified) {
                console.info('mail is verified!!');
                //goSignedUserPage();
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
    const fail = error => {
        alert(error.message);
    }

    firebase.auth().signInWithEmailAndPassword(signinMail, signinPassword)
        .then(success, fail)
        .then(initFormValue)
        .catch(fail);
});

const onInit = () => {
    changeUserState();
};

onInit();