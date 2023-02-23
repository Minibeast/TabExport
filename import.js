let input;

async function loadImport() {
    input = document.getElementById('inputBtn');
    if (input) {
        input.addEventListener('change', handleFileBtn);
    }
}

async function parseFile(fileText) {
    let fileArr = fileText.split('\n\n');
    const window = await browser.windows.create({});
    for (const line of fileArr) {
        let url = line.split(" - ")[0].trim();
        try {
            await browser.tabs.create({ url: url, windowId: window.id });
        } catch (error) { // Throws an error if, for security reasons, it chooses not to open the tab.
            console.error(error);
        }
    }
    let thisWin = await browser.windows.WINDOW_ID_CURRENT;
    await browser.windows.remove(thisWin);
}

function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

async function handleDrop(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                const fileReader = new FileReader();
                fileReader.readAsText(file);
                fileReader.onload = async function () {
                    await parseFile(fileReader.result);
                }
                return;
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            var file = ev.dataTransfer.files[i];
            const fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function () {
                parseFile(fileReader.result);
            }
            return;
        }
    }
}

async function handleFileBtn() {
    var files = input.files;

    if (files.length == 0) return;

    var file = files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = async function () {
        await parseFile(fileReader.result);
    }
}

document.addEventListener("DOMContentLoaded", loadImport);
document.addEventListener('drop', handleDrop);
document.addEventListener('dragover', dragOverHandler);
