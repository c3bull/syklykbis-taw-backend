const config = {
  port: process.env.PORT || 3001,
  databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://syklyk:syklyk@cluster0.ugm9l.mongodb.net/syklykbis?retryWrites=true&w=majority',
  JwtSecret: process.env.JWT_SECRET || 'secret'
};

export default config;

