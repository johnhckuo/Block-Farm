
var landSize;
var blockSize = 100;
var transform2dOffset = 40;

Template.gameIndex.rendered = function() {
    if(!this._rendered) {
      console.log('gameArea render complete');
      landSize = 3;
      $('.land').css("width", blockSize*landSize +50);
      $('.land').css("height", blockSize*landSize +50);

      for (var i = 0 ; i < landSize*landSize; i++){
          $('.land').append("<div style='width:"+ blockSize +"px; height:"+ blockSize +"px;'><img src='/img/game/dirt.jpg'></img></div>");
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

      $(".landDIV").css({top: top-transform2dOffset, left: left-areaLeft, width:"100px", height:"100px", position:"absolute"});

  },
})
