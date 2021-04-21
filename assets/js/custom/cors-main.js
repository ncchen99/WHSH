const file_url = "./assets/js/custom/request_urls.yml";

(function () {
  "use strict";
  $(document).ready(function () {
    $.get(file_url).done(function (data) {
      var json_data = jsyaml.load(data);

      console.log(json_data);
      const base_url = json_data["base_url"];
      const ajax_server = json_data["ajax_server"];

      var board = "lower_board";
      var tabs = "bulletin_board";

      $.ajax({
        // headers: json_data['request_headers'],
        type: json_data[board][tabs]["general"]["request_method"],
        url:
          ajax_server +
          base_url +
          json_data[board][tabs]["general"]["request_url"],
        dataType: json_data[board][tabs]["general"]["data_type"],
        data: json_data[board][tabs]["query_string_parameters"],

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
            if (row["top"] == 1) {
              tr += '<span class="badge badge-pill badge-danger">HOT</span>';
            }
            tr += " " + row["title"] + "</td>";
            tr += "<td>" + row["clicks"] + "</td>";
            tr += "</tr>";
            $("#news-table > tbody").append(tr);
          }
        },
        error: function (thrownError) {
          $("#news-table-div")
            .html(`<div class="alert alert-danger" role="alert">
					This is a danger alert—check it out!
				  </div>`);
          console.log(thrownError);
        },
      });
    });
  });
})();
