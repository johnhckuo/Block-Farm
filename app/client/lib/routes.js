// index

Router.route('/', function () {
  this.render('index');
});


Router.route('/manage', function () {
  this.render('manage');
});

Router.route('/update', function () {
  this.render('updateData');
});

Router.route('/switch', function () {
  this.render('switchStakeholder');
});

Router.route('/aboutus', function () {
  this.render('aboutUs');
});

Router.route('/transaction', function () {
  this.render('transaction');
});


//game
//
Router.route('/game', function () {
  this.render('gameIndex');
});


Router.route( '/verify-email/:token', async function(){
  try{
    var res = await Accounts.verifyEmail( this.params.token);
  }catch(e){
    swal({
      title: "Oops...",
      text: e.reason,
      type: "warning",
      showCancelButton: false
    },
    function(){
      Router.go('/');
    });

  }

  var res = await Meteor.call("API_Register")

  swal({
    title: "Email Verified !",
    text: "You will now redirected to game page",
    type: "success",
    showCancelButton: false
  },
  function(){
    Router.go('/game');
  });

});
