
d3.csv("data/SAT_Avg.csv",function(data){

    data.forEach(function(d){
      d.x=parseFloat(d["Enroll, Female: Avg. SAT Math Score (Enrl F)"] );
      d.y= parseFloat(d["school year"]);
      //console.log(data);


    });


    var margin = {top:20, bottom:60 , left:80 , right:60};
    var width= 550- margin.left - margin.right;
    var height = 500 - margin.bottom- margin.top;


    var x= d3.scaleLinear().range([0,width]);
    var y = d3.scaleLinear().range([height,0]);

    x.domain([400, 20+d3.max(data,function(d)  {return parseInt(d["Enroll, Female: Avg. SAT Math Score (Enrl F)"])})]);
    y.domain([2000,2+d3.max(data,function(d) {return parseInt(d["school year"])})]);

    console.log(width, width + margin.left + margin.right);

    var svg = d3.select("#scatterPlot")
            .append("svg")
            .attr("height",height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")" );

            svg.selectAll("circle")
                  .data(data)
                  .enter()
                  .append("circle")
                  .attr("r", 7)
                  .style("fill","orange")
                  .attr("id", function(d){return ("bar1-"+(Math.round(d.y)).toString());})
                  .attr("stroke","gray")
                  .attr("stroke-width",1)
                  .attr("cx", function(d){return x(d["Enroll, Female: Avg. SAT Math Score (Enrl F)"]);})
                  .attr("cy",function(d){return y(d["school year"]);})
                  .attr("x_val",function(d){ return d.x;})
                  .attr("y_val",function(d){return d.y;})
                  //.selectAll("circle")
                  .on("click",function(d,i){

              // Here I am plotting the values of the x and y axis on the paragraph using the barchartLabel , which is my div id
              // I have used ID to plot the dataset on the paragraph tags
                  d3.select("#scatterPlotLabel #t-datapoint").remove();
                  d3.select("#scatterPlotLabel")
                    .append("text")
                    .style("font-size","20px")
                    .attr("id","t-datapoint")
                    .text("["+d.x+","+d.y+"]");

                  })


                  .on("mouseover", function(g,f){
                   d3.select(this)
                   .transition()
                   .duration(100)
                   .attr("r", 11)
                   .style("fill","red")

                   d3.select("#bar2-"+(Math.round(g.y)).toString())
                   .transition()
                   .duration(100)
                   .attr("r", 11)
                   .style("fill", "red")

                   tooltip.style("display", null);

                   d3.select(".tooltip2").style("display",null);

                   //d3.select("#bar1-"+(Math.round(g.y)).toString()).attr("fill","red");   // Change color of the bar in chart 1 when mouse is hovered over it
                   //d3.select("#bar2-"+(Math.round(g.y)).toString()).attr("fill","red");







                   ;})

                   .on("mousemove", function(d,i) {
                     var xPosition = d3.mouse(this)[0] - 35;
                     var yPosition = d3.mouse(this)[1] - 55;
                     tooltip.attr("transform", "translate(" + (parseFloat(d3.select(this).attr("cx"))-10) + "," + (parseFloat(d3.select(this).attr("cy"))+10) + ")");
                     var text1 = "X: "+d.x.toFixed(2);
                     var text2 = "Y: "+d.y;
                     tooltip.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
                     tooltip.select("#text2").attr("x",((text2.length*6)/2 + 10 - ((text2.length*6) - (text2.length*6)/2)));
                     tooltip.select("#text2").text(text2);

                     var bar2 = d3.select("#bar2-"+(Math.round(d.y)).toString())
                     bar2_cx = bar2.attr("cx")
                     bar2_cy = bar2.attr("cy")
                     bar2_x = parseFloat(bar2.attr("x_val"))
                     bar2_y = parseFloat(bar2.attr("y_val"))
                     tooltip2 = d3.select(".tooltip2")
                     text1 = "X: "+bar2_x.toFixed(2);
                     text2 = "Y: "+bar2_y;
                     tooltip2.attr("transform", "translate(" + (parseFloat(bar2_cx)-10) + "," + (parseFloat(bar2_cy)+10) + ")");
                     tooltip2.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
                     tooltip2.select("#text2").attr("x",((text2.length*6)/2 + 10 - ((text2.length*6) - (text2.length*6)/2)));
                     tooltip2.select("#text2").text(text2);

                     //tooltip.select("rect").attr("width",(text2.length*8));
                   })


                   .on("mouseout", function(c,f){
                    d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", 7)
                   .style("fill", "orange")

                   d3.select("#bar2-"+(Math.round(c.y)).toString())
                   .transition()
                   .duration(100)
                   .attr("r", 7)
                   .style("fill", "orange")

                    d3.select("#scatterPlot svg g #tooltip").remove();
             
                    tooltip.style("display", "none");
                    d3.select(".tooltip2").style("display","none")

                  });

                   var tooltip = svg.append("g")
                     .attr("class", "tooltip1")
                     .style("display", "none");

                   tooltip.append("rect")
                     .attr("width", 70)
                     .attr("height", 40)
                     .attr("fill", "black")
                     .style("opacity", 1.0)
                     .attr("rx",15)
                     .attr("ry", 15);

                   tooltip.append("text")
                     .attr("dy", "1.2em")
                     .attr("id", "text1")
                     .attr('style','fill:White')
                     .attr("font-size", "12px")
                     .attr("font-weight", "bold");

                   tooltip.append("text")
                     .attr("dy", "2.5em")
                     .attr("id", "text2")
                     .attr('style','fill:White')
                     .attr("font-size", "12px")
                     .attr("font-weight", "bold");
            

                  svg.append("g")
                    .attr("transform","translate(0,"+height+")")
                    .call(d3.axisBottom(x).ticks(20))                                
                    .attr("stroke-width",2)
                    .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("transform", "rotate(-45)");   

                  svg.append("g")
                    .call(d3.axisLeft(y).tickFormat(d3.format("d")))
                    .attr("stroke-width",2)
                    .selectAll("text")  
                    .style("text-anchor", "end")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold");

                  svg.append("text")
                     .attr("x",(width /2))
                     .attr("y",0 - (margin-top /4))
                     .attr("text-anchor","middle")
                     .style("font-size","20px")                               
                     .attr("font-weight", "bold")
                     .text("Female SAT Avg.");
                  
                  // Add Y-axis Label which is "Y" here
                  svg.append("text")
                      .attr("text-anchor", "middle")  
                      .attr("style","font-size: 16px;font-style: italic;")
                      .attr("font-weight", "bold")
                      .attr("transform", "translate("+ (0-(margin.left/2)) +","+(height/2)+") rotate (-90)")  // text is drawn off the screen top left, move down and out and rotate
                      .text("Years");

                  // Add X-axis Label which is "X" here
                svg.append("text")
                    .attr("text-anchor", "middle")  
                    .attr("style","font-size: 16px;font-style: italic;")
                    .attr("font-weight", "bold")
                    .attr("transform", "translate("+ (width/2) +","+(height+(margin.bottom/1.2))+")")  // centre below axis
                    .text("Avg. SAT Scores");

  });

