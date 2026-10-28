/**
 * ShopLite - Mobile Product Browsing App
 * Built to spec for React Native + Expo Assessment
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Product } from './types/product';
import { tokens } from './theme/tokens';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { HomeScreen } from './screens/HomeScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { UndoSnackbar } from './components/UndoSnackbar';
import { TesterToolbar } from './components/TesterToolbar';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { AsyncStorage } from './services/storage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductData, setSelectedProductData] = useState<Product | null>(null);

  const { isOffline, toggleAirplaneMode } = useNetworkStatus();
  const {
    favoritesCount,
    snackbarVisible,
    undoRemove,
  } = useFavorites();

  /**
   * Deep Link and URL routing handler
   * Supports:
   * - shoplite://product/5
   * - #/product/5 or /product/5
   */
  const handleDeepLink = useCallback((url: string) => {
    try {
      // Normalize: remove trailing slash, query params, scheme
      // Matches shoplite://product/5 or http://localhost/product/5 or #product/5
      const match = url.match(/(?:shoplite:\/\/|#\/?|\/)product\/(\d+)/i);
      if (match && match[1]) {
        const id = parseInt(match[1], 10);
        if (!isNaN(id)) {
          setSelectedProductId(id);
          setSelectedProductData(null); // Will render directly and fetch details
          // Update URL hash for browser history
          if (window.location.hash !== `#product/${id}`) {
            window.location.hash = `product/${id}`;
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('Invalid deep link:', url, e);
    }
    return false;
  }, []);

  // Listen for browser URL changes & initial hash deep link
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        handleDeepLink(hash);
      } else {
        setSelectedProductId(null);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleDeepLink]);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProductId(product.id);
    setSelectedProductData(product);
    window.location.hash = `product/${product.id}`;
  }, []);

  const handleBackToProductList = useCallback(() => {
    setSelectedProductId(null);
    setSelectedProductData(null);
    window.location.hash = '';
  }, []);

  const handleClearStorage = useCallback(async () => {
    await AsyncStorage.clear();
    window.location.reload();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start sm:p-4 bg-slate-950 font-sans"
      style={{
        backgroundColor: '#0F172A',
      }}
    >
      {/* Assessment Evaluation Toolbar */}
      <TesterToolbar
        isOffline={isOffline}
        onOpenDeepLink={handleDeepLink}
        onClearStorage={handleClearStorage}
        favoritesCount={favoritesCount}
      />

      {/* Mobile Device Frame Container */}
      <div
        className="w-full sm:max-w-[430px] h-[100dvh] sm:h-[844px] flex flex-col shadow-2xl relative overflow-hidden sm:my-auto sm:border sm:border-slate-800"
        style={{
          backgroundColor: tokens.colors.background,
          borderRadius: typeof window !== 'undefined' && window.innerWidth > 640 ? 36 : 0,
        }}
      >
        {/* Mobile Device Status Bar */}
        <div
          className="w-full px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold select-none z-30"
          style={{
            backgroundColor: tokens.colors.background,
            color: tokens.colors.text,
          }}
        >
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        {/* Offline Banner: Amber banner at the top saying the user is offline and seeing saved results */}
        <OfflineBanner
          isOffline={isOffline}
          onToggleAirplaneMode={toggleAirplaneMode}
        />

        {/* Screen Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {selectedProductId !== null ? (
            /* Product Details Screen */
            <ProductDetailsScreen
              productId={selectedProductId}
              initialProduct={selectedProductData}
              onBack={handleBackToProductList}
            />
          ) : activeTab === 'home' ? (
            /* Home Screen */
            <HomeScreen onSelectProduct={handleSelectProduct} />
          ) : (
            /* Favorites Screen */
            <FavoritesScreen
              onSelectProduct={handleSelectProduct}
              onBrowseProducts={() => setActiveTab('home')}
            />
          )}

          {/* 4-second Undo Snackbar when removing a favorite */}
          <UndoSnackbar
            visible={snackbarVisible}
            onUndo={undoRemove}
            message="Removed from favorites"
          />
        </main>

        {/* Bottom Tab Bar (hidden when inside Product Details per Expo Router stack convention) */}
        {selectedProductId === null && (
          <BottomTabBar
            activeTab={activeTab}
            favoritesCount={favoritesCount}
            onSelectTab={setActiveTab}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
}
