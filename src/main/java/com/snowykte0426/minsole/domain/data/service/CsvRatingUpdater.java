package com.snowykte0426.minsole.domain.data.service;

import com.opencsv.CSVReader;
import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.JaroWinklerDistance;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CsvRatingUpdater {

    private final DataJpaRepository dataJpaRepository;

    @PostConstruct
    public void updateRatingsFromCsv() {
        String csvPath = "/Users/snowykte0426/Programming/BigData-Server/서울관광재단_식당품질정보_20230111.csv"; // CSV 파일 경로

        Map<String, Double> csvRatings = loadCsvData(csvPath);
        List<DataJpaEntity> dbEntities = dataJpaRepository.findAll();

        JaroWinklerDistance jw = new JaroWinklerDistance();
        final double THRESHOLD = 0.90; // 유사도 임계값

        for (DataJpaEntity entity : dbEntities) {
            String bizName = entity.getBizName();
            if (bizName == null) continue;

            double bestScore = 0.0;
            String bestMatch = null;
            for (String csvName : csvRatings.keySet()) {
                double score = jw.apply(bizName, csvName);
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = csvName;
                }
            }

            if (bestScore >= THRESHOLD && bestMatch != null) {
                Double rating = csvRatings.get(bestMatch);
                entity = DataJpaEntity.builder().
                        id(entity.getId()).
                        serviceId(entity.getServiceId()).
                        orgCode(entity.getOrgCode()).
                        manageCode(entity.getManageCode()).
                        bizName(bizName).
                        permitNo(entity.getPermitNo()).
                        roadAddr(entity.getRoadAddr()).
                        jibunAddr(entity.getJibunAddr()).
                        applyDate(entity.getApplyDate()).
                        designateDate(entity.getDesignateDate()).
                        foodType(entity.getFoodType()).
                        naverRating(rating).
                        build();
                log.info("Updated {} with rating {}", bizName, rating);
            }
        }

        dataJpaRepository.saveAll(dbEntities); // 모든 변경 저장
        log.info("네이버 평점 업데이트 완료");
    }

    private Map<String, Double> loadCsvData(String csvFilePath) {
        Map<String, Double> dataMap = new HashMap<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(new FileInputStream(csvFilePath), Charset.forName("EUC-KR")))) {
            List<String[]> allLines = reader.readAll();
            String[] header = allLines.getFirst(); // 헤더 줄

            // "식당명"과 "네이버평점" 컬럼의 인덱스 찾기
            int nameIndex = -1;
            int ratingIndex = -1;
            for (int i = 0; i < header.length; i++) {
                if (header[i].equals("식당명")) nameIndex = i;
                if (header[i].equals("네이버평점")) ratingIndex = i;
            }
            if (nameIndex == -1 || ratingIndex == -1) {
                throw new RuntimeException("CSV 파일에 '식당명' 또는 '네이버평점' 컬럼이 없습니다.");
            }

            // 데이터 읽기
            for (int i = 1; i < allLines.size(); i++) {
                String[] line = allLines.get(i);
                if (line.length <= Math.max(nameIndex, ratingIndex)) continue;

                String name = line[nameIndex];
                String rating = line[ratingIndex];
                if (name != null && rating != null) {
                    dataMap.put(name.trim(), Double.valueOf(rating.trim()));
                }
            }
        } catch (Exception e) {
            log.error("CSV 읽기 실패", e);
        }
        return dataMap;
    }
}