import axios from "axios";
import CONFIG from "@/utils/config";

/**
 * customize yourself according to business requirements
 * @param {Object} axios:required parameters
 * axios: { method, url, data, params, response}
 * @link: axios
 */
var instance = axios.create({
    baseURL: CONFIG.baseUrl,
    timeout: 60000,
    withCredentials: true,
    method: "post",
    headers: {
        post: { "Content-Type": "application/json" }
    }
});
export default function http() {
    instance.defaults.headers["token"] = localStorage.getItem("token");
    return axiosRequestMiddle(instance).apply(axios, arguments);
}

/**
 * package api
 */
const instanceMiddle = axios.create({
    withCredentials: true,
    method: "post"
});
export function packageServer() {
    return axiosRequestMiddle(instanceMiddle).apply(axios, arguments);
}

/**
 * @param {Function} fn: axios构造实例
 * @returns {Promise}
 */
const unauthorizedCode = [401, 402, 403];

function axiosRequestMiddle(fn) {
    return function(options) {
        return fn({
                method: "post",
                ...options
            })
            .then(mess => {
                const { errorCode } = mess.data;
                if (unauthorizedCode.indexOf(errorCode) >= 0) {
                    return (window.location.href = "/");
                }
                return mess.data;
            })
            .catch(error => {
                return { flag: false, errorCode: 504 };
            });
    };
}

/**
 * 处理ie下get请求缓存问题
 * @param {Object} options={url, method}
 * @return {String} url
 */
function detailIEGETRequestCache(options) {
    const { method, url } = Object.assign({ method: "post" }, options);
    // 如果ie下请求为get，加上时间戳，防止缓存
    if (method.toUpperCase() === "GET") {
        return url + "?&t=" + new Date().getTime();
    }
    return url;
}