// worker.js
import { expose } from "comlink";
import { API } from "./api";

let port;
let consoleOutput = ""; // Variable to store console outputs

const apiOptions = {
    hostWrite(s) {
        // port.postMessage({ id: 'write', data: s })
        // console.log(s);
        consoleOutput += s ;
    },
};

const api = new API(apiOptions);

const obj = {
    async setShowTiming(data) {
        api.showTiming = data;
    },

    async compileLinkRun(data) {
        consoleOutput = "";
        const result = await api.compileLinkRun(data);
        return { result, consoleOutput };
    },
};

expose(obj);
