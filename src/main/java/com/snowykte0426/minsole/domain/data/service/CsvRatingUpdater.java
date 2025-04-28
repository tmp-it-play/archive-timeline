package com.snowykte0426.minsole.domain.data.service;

import com.opencsv.CSVReader;
import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CsvRatingUpdater {

    private final DataJpaRepository dataJpaRepository;

    public void updateRatingsFromCsv() {
        String csvPath = "/Users/snowykte0426/Programming/BigData-Server/서울관광재단_식당품질정보_20230111.csv";

        Map<String, Double> csvRatings = loadCsvData(csvPath);
        List<DataJpaEntity> dbEntities = dataJpaRepository.findAll();
        List<DataJpaEntity> entitiesToUpdate = new ArrayList<>();

        LevenshteinDistance ld = new LevenshteinDistance();
        final double THRESHOLD = 0.88;

        for (DataJpaEntity entity : dbEntities) {
            String bizName = entity.getBizName();
            if (bizName == null) continue;

            double bestScore = 0.0;
            String bestMatch = null;
            for (String csvName : csvRatings.keySet()) {
                int distance = ld.apply(bizName, csvName);
                int maxLength = Math.max(bizName.length(), csvName.length());
                double score = 1.0 - ((double) distance / maxLength);

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = csvName;
                }
            }

            if (bestScore >= THRESHOLD) {
                Double rating = csvRatings.get(bestMatch);
                if (rating != null) {
                    DataJpaEntity updatedEntity = DataJpaEntity.builder()
                            .id(entity.getId())
                            .serviceId(entity.getServiceId())
                            .orgCode(entity.getOrgCode())
                            .manageCode(entity.getManageCode())
                            .bizName(entity.getBizName())
                            .permitNo(entity.getPermitNo())
                            .roadAddr(entity.getRoadAddr())
                            .jibunAddr(entity.getJibunAddr())
                            .applyDate(entity.getApplyDate())
                            .designateDate(entity.getDesignateDate())
                            .foodType(entity.getFoodType())
                            .mainFood(entity.getMainFood())
                            .lastUpdateDate(entity.getLastUpdateDate())
                            .phoneNum(entity.getPhoneNum())
                            .naverRating(rating)
                            .build();
                    entitiesToUpdate.add(updatedEntity);
                    log.info("✅ Updated [{}] with rating [{}]", bizName, rating);
                }
            } else {
                log.info("❌ 매칭 실패, 넘어감: [{}] (bestScore: {})", bizName, bestScore);
            }
        }

        if (!entitiesToUpdate.isEmpty()) {
            dataJpaRepository.saveAll(entitiesToUpdate);
            log.info("🌟 총 {}개 식당 네이버 평점 업데이트 완료!", entitiesToUpdate.size());
        } else {
            log.info("🔵 업데이트할 식당이 없습니다.");
        }
    }

    private Map<String, Double> loadCsvData(String csvFilePath) {
        Map<String, Double> dataMap = new HashMap<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(new FileInputStream(csvFilePath), Charset.forName("EUC-KR")))) {
            List<String[]> allLines = reader.readAll();
            String[] header = allLines.getFirst();

            int nameIndex = -1;
            int ratingIndex = -1;
            for (int i = 0; i < header.length; i++) {
                if (header[i].equals("식당명")) nameIndex = i;
                if (header[i].equals("네이버평점")) ratingIndex = i;
            }
            if (nameIndex == -1 || ratingIndex == -1) {
                throw new RuntimeException("CSV 파일에 '식당명' 또는 '네이버평점' 컬럼이 없습니다.");
            }

            for (int i = 1; i < allLines.size(); i++) {
                String[] line = allLines.get(i);
                if (line.length <= Math.max(nameIndex, ratingIndex)) continue;

                String name = line[nameIndex];
                String rating = line[ratingIndex];
                if (name != null && rating != null && !rating.isEmpty()) {
                    try {
                        dataMap.put(name.trim(), Double.valueOf(rating.trim()));
                    } catch (NumberFormatException e) {
                        log.warn("⚠️ 잘못된 평점 값: {} (무시)", rating);
                    }
                }
            }
        } catch (Exception e) {
            log.error("🚨 CSV 읽기 실패", e);
        }
        return dataMap;
    }
}