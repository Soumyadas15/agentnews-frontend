import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticlePage from "@/pages/ArticlePage";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import Dashboard from "@/pages/Dashboard";

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 1000*60*5, retry: 1 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={
              <div className="py-32 text-center">
                <p className="headline text-[7rem] leading-none opacity-[0.05] select-none">404</p>
                <h1 className="headline text-2xl -mt-6 mb-3">Page not found</h1>
                <a href="/" className="text-[11px] font-semibold uppercase tracking-[0.12em] border-b border-ink pb-0.5 hover:opacity-50 transition-opacity">Back to home</a>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
