function percentScale(){

    d3.select("#p1").append("svg").attr("width", 100).attr("height", 400).attr("id", "tags");

    var tagging = d3.select("#tags");
            tagging.append("text")
            .attr("x", 10)
            .attr("y", 70)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("0%");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 200)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("35%");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 350)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("70%");
}

function numScale(){
    d3.select("#p1").append("svg").attr("width", 100).attr("height", 400).attr("id", "tags");

    var tagging = d3.select("#tags");
            tagging.append("text")
            .attr("x", 10)
            .attr("y", 70)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("0");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 200)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("30000");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 350)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("60000");
}

function numScale(){
    d3.select("#p1").append("svg").attr("width", 100).attr("height", 400).attr("id", "tags");

    var tagging = d3.select("#tags");
            tagging.append("text")
            .attr("x", 10)
            .attr("y", 70)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("0");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 200)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("30000");

            tagging.append("text")
            .attr("x", 10)
            .attr("y", 350)
            .attr("font-size", "30px")
            .style("margin-top", 70)
            .style("margin-left", 100)
            .text("60000");
}

function total(helper){
            helper.append("text")
            .attr("x", 10)
            .attr("y", 70)
            .attr("font-size", "30px")
            .text("Total Colonies Lost: 230020\n");


            helper.append("text")
            .attr("x", 10)
            .attr("y", 100)
            .attr("font-size", "30px")
            .text("Total Percentage Loss: 8.2%");


}

function clean(){
    d3.select("#tags").remove();
}



function parseLine(line) {
    var produce = {}
    produce["state"] = line["State"];
    var crops = []
    for (var i = 0; i < 6; i++) {
        var crop = line[" "+i];
        if (crop != "" && typeof crop != "undefined") {
            var elem = {};
            var ind = crop.indexOf(":");
            if (ind < 0) {
                elem["name"] = crop.trim();
                elem["value"] = 0;
            } else {
                elem["name"] = crop.slice(0, ind).trim();
                elem["value"] = parseInt(crop.slice(ind+1));
            }
            crops.push(elem);
        }
    }
    produce["crops"] = crops;
    return produce;
}

function drawState(id, fips, percentLost, data) {
    d3.select("#"+id).append("div").attr("class", "inner-div");
    var div = d3.select("#"+id+">.inner-div");

    var stateSvg = d3.select("#"+id).append("svg").attr("height", 200).attr("width", 680);

    projection.fitExtent([[0,0], [1000, 600]], states);
    pathGenerator = d3.geoPath().projection(projection);

    var state = states.features.find(function (d) {
        return (d.id == fips);
    })

    var paths = stateSvg.selectAll("path.states").data([state]);

    paths.enter().append("path").attr("class", "states")
    .on("click",function(d){
        document.getElementById("top").scrollIntoView();
    })
    .merge(paths)
    .style("stroke", "E99A35")
    .style("fill", function(state) {
        if (state) {
            if(data.flag == 0 || percentLost == 1){
                return opacityScale(0);
            }
            return opacityScale(percentLost);
        }
    })
    .attr("d", function (state) {
        return pathGenerator(state);
    });


    var bbox = stateSvg.selectAll("path.states").node().getBBox();

    var ratio = 1;
    var scale = "scale(";
    var translate = "translate(";
    if (bbox.height <= bbox.width) {
        ratio = 180 / bbox.width;
        scale += ratio + ")";
        translate += -1 * bbox.x +"," + -1 * bbox.y + ")";
    } else {
        ratio = 180 / bbox.height;
        scale +=  ratio + ")";
        translate += -1 * bbox.x +"," + -1 * bbox.y + ")";
    }

    stateSvg.selectAll("path.states").attr("transform",  scale + " " + translate);
    stateSvg.selectAll("path.states").style("stroke-width", 1);
    stateSvg.selectAll("path.states").attr("vector-effect", "non-scaling-stroke");

}

function updateRec(id,slider,perc,data){
    slider.oninput = function(){
            if(data.flag == 0 || data.percentLost == 1){
                var getNum = document.getElementById("num" + id);
                getNum.innerHTML = "Expected Number of Colonies Left: No projected loss in this state!";
                return;
            }
            var rectangle = d3.select("#rect" + id);
            rectangle.attr("width", 400 - (400*Math.pow(1 - (perc/10), slider.value)));

            var getNum = document.getElementById("num" + id);
            getNum.innerHTML = "Expected Number of Colonies Left: " + (Math.round(data.numColonies * Math.pow(1 - (perc/10), slider.value))).toString();
    }
}

