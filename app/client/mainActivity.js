var updateEmpowermentData = function(type, prop){

    if (type == "calculate"){
        var newLink = [];
        var visitedOwner = [];
        var visitedPropertyName = [];

        //get property owner and name
        for (var i = 0 ; i< visitedProperty.length ; i++){

            var flag = true;
            for (var j = 0 ; j < empowerment_properties.length; j++){
                if (visitedProperty[i].id == empowerment_properties[j].id){
                    visitedPropertyName.push(empowerment_properties[j].name);
                    visitedOwner.push(empowerment_properties[j].owner);
                    flag = false;
                }
            }
            if (flag){
                console.log("An error has occured in finding property owner & name");
            }
        }
        console.log(visitedOwner)
        console.log(visitedPropertyName)

        // console.log(visitedProperty);
        // console.log(visitedPropertyName);
        // console.log(visitedOwner);
        // console.log(empowerment_properties);

        var originX, originY;
        var sourceX, sourceY;

        for (var i = 0 ; i < visitedProperty.length-1 ; i++){

            var targetX = Math.floor((Math.random() * 100) + 200);
            var targetY = Math.floor((Math.random() * 100) + 200);
            if (i == 0){
                originX = Math.floor((Math.random() * 100) + 200);
                originY = Math.floor((Math.random() * 100) + 200);
                sourceX = originX;
                sourceY = originY;
            }else{
                sourceX = Math.floor((Math.random() * 100) + 200);
                sourceY = Math.floor((Math.random() * 100) + 200);
            }

            if (i == visitedProperty.length-2){
                targetX = originX;
                targetY = originY;
            }
            var interaction = {};

            interaction.name = 'system matchmaking';
            interaction.give = visitedPropertyName[i];
            interaction.source_affect = 0;
            interaction.receive = "none";
            interaction.target_affect = 0;
            // var source = $(".d3Stakeholder"+visitedOwner[i]).attr("transform").split(/[()]/)[1];
            // sourceX = source.split(",")[0];
            // sourceY = source.split(",")[1];
            // var target =$(".d3Stakeholder"+visitedOwner[i+1]).attr("transform").split(/[()]/)[1];
            // targetX = target.split(",")[0];
            // targetY = target.split(",")[1];

            newLink.push({
                'source': {
                  "id":visitedOwner[i],
                  "index": visitedOwner[i],
                  "name":visitedPropertyName[i],
                  "x":sourceX,
                  "y":sourceY,
                  // "px":sourceX,
                  // "py": sourceY,
                  "weight":1,
                  "benefit":0
                },
                'target': {
                  "id":visitedOwner[i+1],
                  "index": visitedOwner[i+1],
                  "name":visitedPropertyName[i+1],
                  "x":targetX,
                  "y":targetY,
                  // "px":targetX,
                  // "py":targetY,
                  "weight":1,
                  "benefit":0
                },
                "property_id": visitedProperty[i].id,
                'interaction': interaction,
                'weight':0
            });
            //console.log(newLink[i].source);

        }
        console.log(newLink)

        for (var i = 0 ; i < newLink.length ; i++ ){
            var flag = true;
            for (var j = 0 ; j < empowerment_links.length ; j++ ){
                if (newLink[i].source.id == empowerment_links[j].source.id && newLink[i].target.id == empowerment_links[j].target.id){
                    empowerment_links[j].weight = defaultLineWidth;

                    empowerment_links[j].weight += lineWidthOffset;
                    graph.modifyLink(empowerment_links[j].source.id, empowerment_links[j].target.id, empowerment_links[j].weight);
                    flag = false;
                }
            }
            if (flag){
                empowerment_links.push(newLink[i]);
                empowerment_links[j].weight = defaultLineWidth;
                empowerment_links[empowerment_links.length-1].weight += lineWidthOffset;
                graph.addLink("tx", newLink[i].source.id, newLink[i].target.id, empowerment_links[empowerment_links.length-1].weight);

            }

        }
        console.log(empowerment_links);

        //empowerment_links = newLink;
        //updateData(empowerment_stakeholders, empowerment_links, empowerment_properties);
        //benefit_update();
    }

};
