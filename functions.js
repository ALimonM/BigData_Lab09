function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

$(function(){

    var cars_data, cars_columns;

    d3.csv('car.csv',function(csvdata){
        cars_data = csvdata;
        cars_columns = d3.keys(csvdata[0]);

        var selx = $('#sel-x');
        var sely = $('#sel-y');
        $.each(cars_columns, function(index,val){
            if (val != "name" && val != "origin") {
                selx.append(new Option(val,val));
                sely.append(new Option(val,val));  }  });

        var width = 500, height = 400, margin = 50;
        var x_scale_linear = d3.scale.linear().range([margin, width-margin*2]),
            xAxis = d3.svg.axis().scale(x_scale_linear).orient("bottom").ticks(5);
        var y_scale_linear = d3.scale.linear().range([height-margin, margin]),
            yAxis = d3.svg.axis().scale(y_scale_linear).orient("left").ticks(5);

        var svg = d3.select(".plot").append("svg")
            .attr("width", width)
            .attr("height", height);
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height-margin) + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin + ",0)")
            .call(yAxis);


        $("#update").click(function() {
            var axisx = $("#sel-x option:selected").val();
            var axisy = $("#sel-y option:selected").val();
            if (axisx == "mpg" || axisy == "mpg"){
                var mpgmin = $("#mpg-min").val();
                var mpgmax = $("#mpg-max").val();  }

            var axis_data = [];
            $.each(cars_data, function(index, d) {
                var namevalue = d["name"];
                var xvalue = null;
                var yvalue = null;
                if (axisx == "mpg" ) {
                    if (+d[axisx] >= mpgmin && +d[axisx]<= mpgmax) {  xvalue = +d[axisx]; }
                } else {  xvalue = +d[axisx];  }
                if (axisy == "mpg" ) {
                    if (+d[axisy] >= mpgmin && +d[axisy]<= mpgmax) {  yvalue = +d[axisy]; }
                } else {  yvalue = +d[axisy];  }
                if ( isNumber(xvalue) && isNumber(yvalue) ) {
                    namevalue = d["name"];
                    axis_data.push( [xvalue,yvalue,namevalue] ); }  });

            //console.log(axis_data);

            // update axis
            x_scale_linear.domain([0, d3.max(axis_data, function(d) {return d[0]; })]);
            y_scale_linear.domain([0, d3.max(axis_data, function(d) {return d[1]; })]);

            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            // update dataset (scatterplot)
            var circle = svg.selectAll("circle")
                .data(axis_data);

            circle.exit().remove();

            circle.enter().append("circle");

            circle.on("mouseover", function(d) {
                $('#hovered').text(d[2]);
            });

            circle
                .attr("cx", function(d) {  return x_scale_linear( d[0] ); } )
                .attr("cy", function(d) {  return y_scale_linear( d[1] ); } )
                .attr("r", 2.5);
        });
    });
});
