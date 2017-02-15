import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });
//
// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

Template.next.events({
  'click button'(event, instance) {

    document.getElementById("buyerInfo").style.display = "inline";
    document.getElementById("sellerInfo").style.display = "inline";

    var temp = document.getElementById("flipper");
    temp.className += " flipperClicked";
    if (character == "seller"){
        document.getElementById("buyerInfo").style.display = "none";
    }else{
        document.getElementById("sellerInfo").style.display = "none";
    }

  },
});

Template.previous.events({
  'click button'(event, instance) {

    document.getElementById("buyerInfo").style.display = "inline";
    document.getElementById("sellerInfo").style.display = "inline";

    var temp = document.getElementById("flipper");
    temp.className = " flipper";

  },
});

Template.submit.events({
  'click button'(event, instance) {
    //instance.counter.set(instance.counter.get() + 1);
  },
});

Template.chooseCharacters.events({
  'click button'(event, instance) {
      document.getElementById("seller").setAttribute("class", "btn btn-default");
      document.getElementById("buyer").setAttribute("class", "btn btn-default");
      event.target.className = "btn btn-info";
      character = event.target.value;
  },
});

Template.arrowDown.events({
  'click a'(event, instance) {
      var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
        scrollDuration = 1000;
      $(window).scrollTo(height, scrollDuration);
  },
});

Template.init.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      console.log('Template render complete');
      var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;
      $(window).scroll(function(){
          if (window.pageYOffset >= height){
              $(".header").addClass("fixed");
          }else{
              $(".header").removeClass("fixed");
          }

      });
    }
}
