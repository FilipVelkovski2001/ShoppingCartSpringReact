package com.abysalto.mid.service.impl;

import com.abysalto.mid.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final RestTemplate restTemplate;

    @Value("${app.dummyjson.base-url}")
    private String baseUrl;

    @Override
    @Cacheable(value = "products", key = "#limit + '-' + #skip + '-' + #sortBy + '-' + #order + '-' + #search")
    public Map<String, Object> getAllProducts(int limit, int skip,
            String sortBy, String order, String search) {
        String url;
        if (search != null && !search.isBlank()) {
            url = String.format(
                    "%s/products/search?q=%s&limit=%d&skip=%d&sortBy=%s&order=%s",
                    baseUrl, search, limit, skip, sortBy, order);
        } else {
            url = String.format(
                    "%s/products?limit=%d&skip=%d&sortBy=%s&order=%s", baseUrl,
                    limit, skip, sortBy, order);
        }
        log.info("Fetching products from: {}", url);
        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    @Cacheable(value = "product", key = "#id")
    public Map<String, Object> getProductById(Integer id) {
        String url = baseUrl + "/products/" + id;
        log.info("Fetching product {} from DummyJSON", id);
        return restTemplate.getForObject(url, Map.class);
    }

    @Override
    @Cacheable(value = "categories")
    public Map<String, Object> getCategories() {
        String url = baseUrl + "/products/categories";
        Object result = restTemplate.getForObject(url, Object.class);
        return Map.of("categories", result);
    }

    @Override
    @Cacheable(value = "productsByCategory", key = "#category + '-' + #limit + '-' + #skip")
    public Map<String, Object> getProductsByCategory(String category, int limit,
            int skip) {
        String url = String.format("%s/products/category/%s?limit=%d&skip=%d",
                baseUrl, category, limit, skip);
        log.info("Fetching products by category: {}", category);
        return restTemplate.getForObject(url, Map.class);
    }
}