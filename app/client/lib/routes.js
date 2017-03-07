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
