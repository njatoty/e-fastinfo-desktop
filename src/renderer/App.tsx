import { HashRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/auth-context';
import { ProductProvider } from '@/context/product-context';
import { AppRoutes } from '@/routes/index';

import './styles/main.css';

function App() {
  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="electronics-inventory-theme"
    >
      <AuthProvider>
        <ProductProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" />
          </Router>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
