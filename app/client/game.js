
var landSize;
var blockSize = 200;
var transform2dOffset = 20;
var landSrc = "/img/game/dirt.jpg";


Template.gameIndex.rendered = function() {
    if(!this._rendered) {
      console.log('gameArea render complete');
      landSize = 3;
      $('.land').css("width", blockSize*landSize +50);
      $('.land').css("height", blockSize*landSize +50);

      for (var i = 0 ; i < landSize*landSize; i++){
          $('.land').append("<div style='width:"+ blockSize +"px; height:"+ blockSize +"px;'><img src="+ landSrc +"></img></div>");
          //$('.land').append("<div></div>");
      }




    }
}

Template.gameIndex.events({
  'click .land div': function (event){
      // var left = $(event.target).position().left;
      // var top = $(event.target).position().top;

      var top = $(event.target)[0].getBoundingClientRect().top;
      var left = $(event.target)[0].getBoundingClientRect().left;

      var landTop = $(".land").position().top;
      var landLeft = $(".land").position().left;

      var areaLeft = $(".gamingArea").position().left;


      $(".landDIV").css({top: top-transform2dOffset, left: left-areaLeft+transform2dOffset+30, width:"150px", height:"150px", position:"absolute"});

  },
})