function createRec(id, fips, data){
    var beeSlider = document.getElementById("beeSlider" + id);
    var stateSvg = d3.select("#" + id)
        .append("svg")
        .attr("width", 410)
        .attr("height", 50)
        .style("border", "1px solid black");

    beeArray = [10, 50, 90, 130, 170, 210, 250, 290, 330, 370];


    var imgs = stateSvg.selectAll("img").data(beeArray);
        imgs.enter()
        .append("svg:image")
        .attr("xlink:href", "images/bee.svg")
        .attr("x", function(d) {
            return d;
        })
        .attr("y", "10")
        .attr("width", "30")
        .attr("height", "30");

    var rectangle = stateSvg.append("rect")
        .attr("id", "rect" + id)
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", beeSlider.value * 4)
        .attr("height", 50)
        .style("fill", "white");
    updateRec(id, beeSlider, data.percentLost, data);
}

function drawCrops(id, state) {
    if (state == "District of Columbia") return;

    var crops = produceData.find(function (d) {
        return d.state == state;
    }).crops;
    var stateSvg = d3.select("#"+id+">svg");

    var start = 250;
    var startY = 25;
    var iconSize = 50;

    var format = d3.format(",")

    var div2 = d3.select("#"+id+">.inner-div");

    if (crops[0].name != "Sunflowers") {

        var group = div2.append("g");

        group.append("h3")
        .style("margin-top", 0)
        .style("margin-left", 100)
        .text("Click the book for a recipe you would miss");

        group.append("h3")
        .attr("class", "second-line")
        .style("margin-left", 180)
        .text("if " + crops[0].name.toLowerCase() + " were gone!");

        div2.append("img")
        .attr("src", "images/book.svg")
        .attr("height", 100)
        .attr("width", 100)
        .on("click", function() {
            var name = div2.select(".second-line").text().slice(3, -11);
            printRecipe(div2, name);
        })
        .style("margin-left", 220)
        .style("margin-top", 10);
    }

    crops.forEach(function (crop, i) {
        stateSvg.append("image")
        .attr("href", "images/" + crop.name.toLowerCase() + ".svg")
        .attr("height", iconSize)
        .attr("width", iconSize)
        .attr("x", start + (iconSize + 20)*i)
        .attr("y", startY)
        .on("click", function() {
            if (crop.name != "Sunflowers" && div2.selectAll("img").empty()) printRecipe(div2, crop.name);
            if (!div2.selectAll("img").empty()) {
                div2.select(".second-line").text("if " + crop.name.toLowerCase() + " were gone!");
            }

            var txt = d3.select("#"+id+"value");
            txt.text(crop.value ? "$" + format(crop.value) : "N/A");
            var index = i;
            if (i >= 3) {
                var group = d3.select("#"+id+"money_label");
                group.attr("transform", "translate(210,0)");
                index = i-3;
            } else {
                var group = d3.select("#"+id+"money_label");
                group.attr("transform", "");
            }
            var triangle = d3.select("#"+id+"triangle");
            triangle.attr("transform", "translate("+((iconSize + 20)*index )+", 0)");

            var circle = d3.select("#"+id+"circle");
            circle.attr("transform", "translate("+((iconSize + 20)*i)+", 0)");

        });
    })

    stateSvg.append("circle")
    .attr("id", id + "circle")
    .attr("cx", start + iconSize/2)
    .attr("cy", startY + iconSize/2)
    .attr("r", iconSize/2 +10)
    .attr("stroke", "black")
    .style("stroke-dasharray", ("2,4"))
    .attr("fill", "none");

    var group = stateSvg.append("g").attr("id", id+"money_label");

    group.append("rect")
    .attr("x", start - 20)
    .attr("y", startY + iconSize + startY)
    .attr("width", 220)
    .attr("height", 75)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("fill", "#ffce00");

    var tri = [start + iconSize/2, startY + iconSize + 13,
                    start + iconSize/2 - 10, startY + iconSize + startY,
                    start + iconSize/2 + 10, startY + iconSize + startY];

    group.append("polygon")
    .attr("fill", "#ffce00")
    .attr("id", id+"triangle")
    .attr("points", tri[0] + "," + tri[1] + " " +
                    tri[2] + "," + tri[3] + " " +
                    tri[4] + "," + tri[5]);


    var val = crops[0].value ? "$" + format(crops[0].value) : "N/A";

    group.append("text")
    .attr("x", start - 5)
    .attr("y", startY + iconSize + startY * 2)
    .attr("fill", "white")
    .attr("font-weight", 800)
    .attr("font-size", "1.5em")
    .text("Annual Value:");

    group.append("text")
    .attr("id", id+"value")
    .attr("x", start + 95)
    .attr("y", startY + iconSize + startY * 3 + 15)
    .attr("font-weight", 800)
    .attr("text-anchor", "middle")
    .attr("font-size", "2.5em")
    .text(val);

}

function fipsToIndex(dataArray, FIPS){
    for(var x = 0; x < dataArray.length; x++){
        if(dataArray[x].fips == FIPS){
            return x;
        }
    }
}
