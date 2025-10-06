import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function createAxios(auth, baseURL) {
    const headers = {};

    function getAuthHeader() {
        return getCookie("token");
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function readCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    let outletId = getCookieForEntity("outletId", "posOutletId");
    if (window.localStorage.getItem("outletId")) {
        let outletIdLocal = window.localStorage.getItem("outletId");
        setCookieForEntity("outletId", "posOutletId", outletIdLocal, 60)
        outletId = outletIdLocal
        window.localStorage.removeItem("outletId")
    }

    //headers["X-Client"] = isPowerRanger ? "user" : "consumer";
    headers["X-TrackingId"] = uuidv4();
    headers["HeaderRoute"] = "v2";
    //headers["DeviceId"] = window.localStorage.getItem("deviceId") ? (window.localStorage.getItem("deviceId") + "_uuid") : deviceId;
    var url = new URL(window.location.href);

    // ====== temp ========
    // headers["x-envoy-upstream-rq-timeout-ms"] = 40000;
    if (auth) {
        let token = getAuthHeader()
        if (window.localStorage.getItem("token")) {
            let tokenLocal = window.localStorage.getItem("token");
            setCookieForEntity("token", "token", tokenLocal, 60)
            token = tokenLocal
            window.localStorage.removeItem("token")
        }
        if (getCookieForEntity("token", "token")) {
            token = getCookieForEntity("token", "token")
        }
        headers["Authorization"] = token;
    }

    const instance = axios.create({
        baseURL,
        // withCredentials: true,
        headers,
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Exclude s3 urls with 403 code
            const isS3Url =
                error.config &&
                /(s3-|s3\.)?(.*)\.amazonaws\.com/.test(error.config.url);
            if (!isS3Url && [401, 403, 410].includes(error.response.status)) {

                let token = getCookieForEntity("token", "posToken")
                let outletId = getCookieForEntity("outletId", "posOutletId")
                let currentPos = window.location.href
                console.log("err: Session Expired " + " ,url: " + error.config.url + ",errorCode:" + error.response.status + ",curentURL:" + currentPos + ", outletId: " + outletId + ", token: " + token + " errorLog:  " + JSON.stringify(error));
                console.error("Session Expired: Please login again.");


                setTimeout(function () {
                    alert('Session Expired! Please login again');
                    deleteCookieForEntity("token", "posToken")
                    deleteCookieForEntity("outletId", "posOutletId")
                    deleteCookieForEntity("", "clientType")
                    deleteCookieForEntity("", "clientData")
                    window.location.href = "/?signIn=true";
                }, 1000);

            }
            // if (error.response.status === 417) {
            //   instance.request(error.config);
            // }
            return Promise.reject(error);
        }
    );
    return instance;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=None; Partitioned; Secure";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Partitioned; Secure';
}

export function getCookieForEntity(docCookieName, iframeCookieName) {

    if (docCookieName) {
        return getCookie(docCookieName)
    } else if (iframeCookieName) {
        return getCookie(iframeCookieName)
    }
    return ""
}

export function setCookieForEntity(docCookieName, iframeCookieName, value, days) {
    if (docCookieName) {
        return setCookie(docCookieName, value, days)
    } else if (iframeCookieName) {
        return setCookie(iframeCookieName, value, days)
    }
}

export function deleteCookieForEntity(docCookieName, iframeCookieName) {
    if (docCookieName) {
        return eraseCookie(docCookieName)
    } else if (iframeCookieName) {
        return eraseCookie(iframeCookieName)
    }
}

export function getAxios(
    auth = false,
    baseUrl = "",
) {
    return createAxios(auth, baseUrl);
}

export default getAxios;