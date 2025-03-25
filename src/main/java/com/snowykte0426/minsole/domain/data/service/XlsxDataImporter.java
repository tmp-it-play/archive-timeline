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
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class XlsxDataImporter {

    private final DataJpaRepository dataRepository;

    @Async
    public CompletableFuture<Void> processRowAsync(Row row) {
        try {
            DataJpaEntity entity = buildEntityFromRow(row);
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

            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            List<CompletableFuture<Void>> futures = new ArrayList<>();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                futures.add(processRowAsync(row));
            }
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            System.out.println("데이터 임포트 완료.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private DataJpaEntity buildEntityFromRow(Row row) {
        long id = (long) getNumericCellValue(row.getCell(0));
        String serviceId = getStringCellValue(row.getCell(1));
        String orgCode = getStringCellValue(row.getCell(2));
        String manageCode = getStringCellValue(row.getCell(3));
        String bizName = getStringCellValue(row.getCell(4));
        String permitNo = getStringCellValue(row.getCell(5));
        String roadAddr = getStringCellValue(row.getCell(6));
        String jibunAddr = getStringCellValue(row.getCell(7));
        LocalDate applyDate = getLocalDateFromCell(row.getCell(8));
        LocalDate designateDate = getLocalDateFromCell(row.getCell(9));
        String foodType = getStringCellValue(row.getCell(10));
        String mainFood = getStringCellValue(row.getCell(11));
        LocalDateTime lastUpdateDate = getLocalDateTimeFromCell(row.getCell(12));
        String phoneNum = getStringCellValue(row.getCell(13));

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

    private String getStringCellValue(Cell cell) {
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }

    private double getNumericCellValue(Cell cell) {
        if (cell == null) return 0;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                System.err.println("숫자로 변환 불가: " + cell.getStringCellValue());
            }
        }
        return 0;
    }

    private LocalDate getLocalDateFromCell(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        } else if (cell.getCellType() == CellType.STRING) {
            String dateStr = cell.getStringCellValue().trim();
            try {
                return LocalDate.parse(dateStr); // 기본 ISO ("yyyy-MM-dd")
            } catch (DateTimeParseException e) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
                    return LocalDate.parse(dateStr, formatter);
                } catch (DateTimeParseException ex) {
                    System.err.println("LocalDate 파싱 실패: " + dateStr);
                }
            }
        }
        return null;
    }

    private LocalDateTime getLocalDateTimeFromCell(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            return cell.getLocalDateTimeCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            String dtStr = cell.getStringCellValue().trim();
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                return LocalDateTime.parse(dtStr, formatter);
            } catch (DateTimeParseException e) {
                System.err.println("LocalDateTime 파싱 실패: " + dtStr);
            }
        }
        return null;
    }
}