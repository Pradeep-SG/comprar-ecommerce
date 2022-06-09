import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Pradeep S G',
    email: 'pradeep@test.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Tony Stark',
    email: 'tony@marvel.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Bruce Wayne',
    email: 'bruce@dc.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
