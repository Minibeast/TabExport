function download(data) {
    var file = new Blob([data], { type: "text/plain" });
    var a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = "tabs.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

async function updateTabNum() {
    let tabNum = document.getElementById('tabNum');
    if (tabNum) {
        let tabs = await getCurrentWindowTabs();
        tabNum.textContent = tabs.length;
    }
}

async function updateWinNum() {
    let winNum = document.getElementById('winNum');
    if (winNum) {
        let windows = await getCurrentWindowNum();
        winNum.textContent = windows;
    }
}

async function loadPopup() {
    let element = document.getElementById('exportBtn');
    if (element) {
        element.addEventListener('click', handlePopupBtn);
    }
    let input = document.getElementById('loadImportPageBtn');
    if (input) {
        input.addEventListener('click', openImportPage);
    }
    await updateTabNum();
    await updateWinNum();
}

async function handlePopupBtn() {
    let output = "";
    let tabs = await getCurrentWindowTabs();
    for (const tab of tabs) {
        if (tab.url != 'about:newtab')
            output += tab.url + " - " + tab.title + "\n\n";
    }
    download(output.trimEnd());
}

async function getCurrentWindowTabs() {
    return browser.tabs.query({});
}

async function getCurrentWindowNum() {
    let windows = await browser.windows.getAll();
    return windows.length;
}

function openImportPage() {
    let createData = {
        type: "detached_panel",
        url: "import.html",
        width: 250,
        height: 100
    };
    browser.windows.create(createData);
}

document.addEventListener("DOMContentLoaded", loadPopup);
