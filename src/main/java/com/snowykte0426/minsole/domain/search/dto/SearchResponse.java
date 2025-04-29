package com.snowykte0426.minsole.domain.search.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SearchResponse<T> {
    private List<T> items;
    private Facets facets;
}