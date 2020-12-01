function addSample(sampleName) {
    $("#InputArea").val(hacks[sampleName]["sample"]);
}

function addConfig(sampleName) {
    $("#HackConfig").val(hacks[sampleName]["config"]);
}

function showRef(testname, reftype) {
    window.open(hacks[testname][reftype], `HackRefWin-${reftype}`);
}

function runProcessor(processor) {
    let indent = 0;
    if ($("#PrettifyOutput").prop("checked")) indent = 4;

    $("#OutputArea").val("");
    let inputData = $("#InputArea").val();
    let hackConfig = $("#HackConfig").val();
    restRunHackTool(processor, inputData, hackConfig, function (data) {
        if (data !== null && data !== undefined) {
            $("#OutputArea").val(JSON.stringify(data, null, indent));
        } else $("#OutputArea").val(JSON.stringify("ERROR, review logs"));
    });
}

function switchTest() {
    let testname = $("#HackToolSel").val();
    console.info(`Switching test to ${testname}`);
    addSample(testname);
    addConfig(testname);
    $("#PrettifyLabel").prop("hidden", false);
    $("#PrettifyOutput").prop("hidden", false);
    $("#RunHack").prop("hidden", false);
    $("#HackHelp").prop("hidden", false);
    $("#DevHelp").prop("hidden", false);
    $("#GenHelp").prop("hidden", false);
    $("#HackConfig").prop("hidden", false);
}

function runTest() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Running test ${testname}`);
        runProcessor(testname);
    }
}

function showHackHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing hacking help for test ${testname}`);
        showRef(testname, "hackref");
    }
}

function showDevHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing dev help for test ${testname}`);
        showRef(testname, "devref");
    }
}

function showGenHelp() {
    let testname = $("#HackToolSel").val();
    if (testname !== null) {
        console.info(`Showing generic help for test ${testname}`);
        showRef(testname, "genref");
    }
}

function separateOutputLines() {
    let newOutput = "";
    if (!$("#PrettifyOutput").prop("checked")) {
        console.info("Separating output lines for easier reading");
        for (let i of JSON.parse($("#OutputArea").val())) {
            newOutput += JSON.stringify(i) + "\n\n";
        }
        $("#OutputArea").val(newOutput);
    } else {
        console.warn("Already prettified, no need to separate output lines");
    }
}
