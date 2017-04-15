function drawGraph(el) {

    // Add and remove elements on the graph object
    this.addNode = function (id, name) {
        nodes.push({"id":id, "name": name});
        update();
    };

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] == n)||(links[i]['target'] == n))
            {
                links.splice(i,1);
            }
            else i++;
        }
        nodes.splice(findNodeIndex(id),1);
        update();
    };

    this.removeLink = function (source,target){
        for(var i=0;i<links.length;i++)
        {
            if(links[i].source.id == source && links[i].target.id == target)
            {
                links.splice(i,1);
                break;
            }
        }
        update();
    };

    this.removeallLinks = function(){
        links.splice(0,links.length);
        update();
    };

    this.removeAllNodes = function(){
        nodes.splice(0,links.length);
        update();
    };

    this.modifyLink = function (source, target, weight) {
        for (var i = 0 ; i<links.length; i++){
            if (links[i].source == source && links[i].target == target ){
                links[i].weight = weight;
            }
        }
        update();
    };

    this.addLink = function (name, source, target, weight) {
        links.push({"name":name, "source":findNode(source),"target":findNode(target), "weight":weight});
        update();
    };

    var findNode = function(id) {
        for (var i in nodes) {
            if (nodes[i]["id"] === id) return nodes[i];};
    };

    var findNodeIndex = function(id) {
        for (var i=0;i<nodes.length;i++) {
            if (nodes[i].id==id){
                return i;
            }
            };
    };

    // set up the D3 visualisation in the specified element
    var w = 500,
        h = 500;
    var vis = d3.select(".leftPanel")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id","svg")
        .attr("pointer-events", "all")
        .attr("viewBox","0 0 "+w+" "+h)
        .attr("perserveAspectRatio","xMinYMid")
        .append('svg:g');

    var force = d3.layout.force()
        .gravity(.05)
        .distance(100)
        .charge(-100);

    var nodes = force.nodes(),
        links = force.links();

    var update = function () {
          var link = vis.selectAll("line")
            .data(links, function(d) {
                return d.source.id + "-" + d.target.id;
                });

        link.enter().append("line")
            .attr("id",function(d){return d.source.id + "-" + d.target.id;})
            .attr("class","link")
            .style("stroke-width", function(d) { return Math.sqrt(d.weight); });
        link.append("title")
        .text(function(d){
            return d.name;
        });

        link.append("svg:text")
            .attr("class","textClass")
            .text( function(d){return d.name;}) ;
        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id;});

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("svg:circle")
        .attr("r", 16)
        .attr("id",function(d) { return "Node;"+d.id;})
        .attr("class","nodeStrokeClass");

        nodeEnter.append("svg:text")
        .attr("class","textClass")
        .text( function(d){return d.name;}) ;

        node.exit().remove();
        force.on("tick", function() {

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y         + ")"; });

            link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
        });

        // Restart the force layout.
        force
        .gravity(.05)
        .distance(50)
        .linkDistance( 150 )
        .size([w, h])
        .start();
    };


    // Make it all go
    update();
}

// (function(){
//     graph = new drawGraph(".transaction");
//     for (var i = 0 ; i < empowerment_stakeholders.length ; i++){
//         graph.addNode(empowerment_stakeholders[i].id, empowerment_stakeholders[i].name);
//     }
//     for (var j = 0 ; j < empowerment_links.length ; j++){
//         graph.addLink("tx", empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
//     }

//     // fpr (var j = 0 ; j < empowerment_links.length ; j++){
//     //     graph.addLink("tx", empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
//     // }
//
// // graph.addNode('A');
// // graph.addNode('B');
// // graph.addNode('C');
// // graph.addNode('D');
// // graph.addLink('TX2', 'A','C',1);
// // graph.addLink('TX3', 'B','C',10);
// })();
