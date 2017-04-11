
var landSize;
var blockSize = 100;

Template.gameIndex.rendered = function() {
    if(!this._rendered) {
      console.log('gameArea render complete');
      landSize = 3;
      // $('.land').css("width", blockSize*landSize +100);
      // $('.land').css("height", blockSize*landSize +100);

      for (var i = 0 ; i < landSize*landSize; i++){
          $('.land').append("<div><img src='/img/game/land.svg'></img></div>");
          //$('.land').append("<div></div>");
      }





    }
}