//Second Scatter plot showing the average SAT score for the admissions in the undergraduate degrees over the years

  d3.csv("data/SAT_Avg.csv",function(data){

    data.forEach(function(d){
      d.x=parseFloat(d["Enroll, Male: Avg. SAT Math Score (Enrl M)"] );
      d.y= parseFloat(d["school year"]);
      //console.log(data);


    });

    var margin = {top:20, bottom:60 , left:80 , right:60};
    var width= 550- margin.left - margin.right;
    var height = 500 - margin.bottom- margin.top;

    var x= d3.scaleLinear().range([0,width]);
    var y = d3.scaleLinear().range([height,0]);



    x.domain([400, 20+(d3.max(data,function(d)  {return parseInt(d["Enroll, Male: Avg. SAT Math Score (Enrl M)"])}))]);
    y.domain([2000,2+(d3.max(data,function(d) {return parseInt(d["school year"])}))]);



    var svg = d3.select("#scatterPlot")
            .append("svg")
            .attr("height",height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")" );

            svg.selectAll("circle")
                  .data(data)
                  .enter()
                  .append("circle")
                  .attr("r", 7)
                  .style("fill","orange")
                  .attr("stroke","gray")
                  .attr("id", function(d){return ("bar2-"+(Math.round(d.y)).toString());})
                  .attr("stroke-width",1)
                  .attr("cx", function(d){return x(d["Enroll, Female: Avg. SAT Math Score (Enrl F)"]);})
                  .attr("cy",function(d){return y(d["school year"]);})
                  .attr("x_val",function(d){ return d.x;})
                  .attr("y_val",function(d){ return d.y;})
                  //.selectAll("circle")
                  .on("click",function(d,i){
       
                  d3.select("#scatterPlotLabel #t-datapoint").remove();
                  d3.select("#scatterPlotLabel")
                    .append("text")
                    .style("font-size","20px")
                    .attr("id","t-datapoint")
                    .text("["+d.x+","+d.y+"]");

                  })


                  .on("mouseover", function(g,f){
                   d3.select(this)
                   .transition()
                   .duration(100)
                   .attr("r", 11)
                   .style("fill", "red")

                   d3.select("#bar1-"+(Math.round(g.y)).toString())
                   .transition()
                   .duration(100)
                   .attr("r", 11)
                   .style("fill", "red")
              
                   tooltip.style("display", null)

                   d3.select(".tooltip1").style("display",null);



                   ;})

                   .on("mousemove", function(d,i) {
                     var xPosition = d3.mouse(this)[0] - 35;
                     var yPosition = d3.mouse(this)[1] - 55;
                     tooltip.attr("transform", "translate(" + (parseFloat(d3.select(this).attr("cx"))-10) + "," + (parseFloat(d3.select(this).attr("cy"))+10) + ")");
                     var text1 = "X: "+d.x.toFixed(2);
                     var text2 = "Y: "+d.y;
                     tooltip.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
                     tooltip.select("#text2").attr("x",((text2.length*6)/2 + 10 - ((text2.length*6) - (text2.length*6)/2)));
                     tooltip.select("#text2").text(text2);
                     //tooltip.select("rect").attr("width",(text2.length*8));

                     var bar1 = d3.select("#bar1-"+(Math.round(d.y)).toString())
                     bar1_cx = bar1.attr("cx")
                     bar1_cy = bar1.attr("cy")
                     bar1_x = parseFloat(bar1.attr("x_val"))
                     bar1_y = parseFloat(bar1.attr("y_val"))
                     tooltip1 = d3.select(".tooltip1")
                     text1 = "X: "+bar1_x.toFixed(2);
                     text2 = "Y: "+bar1_y;
                     tooltip1.attr("transform", "translate(" + (parseFloat(bar1_cx)-10) + "," + (parseFloat(bar1_cy)+10) + ")");
                     tooltip1.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
                     tooltip1.select("#text2").attr("x",((text2.length*6)/2 + 10 - ((text2.length*6) - (text2.length*6)/2)));
                     tooltip1.select("#text2").text(text2);
                   })


                   .on("mouseout", function(c,f){
                   d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", 7)
                    .style("fill", "orange")

                    d3.select("#bar1-"+(Math.round(c.y)).toString())
                    .transition()
                    .duration(100)
                    .attr("r", 7)
                    .style("fill", "orange")
            //       .style("fill", "orange")

                    d3.select("#scatterPlot svg g #tooltip").remove();
                    tooltip.style("display", "none")
                    d3.select(".tooltip1").style("display","none")


                  });

             var tooltip = svg.append("g")
               .attr("class", "tooltip2")
               .style("display", "none");

             tooltip.append("rect")
               .attr("width", 70)
               .attr("height", 40)
               .attr("fill", "black")
               .style("opacity", 1.0)
               .attr("rx",15)
               .attr("ry", 15);

             tooltip.append("text")
               .attr("dy", "1.2em")
               .attr("id", "text1")
               .attr('style','fill:White')
               .attr("font-size", "12px")
               .attr("font-weight", "bold");

             tooltip.append("text")
               .attr("dy", "2.5em")
               .attr("id", "text2")
               .attr('style','fill:White')
               .attr("font-size", "12px")
               .attr("font-weight", "bold");


            svg.append("g")
              .attr("transform","translate(0,"+height+")")
              .call(d3.axisBottom(x).ticks(20))              
              .attr("stroke-width",2)
              .selectAll("text")  
              .style("text-anchor", "end")
              .attr("font-size", "12px")
              .attr("font-weight", "bold")
              .attr("transform", "rotate(-45)"); 

            svg.append("g")
              .call(d3.axisLeft(y).tickFormat(d3.format("d")))
              .attr("stroke-width",2)
              .selectAll("text")  
              .style("text-anchor", "end")
              .attr("font-size", "12px")
              .attr("font-weight", "bold");

            svg.append("text")
               .attr("x",(width /2))
               .attr("y",0 - (margin-top /4))
               .attr("text-anchor","middle")
               .style("font-size","20px")                               
               .attr("font-weight", "bold")
               .text("Male SAT Avg.");
            
            // Add Y-axis Label which is "Y" here
            svg.append("text")
                .attr("text-anchor", "middle")  
                .attr("style","font-size: 16px;font-style: italic;")
                .attr("font-weight", "bold")
                .attr("transform", "translate("+ (0-(margin.left/2)) +","+(height/2)+") rotate (-90)")  // text is drawn off the screen top left, move down and out and rotate
                .text("Years");

            // Add X-axis Label which is "X" here
            svg.append("text")
                .attr("text-anchor", "middle")  
                .attr("style","font-size: 16px;font-style: italic;")
                .attr("font-weight", "bold")
                .attr("transform", "translate("+ (width/2) +","+(height+(margin.bottom/1.2))+")")  // centre below axis
                .text("Avg. SAT Scores");


  });
