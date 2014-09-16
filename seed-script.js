
db.dropDatabase();
var seedUser ={
  firstName:'Azat',
  lastName: 'Mardan',
  displayName: 'Azat Mardan',
  password: '1',
  email:'1@1.com',
  role: 'admin',
  approved: true,
  admin: true
};
db.users.save(seedUser);
