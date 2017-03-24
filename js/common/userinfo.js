/**
 * Created by gaopeng on 17/2/8.
 */

var sessionId = localStorage.getItem("sessionId");
if(!sessionId) {
    window.location = "login.html";
}

window.onload = function () {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    document.getElementById("username").innerText = userInfo.username;
};

function logout() {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userInfo");
    window.location = "login.html";
}

