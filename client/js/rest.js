/**
 * restSendTestPayload: Send post request
 * @param {string} toolname
 * @param {string} payload
 * @param {hackConfig} config object for hack tool
 */
function restRunHackTool(toolname, payload, hackConfig, callback) {
    let url = `/api/hacktool/${toolname}`;
    if (hackConfig !== "") {
        url = `${url}?${hackConfig}`;
    }
    let contentType = "text/plain";
    let dataType = "json";
    console.info("Sending POST request to url " + url);
    $.ajax({
        url: url,
        type: "POST",
        contentType: contentType,
        data: payload,
        dataType: dataType,
        success: callback,
        statusCode: {
            404: function (data) {
                warningMessage(`HTTP 404: Could not process this hack: ${JSON.stringify(data)}`);
            },
            409: function () {
                warningMessage(`HTTP 409: Could not process this hack: ${JSON.stringify(data)}`);
            },
            500: function () {
                warningMessage(`HTTP 500: Could not process this hack: ${JSON.stringify(data)}`);
            },
        },
    });
}

// Clear status message popup
function clearMsg() {
    $("#msg").html("");
    $("#msg").removeClass("alert-success alert-warning alert-danger ");
}

// Extract validation error and format it nicely for UI output
function formatValidationError(data) {
    let errMsg = "Input Validation Error: ";
    let msg = "";
    if (data !== undefined && data.responseText !== undefined) {
        if (
            data.responseText !== undefined &&
            data.responseText.length !== undefined &&
            typeof data.responseText === "string"
        ) {
            let body = JSON.parse(data.responseText);

            if (body !== undefined && body.errors !== undefined) {
                for (let i in body.errors) {
                    if (msg.length > 0) msg += "<br/>";
                    msg += body.errors[i].param + ": " + body.errors[i].msg;
                }
            }
        }
    }
    errMsg += msg;
    clearMsg();
    $("#msg").addClass("alert alert-danger");
    $("#msg").html(errMsg);
    setTimeout(clearMsg, 8000);
}

// Show success message message
function successMessage(msg) {
    if (msg !== undefined) {
        clearMsg();
        $("#msg").addClass("alert alert-success");
        $("#msg").html(msg);
        setTimeout(clearMsg, 5000);
    }
}

// Show warning message message
function warningMessage(msg) {
    if (msg !== undefined) {
        clearMsg();
        $("#msg").addClass("alert alert-warning");
        $("#msg").html(msg);
        setTimeout(clearMsg, 8000);
    }
}
