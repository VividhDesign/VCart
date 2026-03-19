import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Sony WH-1000XM4 Headphones',
      slug: 'sony-headphones',
      category: 'Audio',
      image: '/images/p1.jpg',
      price: 299,
      countInStock: 25,
      brand: 'Sony',
      rating: 4.8,
      numReviews: 430,
      description: 'Noise cancelling overhead headphones',
    },
    {
      name: 'Keychron K2 Mechanical Keyboard',
      slug: 'keychron-k2',
      category: 'Accessories',
      image: '/images/p2.jpg',
      price: 150,
      countInStock: 12,
      brand: 'Keychron',
      rating: 4.6,
      numReviews: 120,
      description: 'Wireless mechanical keyboard for mac and windows',
    },
    {
      name: 'Logitech G Pro Wireless Mouse',
      slug: 'logitech-g-pro',
      category: 'Accessories',
      image: '/images/p3.jpg',
      price: 100,
      countInStock: 30,
      brand: 'Logitech',
      rating: 4.9,
      numReviews: 890,
      description: 'Ultra-lightweight gaming mouse',
    },
    {
      name: 'Dell UltraSharp 4K Monitor',
      slug: 'dell-4k-monitor',
      category: 'Displays',
      image: '/images/p4.jpg',
      price: 450,
      countInStock: 5,
      brand: 'Dell',
      rating: 4.7,
      numReviews: 55,
      description: 'Premium color accuracy 4K display',
    },
  ],
};
export default data;
