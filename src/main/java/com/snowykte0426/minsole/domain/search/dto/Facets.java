package com.snowykte0426.minsole.domain.search.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Facets {
    private List<String> categories;
}