package com.snowykte0426.minsole.domain.data.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class XlsxDataImporter {

    private final DataJpaRepository dataRepository;

    @Async
    public CompletableFuture<Void> processRowAsync(Row row, Map<String, Integer> headerMap, long id) {
        try {
            DataJpaEntity entity = buildEntityFromRow(row, headerMap, id);
            dataRepository.save(entity);
        } catch (Exception e) {
            System.err.println("행 처리 중 에러: " + e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    public void importData(String filePath) {
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            if (!rowIterator.hasNext()) {
                throw new IllegalStateException("빈 파일입니다.");
            }

            // 헤더 읽기
            Row headerRow = rowIterator.next();
            Map<String, Integer> headerMap = buildHeaderMap(headerRow);

            List<CompletableFuture<Void>> futures = new ArrayList<>();
            long idCounter = 65525;
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                futures.add(processRowAsync(row, headerMap, idCounter++));
            }
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            System.out.println("데이터 임포트 완료.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Map<String, Integer> buildHeaderMap(Row headerRow) {
        Map<String, Integer> headerMap = new HashMap<>();
        for (Cell cell : headerRow) {
            cell.setCellType(CellType.STRING);
            headerMap.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }
        return headerMap;
    }

    private DataJpaEntity buildEntityFromRow(Row row, Map<String, Integer> headerMap, long id) {
        String serviceId = getStringCellValue(row, headerMap, "serviceId");
        String orgCode = getStringCellValue(row, headerMap, "orgCode");
        String manageCode = getStringCellValue(row, headerMap, "manageCode");
        String bizName = getStringCellValue(row, headerMap, "bizName");
        String permitNo = getStringCellValue(row, headerMap, "permitNo");
        String roadAddr = getStringCellValue(row, headerMap, "roadAddr");
        String jibunAddr = getStringCellValue(row, headerMap, "jibunAddr");
        LocalDate applyDate = getLocalDateFromCell(row, headerMap, "applyDate");
        LocalDate designateDate = getLocalDateFromCell(row, headerMap, "designateDate");
        String foodType = getStringCellValue(row, headerMap, "foodType");
        String mainFood = getStringCellValue(row, headerMap, "mainFood");
        LocalDateTime lastUpdateDate = getLocalDateTimeFromCell(row, headerMap, "lastUpdateDate");
        String phoneNum = getStringCellValue(row, headerMap, "phoneNum");

        return DataJpaEntity.builder()
                .id(id)
                .serviceId(serviceId)
                .orgCode(orgCode)
                .manageCode(manageCode)
                .bizName(bizName)
                .permitNo(permitNo)
                .roadAddr(roadAddr)
                .jibunAddr(jibunAddr)
                .applyDate(applyDate)
                .designateDate(designateDate)
                .foodType(foodType)
                .mainFood(mainFood)
                .lastUpdateDate(lastUpdateDate)
                .phoneNum(phoneNum)
                .build();
    }

    private String getStringCellValue(Row row, Map<String, Integer> headerMap, String fieldName) {
        Integer idx = headerMap.get(fieldName);
        if (idx == null) return null;
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }

    private LocalDate getLocalDateFromCell(Row row, Map<String, Integer> headerMap, String fieldName) {
        Integer idx = headerMap.get(fieldName);
        if (idx == null) return null;
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            } else if (cell.getCellType() == CellType.STRING) {
                String dateStr = cell.getStringCellValue().trim();
                return LocalDate.parse(dateStr);
            }
        } catch (Exception e) {
            System.err.println("LocalDate 파싱 실패: " + cell.toString());
        }
        return null;
    }

    private LocalDateTime getLocalDateTimeFromCell(Row row, Map<String, Integer> headerMap, String fieldName) {
        Integer idx = headerMap.get(fieldName);
        if (idx == null) return null;
        Cell cell = row.getCell(idx);
        if (cell == null) return null;
        try {
            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue();
            } else if (cell.getCellType() == CellType.STRING) {
                String dtStr = cell.getStringCellValue().trim();
                return LocalDateTime.parse(dtStr);
            }
        } catch (Exception e) {
            System.err.println("LocalDateTime 파싱 실패: " + cell.toString());
        }
        return null;
    }
}