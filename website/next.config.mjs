import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/': `${path.resolve(__dirname, './src/')}`,
      '@/public': `${path.resolve(__dirname, './public')}`,
      '@/components': `${path.resolve(__dirname, './src/components')}`,
      '@/styles': `${path.resolve(__dirname, './src/styles')}`,
      '@/app': `${path.resolve(__dirname, './src/app')}`,
      '@/utils': `${path.resolve(__dirname, './src/utils')}`,
      '@/context': `${path.resolve(__dirname, './src/context')}`,
      '@/types': `${path.resolve(__dirname, './src/types')}`,
      '@/hooks': `${path.resolve(__dirname, './src/hooks')}`,
      '@/lib': `${path.resolve(__dirname, './src/lib')}`,
    };

    return config;
  },
  // images: { unoptimized: true },
};

export default nextConfig;
