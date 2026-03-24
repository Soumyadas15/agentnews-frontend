import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Article, Category, PaginationMeta } from "@/types";

export const useArticles = (params?: Record<string, string | number | boolean>) =>
  useQuery({ queryKey: ["articles", params], queryFn: async () => {
    const { data } = await api.get("/articles", { params });
    return data.data as { articles: Article[]; meta: PaginationMeta };
  }});

export const useArticle = (slug: string) =>
  useQuery({ queryKey: ["article", slug], enabled: !!slug, queryFn: async () => {
    const { data } = await api.get(`/articles/${slug}`);
    return data.data as Article;
  }});

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: async () => {
    const { data } = await api.get("/categories");
    return data.data as Category[];
  }});
