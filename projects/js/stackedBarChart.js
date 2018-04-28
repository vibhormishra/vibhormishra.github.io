
var margin = {top: 20, right: 200, bottom:150, left: 150},
            width = 1000 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;
var x0;
var x1;
var y;
var color;
var svg;
var columnHeaders;
var innerColumns = {
          "column1" : ["Totals, Female: Asian (Tot. F)","Totals, Female: Black/African American (Tot. F)","Totals, Female: Hispanics of any race (Tot. F)","Totals, Female: American Indian/Alaska Native (Tot. F)","Totals, Female: Native Hawaiian/Other Pacific Islander (Tot. F)", "Totals, Female: Two or more races (Tot. F)", "Totals, Female: White (Tot. F)"],
          "column2" : ["Totals, Male: Asian (Tot. M)", "Totals, Male: Black/African American (Tot. M)", "Totals, Male: Hispanics of any race (Tot. M)", "Totals, Male: American Indian/Alaska Native (Tot. M)", "Totals, Male: Native Hawaiian/Other Pacific Islander (Tot. M)", "Totals, Male: Two or more races (Tot. M)", "Totals, Male: White (Tot. M)"]       
        };

var legendCols = ["Asian", "Black/African America", "Hispanics of any race", "American Indian/Alaska Native", "Native Hawaiian/Other Pacific Islander", "Two or more races", "White"];      
var project_stackedbar;
var tooltip;
        
