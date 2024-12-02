export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_STRIPE_PUBLIC_KEY': JSON.stringify('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcdef')
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});