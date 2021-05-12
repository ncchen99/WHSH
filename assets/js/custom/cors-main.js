const file_url = "./assets/js/custom/request_urls.yml";

function get_data(file_url) {
  var result;
  $.ajax({
    url: file_url,
    type: "get",
    async: false,
    success: function (data) {
      result = data;
    },
  });
  return result;
}

class Widget {
  constructor(file_url) {
    this.file_url = file_url;
    this.json_data = jsyaml.load(get_data(file_url));
    this.base_url = this.json_data["base_url"];
    this.ajax_server = this.json_data["ajax_server"];
  }

  query_news(board, tabs) {
    $.ajax({
      // headers: json_data['request_headers'],
      type: this.json_data[board][tabs]["general"]["request_method"],
      url:
        this.ajax_server +
        this.base_url +
        this.json_data[board][tabs]["general"]["request_url"],
      dataType: this.json_data[board][tabs]["general"]["data_type"],
      data: this.json_data[board][tabs]["query_string_parameters"],

      success: function (response) {
        console.log(response);
        $("#news-table-div").html(` 
           <table class="table table-responsive" id="news-table">
           </table>`);
        var innerHTML = `<thead>
          <tr>
            <th class="text-center">時間</th>
            <th>單位</th>
            <th>標題</th>
            <th>點閱</th>
          </tr>
          </thead>
          <tbody>
          </tbody>`;
        $("#news-table").html(innerHTML);
        response.shift();
        for (const row of response) {
          var tr = "<tr>";
          tr += "<td>" + row["time"] + "</td>";
          tr += "<td>" + row["unit_name"] + "</td>";
          tr += "<td>";
          tr +=
            '<a href="javascript:void(0)" onclick="widget.query_news_content(';
          tr += row["newsId"] + ", ";
          tr +=
            "'" + tabs + "'" + ')" class="btn btn-link text-primary news-btn">';
          if (row["top"] == 1) {
            tr += '<span class="badge badge-pill badge-danger">HOT</span>';
          }
          tr += " " + row["title"] + "</a>" + "</td>";
          tr += "<td>" + row["clicks"] + "</td>";
          tr += "</tr>";
          $("#news-table > tbody").append(tr);
        }
      },
      error: function (thrownError) {
        $("#news-table-div").html(`<div class="alert alert-danger" role="alert">
        ERROR :(
        </div>`);
        console.log(thrownError);
      },
    });
  }

  query_news_content(nid, tabs) {
    var board = "query_news_content";
    $("#news-modal-body").html(
      `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
    );
    $("#news-modal").modal("show");
    (function (widget_this) {
      $.ajax({
        // headers: json_data['request_headers'],
        type: widget_this.json_data[board][tabs]["general"]["request_method"],
        url:
          widget_this.ajax_server +
          widget_this.base_url +
          widget_this.json_data[board][tabs]["general"]["request_url"],
        dataType: widget_this.json_data[board][tabs]["general"]["data_type"],
        data: {
          ...widget_this.json_data[board][tabs]["query_string_parameters"],
          ...{ nid: nid },
        },

        success: function (response) {
          console.log(response);
          $("#news-modal-title").text(response[0]["title"]);
          var innerHTML = "";
          if (response[0]["attachedfile"] != "[]") {
            var attachedfile = JSON.parse(response[0]["attachedfile"]);
            innerHTML += `<h5>附件：　</h5>`;
            for (var i = 0; i < attachedfile.length; i++) {
              innerHTML +=
                `<a href="` +
                widget_this.json_data["my_server"] +
                "resources/" +
                response[0]["uid"] +
                "/" +
                response[0]["resources"] +
                "/attached/" +
                unescape(attachedfile[i][attachedfile[i].length - 1]) +
                `" role="button" target="_blank" class="btn btn-link text-primary" title="` +
                unescape(attachedfile[i][attachedfile[i].length - 1]) +
                `" data-content="下載">` +
                unescape(attachedfile[i][attachedfile[i].length - 1]) +
                `</a>`;
            }
            innerHTML += `<hr>`;
          }
          innerHTML += decodeURIComponent(response[0]["content"]);

          $("#news-modal-body").html(innerHTML);
          $("#news-modal-body img").each(function () {
            $(this).removeAttr("style");
            $(this).css({ "max-width": "100%", height: "auto" });
            console.log($(this).attr("src"));
            $(this).attr(
              "src",
              $(this)
                .attr("src")
                .replace(
                  widget_this.base_url,
                  widget_this.json_data["my_server"]
                )
            );
          });
          //   $.ajax({
          //     url: "http://localhost:8080/" + $(this).attr("src"),
          //     type: "get",
          //     dataType: "html",
          //     xhrFields: {
          //       withCredentials: true,
          //     },
          //     async: false,
          //     success: function (data, status) {
          //       console.log("Status: " + status + "\nData: " + data);
          //       /* creating image assuming data is the url of image */
          //       $(this).attr("src", "data:image/gif;base64," + data);
          //     },
          //   });
        },
        error: function (thrownError) {
          $("#news-modal-title").text("ERROR ：(");
          $("#news-modal-body")
            .html(`<div class="alert alert-danger" role="alert">
          ERROR :(
          </div>`);
          console.log(thrownError);
        },
      });
    })(this);
  }
}

var widget;
var board = "lower_board";
var tabs = "bulletin_board";

(function () {
  "use strict";
  $(document).ready(function () {
    widget = new Widget(file_url);
    widget.query_news(board, tabs);
  });
})();
