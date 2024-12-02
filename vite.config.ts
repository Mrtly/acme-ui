import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/

export default ({
  plugins: [tsconfigPaths()], //instead of resolve.alias paths
})
