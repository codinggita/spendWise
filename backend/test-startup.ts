process.on('uncaughtException', (e) => {
  console.error('UNCAUGHT EXCEPTION:', e.message);
  console.error(e.stack);
  process.exit(1);
});
process.on('unhandledRejection', (e) => {
  console.error('UNHANDLED REJECTION:', e);
  process.exit(1);
});

console.log('Starting server...');
const { default: server } = await import('./src/server.ts');
console.log('Server module imported');