function changeStackedBarChartData(department) {

  d3.csv("data/EthinicityWisePopulation.csv", function(error, data_ori) {
    if(error) throw error;
    //Format the data
    data = []
    data_ori.forEach(function(d){
      if (d['Major Program Name'] === department) {
        data.push(d);
      }
    });

    detailsMap = {};

    data.forEach(function(d) {
      var yColumn = new Array();
      d.columnDetails = columnHeaders.map(function(name) {
        for (ic in innerColumns) {
          if($.inArray(name, innerColumns[ic]) >= 0){
            if (!yColumn[ic]){
              yColumn[ic] = 0;
            }
            yBegin = yColumn[ic];
            yColumn[ic] += +d[name];
            var genderVal = (name.indexOf("Female") > -1)? "Female":"Male";
            
            if (detailsMap[d['School Year']] == null)
              detailsMap[d['School Year']] = {};
            detailsMap[d['School Year']][name] = {yBegin: yBegin, yEnd: +d[name] + yBegin, val: d[name], gender: genderVal};

            //console.log(d['School Year'], name);
            return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin, gender: genderVal, val: d[name], year: d['School Year'] };
          }
        }
      });          
      d.total = d3.max(d.columnDetails, function(d) { 
        return d.yEnd; 
      });
    });

    y_max_val = (d3.max(data, function(d) { 
      return d.total; 
    }));

    console.log(detailsMap);
    y.domain([0, y_max_val + (y_max_val)/5]);

    svg.select(".yaxis").transition().duration(500)
       .remove()
       .on("end", function(d,i){ 
            svg.append("g")
              .attr("class", "yaxis")
              .call(d3.axisLeft(y))
              .selectAll("text")  
              .style("text-anchor", "end")
              .attr("font-size", "12px")
              .attr("font-weight", "bold")    
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".7em")
              .style("text-anchor", "end")
              .text("");
        });    
       
    svg.selectAll(".g rect").transition()
       //.duration(1000)
       .delay(function(d, i) { return i * 5; })       
       .attr("y", height)
       .attr("height", 0)
       .on("end", function(d,i){ repopulateValues(this, d,i); });       
       
    function repopulateValues(element, d,i) {
     
      //console.log(detailsMap[d['year']][d['name']]);
      var yBegin = detailsMap[d['year']][d['name']]['yBegin'];
      var yEnd = detailsMap[d['year']][d['name']]['yEnd'];
      var val = detailsMap[d['year']][d['name']]['val'];
      var gender = detailsMap[d['year']][d['name']]['gender'];
      var index = i;
      d3.select(element)
       .on("mouseover",function(d) {
            console.log(val, gender, index);
            d3.select(this).attr("style","fill:DarkRed ;stroke-width:3;stroke:DarkRed");   // Change color of the mouse fill when mouse is hovered over it

            tooltip.style("display", null);
            var text1 = gender;
            var text2 = legendCols[index%7]+": "+val;            
            tooltip.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
            tooltip.select("#text2").attr("x",10).text(text2);     

            box = tooltip.select("#text2").node().getBBox();
            tooltip.select("rect").attr("width",box.width+20);
          })        
        .transition()
        //.duration(1000)
        .delay(function(d, i) { return i * 5; })
        .attr("y", function(d) { 
          return y(yEnd); 
        })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { 
          return y(yBegin) - y(yEnd); 
          });
        /*.on("end", function(d,i){ 
          d3.select(this).on("mouseover",function(d,i) {
            console.log(val, gender);
            d3.select(this).attr("style","fill:DarkRed ;stroke-width:3;stroke:DarkRed");   // Change color of the mouse fill when mouse is hovered over it

            tooltip.style("display", null);
            var test1 = gender;
            var text2 = legendCols[i%7]+": "+val;            
            tooltip.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
            tooltip.select("#text2").attr("x",((text2.length*6)/2 + 10 - ((text2.length*6) - (text2.length*6)/2))).text(text1);
            tooltip.select("#text2").text(text2);
            tooltip.select("rect").attr("width",(text2.length*8));
          })
         });*/
    }      
    
  });
}


    function diversityData(department){
      d3.selectAll("#stackedbar svg").remove();
      d3.csv("data/EthinicityWisePopulation.csv", function(error, data_ori) {
      if(error) throw error;
      //Format the data
      data = []
      data_ori.forEach(function(d){
        if (d['Major Program Name'] === department) {
          data.push(d);
        }
      });

      // Set dimensions and margins of the graph        
      
      x0 = d3.scaleBand().rangeRound([0, width]).padding(0.1);
       
      x1 = d3.scaleBand();
       
      y = d3.scaleLinear()
          .range([height, 0]);
               
       
      color = d3.scaleOrdinal()
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
       
      svg = d3.select("#stackedbar").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
      var yBegin;
                     

      columnHeaders = d3.keys(data[0]).filter(function(key) { return (key !== "Major Program Name" && key !== "School Year"); });        
      color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "Major Program Name" && key !== "School Year"); }));
      data.forEach(function(d) {
        var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function(name) {
          for (ic in innerColumns) {
            if($.inArray(name, innerColumns[ic]) >= 0){
              if (!yColumn[ic]){
                yColumn[ic] = 0;
              }
              yBegin = yColumn[ic];
              yColumn[ic] += +d[name];
              var genderVal = (name.indexOf("Female") > -1)? "Female":"Male";
              return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin, gender: genderVal, val: d[name], year: d['School Year'] };
            }
          }
        });          
        d.total = d3.max(d.columnDetails, function(d) { 
          return d.yEnd; 
        });
      });

      x0.domain(data.map(function(d) { return d['School Year']; }));
      x1.domain(d3.keys(innerColumns)).rangeRound([0, x0.bandwidth()]);
     
      //console.log(x0);
      //console.log(x1);

      y_max_val = (d3.max(data, function(d) { 
        return d.total; 
      }));
      y.domain([0, y_max_val + (y_max_val)/5]);
     
      svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x0))
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")            
          .attr("transform", "rotate(-45)");
     
      svg.append("g")
          .attr("class", "yaxis")
          .call(d3.axisLeft(y))
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")    
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".7em")
          .style("text-anchor", "end")
          .text("");
     
      project_stackedbar = svg.selectAll(".project_stackedbar")
          .data(data)
        .enter().append("g")
          .attr("class", "g")
          .attr("transform", function(d) { return "translate(" + x0(d['School Year']) + ",0)"; });
     
      project_stackedbar.selectAll("rect")
          .data(function(d) { return d.columnDetails; })
          .enter().append("rect")
          .attr("class",function(d) { return  ((d.gender === "Male")?"male":"female")})
          .attr("width", x1.bandwidth())
          .attr("x", function(d) { 
            return x1(d.column);
             })
          .attr("y", function(d) { 
            return y(d.yEnd); 
          })
          .attr("colorHidden",  function(d) { return color(d.name); })
          .attr("height", function(d) { 
            return y(d.yBegin) - y(d.yEnd); 
          })
          .style("fill", function(d) { return color(d.name); })
          .on("mouseover",function(d,i) {              

              d3.select(this).attr("style","fill:DarkRed ;stroke-width:3;stroke:DarkRed");   // Change color of the mouse fill when mouse is hovered over it

              tooltip.style("display", null);

              var text1 = d.gender;
              var text2 = legendCols[i%7]+": "+d.val;
              tooltip.select("#text1").attr("x",((text2.length*6)/2 - (text1.length*1.5))).text(text1);
              tooltip.select("#text2").attr("x",10).text(text2);     

              box = tooltip.select("#text2").node().getBBox();
              tooltip.select("rect").attr("width",box.width+20);
          })
          .on("mouseout", function(d,i){
              d3.select(this).attr("style", null);
              var ori_color = d3.select(this).attr("colorHidden")
              d3.select(this).style("fill",ori_color);

              tooltip.style("display", "none");
          })
          .on("mousemove", function(d,i) {
            var xPosition = d3.mouse(this)[0] - 35;
            var yPosition = d3.mouse(this)[1] - 55;
            tooltip.attr("transform", "translate(" + (x0(d.year) + xPosition) + "," + yPosition + ")");            
          });              
      
      var legend = svg.selectAll(".legend")
          .data(legendCols)
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate("+margin.right+"," + i * 20 + ")"; });
     
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
     
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .attr("font-size", "14px")
          .attr("font-weight", "bold")
          .text(function(d) { return d; });

      // Prep the tooltip bits, initial display is hidden
      tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
          
      tooltip.append("rect")
        .attr("width", 30)
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

      // Add heading/title of the Plot
      svg.append("text")
          .attr("x", (width / 2))             
          .attr("y", 0 - (margin.top / 4))
          .attr("text-anchor", "middle")  
          .style("font-size", "20px") 
          .attr("font-weight", "bold")
          .style("text-decoration", "underline")  
          .text(department+" Departments");
      
      // Add Y-axis Label which is "Y" here
      svg.append("text")
          .attr("text-anchor", "middle")  
          .attr("style","font-size: 20px;font-style: italic;")
          .attr("font-weight", "bold")
          .attr("transform", "translate("+ (0-(margin.left/2)) +","+(height/2)+") rotate (-90)")  // text is drawn off the screen top left, move down and out and rotate
          .text("Number of Students");

      // Add X-axis Label which is "X" here
      svg.append("text")
          .attr("text-anchor", "middle")  
          .attr("style","font-size: 20px;font-style: italic;")
          .attr("font-weight", "bold")
          .attr("transform", "translate("+ (width/2) +","+(height+(margin.bottom/2))+")")  // centre below axis
          .text("Years");

      });
};
