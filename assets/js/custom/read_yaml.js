function read_yaml(file_url) {
    "use strict";
    $(document).ready(function () {
        $.get(file_url).done(function (data) {
            console.log("yaml File load complete");
            return jsyaml.load(data);
            // console.log($.parseJSON(_json_string));
        });
    });
}
