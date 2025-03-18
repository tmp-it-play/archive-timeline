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
		err := f.Close()
		if err != nil {
			fmt.Println("Error closing XLSX file:", err)
		}
	}(f)
	newFile := excelize.NewFile()
	newSheet := "FilteredData"
	_, _ = newFile.NewSheet(newSheet)
	resultRowNum := 1
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
		statusIndex := -1
		for i, col := range rows[0] {
			if col == "영업상태명" {
				statusIndex = i
				break
			}
		}
		if statusIndex == -1 {
			fmt.Printf("Warning: '영업상태명' column not found in sheet %s\n", sheetName)
			continue
		}

		// 헤더를 결과 시트에 복사 (최초 시트의 헤더만 추가하거나, 시트별로 구분하고 싶으면 로직 조정)
		if resultRowNum == 1 {
			for colIdx, colName := range rows[0] {
				cell := fmt.Sprintf("%s%d", string(rune('A'+colIdx)), resultRowNum)
				_ = newFile.SetCellValue(newSheet, cell, colName)
			}
			resultRowNum++
		}

		// 실제 데이터 행 필터링 후 결과 시트에 추가
		for _, row := range rows[1:] {
			if len(row) > statusIndex && row[statusIndex] == "영업" {
				for colIdx, value := range row {
					cell := fmt.Sprintf("%s%d", string(rune('A'+colIdx)), resultRowNum)
					_ = newFile.SetCellValue(newSheet, cell, value)
				}
				resultRowNum++
			}
		}
	}

	outputFilePath := "result/all_restaurant_filtered_data.xlsx"
	err = newFile.SaveAs(outputFilePath)
	if err != nil {
		fmt.Println("Error saving XLSX file:", err)
		return
	}
	fmt.Println("Filtered data saved to:", outputFilePath)
}
