function delMessage(id) {
    sendDelReq(id);
}

function newMessage() {
    let message = $("#ChatInput").val();
    let pollute = $("#Pollute").prop("checked");
    sendPutReq(message, pollute);
}

function sendPutReq(messageText, pollute) {
    let url = "/msg";
    let data = {
        auth: {
            name: "user",
            password: "123456",
        },
        message: {
            text: messageText,
            pollute: pollute,
        },
    };
    console.debug(`Prototype pollution: ${pollute}`);
    console.info(`Sending PUT request to url ${url} with data ${JSON.stringify(data)}`);

    $.ajax({
        url: url,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        statusCode: {
            200: function () {
                location.reload();
            },
            403: function (data) {
                alert(`Status: ${data.statusText}`);
            },
        },
    });
}

function sendDelReq(id) {
    let url = "/msg";
    let data = {
        auth: {
            name: "user",
            password: "123456",
        },
        messageId: id,
    };
    console.info(`Sending DELETE request to url ${url} with data ${JSON.stringify(data)}`);

    $.ajax({
        url: url,
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        statusCode: {
            200: function () {
                location.reload();
            },
            403: function (data) {
                alert(`Could not delete message #${id}: ${data.statusText}`);
            },
        },
    });
}
