const user = firebase.auth().currentUser;

$('#userIdName').text(user.displayName + "님 안녕하세요");