package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
)

func main() {
	filePath := "data/all_restaurant_sheet.xlsx"
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		fmt.Println("Error opening XLSX file:", err)
		return
	}
	defer func(f *excelize.File) {
		if err := f.Close(); err != nil {
			fmt.Println("Error closing XLSX file:", err)
		}
	}(f)

	// 결과로 생성할 새 파일
	newFile := excelize.NewFile()

	// 한 시트에 허용할 최대 행 수 (헤더 포함 시 고려)
	const maxRowsPerSheet = 500000

	// 현재 생성된 시트 번호 (FilteredData1, FilteredData2, ...)
	sheetCount := 1
	// 현재 시트 이름
	currentSheetName := fmt.Sprintf("FilteredData%d", sheetCount)
	newFile.NewSheet(currentSheetName)

	// 현재 시트에 기록할 행 번호
	currentRowNum := 0
	// 헤더가 기록되었는지 여부
	headerWritten := false

	// 새로운 시트를 만드는 함수
	createNewSheet := func() {
		sheetCount++
		currentSheetName = fmt.Sprintf("FilteredData%d", sheetCount)
		newFile.NewSheet(currentSheetName)
		currentRowNum = 0
		headerWritten = false
	}

	// 모든 시트를 순회
	sheetList := f.GetSheetList()
	for _, sheetName := range sheetList {
		rows, err := f.GetRows(sheetName)
		if err != nil {
			fmt.Printf("Error reading rows in sheet %s: %v\n", sheetName, err)
			continue
		}
		if len(rows) == 0 {
			fmt.Printf("Warning: Sheet %s is empty.\n", sheetName)
			continue
		}

		// "상세영업상태명" 칼럼 인덱스 찾기
		statusIndex := -1
		for i, col := range rows[0] {
			if col == "상세영업상태명" {
				statusIndex = i
				break
			}
		}
		if statusIndex == -1 {
			fmt.Printf("Warning: '상세영업상태명' column not found in sheet %s\n", sheetName)
			continue
		}

		// 헤더(첫 번째 행)를 결과에 기록 (아직 한 번도 헤더를 쓰지 않았다면)
		// 혹은 새로운 시트가 만들어졌다면 다시 헤더를 써야 함
		if !headerWritten {
			currentRowNum++
			for colIdx, colValue := range rows[0] {
				cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
				_ = newFile.SetCellValue(currentSheetName, cell, colValue)
			}
			headerWritten = true
		}

		// 실제 데이터 행 처리
		for _, row := range rows[1:] {
			// "상세영업상태명"이 "영업"인 행만 필터링
			if len(row) > statusIndex && row[statusIndex] == "영업" {
				currentRowNum++
				// 만약 현재 시트가 maxRowsPerSheet를 넘어가면 새 시트 생성
				if currentRowNum > maxRowsPerSheet {
					createNewSheet()
					// 새 시트에 헤더 기록
					currentRowNum++
					for colIdx, colValue := range rows[0] {
						cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
						_ = newFile.SetCellValue(currentSheetName, cell, colValue)
					}
					currentRowNum++
				}

				// 현재 시트에 데이터 기록
				for colIdx, value := range row {
					cell := fmt.Sprintf("%s%d", colName(colIdx), currentRowNum)
					_ = newFile.SetCellValue(currentSheetName, cell, value)
				}
			}
		}
	}

	// 파일 저장
	outputFilePath := "result/all_restaurant_filtered_data.xlsx"
	err = newFile.SaveAs(outputFilePath)
	if err != nil {
		fmt.Println("Error saving XLSX file:", err)
		return
	}
	fmt.Println("Filtered data saved to:", outputFilePath)
}

// colName 함수: 0 -> "A", 1 -> "B", 2 -> "C", ...
func colName(index int) string {
	// 엑셀 컬럼 인덱스 → 문자열 (A, B, C, ..., AA, AB, ...)
	// 참고: Excel은 26진법(알파벳) 사용
	result := ""
	for index >= 0 {
		result = string(rune('A'+(index%26))) + result
		index = index/26 - 1
	}
	return result
}
