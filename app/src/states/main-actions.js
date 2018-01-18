// main-actions.js
export function setOsVersion() {
    if (navigator.appVersion.indexOf("Win") !== -1) {
        console.log("Set OS version: Windows");
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Windows'
        };
    } else if (navigator.appVersion.indexOf("Mac") !== -1) {
        console.log("Set OS version: Macintosh");
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'macOS'
        };
    } else if (navigator.appVersion.indexOf("X11") !== -1) {
        console.log("Set OS version: X11");
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'UNIX'
        };
    } else if (navigator.appVersion.indexOf("Linux") !== -1) {
        console.log("Set OS version: Linux");
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Linux'
        };
    } else {
        console.log("Set OS version: Unknown");
        return {
            type: '@MAIN/SET_OS_VERSION',
            osVersion: 'Unknown'
        };
    }
}

export function toggleNavbar() {
    return {
        type: '@MAIN/TOGGLE_NAVBAR'
    };
}

export function setDebug(status) {
    return {
        type: '@MAIN/SET_DEBUG',
        status: status,
    }
}

export function setLoad(status) {
    return {
        type: '@MAIN/SET_LOADING',
        status: status
    }
}

function getDivWidth(divWidth) {
    if (divWidth < 768) {
        return 420;
    } else if (divWidth < 992) {
        return 600;
    } else if (divWidth < 1200) {
        return 840;
    } else {
        return 1020;
    }
}

export function changeWindowSize(width, height) {
    let _width = getDivWidth(width);
    return {
        type: '@MAIN/CHANGE_WINDOW_SIZE',
        divWidth: _width,
        divHeight: height
    };
}

export function rerenderTrigger(state) {
    return {
        type: '@MAIN/RERENDER_TRIGGER',
        state: state
    };
}

export function dataMainLoad(data) {
    return {
        type: '@MAIN/LOAD_DATA',
        data: data
    };
}

export function mainDataInitialize() {
    return {
        type: '@MAIN/DATA_INITIALIZE'
    }
}

export function setCurPosition(pos) {
    return {
        type: '@MAIN/SET_CUR_POSITION',
        position: pos,
    }
}
