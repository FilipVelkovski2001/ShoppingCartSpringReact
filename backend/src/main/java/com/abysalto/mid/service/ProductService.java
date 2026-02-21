package com.abysalto.mid.service;

import java.util.Map;

public interface ProductService {
    Map<String, Object> getAllProducts(int limit, int skip, String sortBy,
            String order, String search);

    Map<String, Object> getProductById(Integer id);

    Map<String, Object> getCategories();

    Map<String, Object> getProductsByCategory(String category, int limit,
            int skip);
}