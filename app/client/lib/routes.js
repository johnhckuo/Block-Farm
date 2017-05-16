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
// Router.route('/game', function () {
//   this.render('gameIndex');
// });

Router.route('/game', {
  name: 'gameIndex',
  fastRender: true
});
