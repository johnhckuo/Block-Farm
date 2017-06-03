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
    sweetAlert( "Oops...", e.reason, 'error' );
    this.render('index');
  }

  var res = await Meteor.call("API_Register")


  //user.profile.address= ";;";
  sweetAlert( "Email Verified!", "yeah", 'success' );
  //this.render('index');

});
